import { Inngest } from "inngest";
import { prisma } from "../lib/prisma.js";
import sendEmail from "../controllers/nodemailer.js";

/**
 * @typedef {{ name: string; value: string; type?: string }} CredentialField
 */

/**
 * Ensure we only attempt to render credential objects that match the structure
 * we store from the admin panel.
 * @param {unknown} fields
 * @returns {CredentialField[]}
 */
const normalizeCredentialFields = (fields) => {
  if (!Array.isArray(fields)) return [];
  return fields.filter((field) =>
    field && typeof field === "object" && "name" in field && "value" in field
  );
};


// Create a client to send and receive events
export const inngest = new Inngest({ id: "my-app" });

//inngest function to save user data to a database
const syncUserCreation = inngest.createFunction(
  { id: "sync-user-from-clerk" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    const { data } = event;
    //check if user already exists in the database
    const user = await prisma.user.findFirst({
      where: { id: data.id },
    });
    if (user) {
      //update user data if it exists
      await prisma.user.update({
        where: { id: data.id },
        data: {
          email: data?.email_addresses[0]?.email_address,
          name: data?.first_name + " " + data?.last_name,
          image: data?.image_url,
        },
      });
      return;
    }
    await prisma.user.create({
         data: {
            id: data.id,
          email: data?.email_addresses[0]?.email_address,
          name: data?.first_name + " " + data?.last_name,
          image: data?.image_url,
        },

    });
  },
);
//inngest function to delete user from database
const syncUserDeletion = inngest.createFunction(
  { id: "delete-user-from-clerk" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    const { data } = event;

    const listings = await prisma.listing.findMany({
      where: { ownerId: data.id },
    });
    const chats = await prisma.chat.findMany({
      where: { OR: [{ ownerUserId: data.id }, { chatUserId: data.id }] },
    });
    const transactions = await prisma.transaction.findMany({
      where: { userId: data.id },
    });

    if (
      listings.length === 0 &&
      chats.length === 0 &&
      transactions.length === 0
    ) {
      await prisma.user.delete({ where: { id: data.id } });
    } else {
      // deactivate dependent listings when the user still has linked data
      await prisma.listing.updateMany({
        where: { ownerId: data.id },
        data: { status: "inactive" },
      });
    }
  },
);
// Inngest function to update user data in the database
const syncUserUpdation = inngest.createFunction(
  { id: "update-user-from-clerk" },
  { event: "clerk/user.updated" },
  async ({ event }) => {
    const { data } = event;
    //check if user already exists in the database
    
    
    await prisma.user.update({
        where:{id:data.id},
         data: {
            id: data.id,
          email: data?.email_addresses[0]?.email_address,
          name: data?.first_name + " " + data?.last_name,
          image: data?.image_url,
        },

    });
  },
);
//inngest function to send email to the customer
const sendPurchaseEmail = inngest.createFunction(
    { id: "send-pruchase-email" },
    { event: "app/purchase" },
    async ({ event }) => {
        const { transaction } = event.data

        const customer = await prisma.user.findFirst({
            where: { id: transaction.userId }
        })
        const listing = await prisma.listing.findFirst({
            where: { id: transaction.listingId }
        })

        const credential = await prisma.credential.findFirst({
            where: { listingId: transaction.listingId }
        })

        const updatedCredentials = normalizeCredentialFields(
          credential?.updatedCredential,
        );

        await sendEmail({
            to: customer.email,
            subject: "Your credentials for the account you purchased",
            html: `
                <h2><Thank you fot purchasing account @${listing.username}  of ${listing.platform}</h2>
                <p>Here are your credentials for the listing you purchased.</p>
                <h3>New Credentials</h3>
                <div>
                ${updatedCredentials
                  .map((cred) => `<p>${cred.name} :  ${cred.value}</p>`)
                  .join("")}
                </div>
                <p>
                If have any questions, please contact us at <a href="mailto:support@example.com">support@example.com</aI> 
                </p>
            `,

        })

    }
)


const sendNewCredentials = inngest.createFunction(
    { id: "send-new-credentials" },
    { event: "app/listing-deleted" },
    async ({ event }) => {
        const { listing, listingId } = event.data

        const newCredential = await prisma.credential.findFirst({
            where: { listingId }
        })

        if (newCredential) {
            const updatedCredentials = normalizeCredentialFields(
              newCredential.updatedCredential,
            )

            const originalCredentials = normalizeCredentialFields(
              newCredential.originalCredential,
            )

            await sendEmail({
                to: listing.owner.email,
                subject: "New credentials for your deleted listing",
                html: `
                    <h2>Your new credentials for your deletd listing:</h2>
                    title: ${listing.title}
                    <br/>
                    username : ${listing.username}
                    <br/>
                    platform: ${listing.platform}
                    <br/>
                    <h3>New Credetials</h3>
                    <div>
                        ${updatedCredentials
                          .map((cred) => `<p>${cred.name} :  ${cred.value}</p>`)
                          .join("")}
                    </div>
                    <h3>Old Credentials</h3>
                    <div>
                        ${originalCredentials
                          .map((cred) => `<p>${cred.name} :  ${cred.value}</p>`)
                          .join("")}
                    </div>
                    <p>
                If have any questions, please contact us at <a href="mailto:support@example.com">support@example.com</aI> 
                </p>

                    `
            })
        }
    }
)


// Create an empty array where we'll export future Inngest functions
export const functions = [syncUserCreation, syncUserDeletion,syncUserUpdation,sendPurchaseEmail,sendNewCredentials];
