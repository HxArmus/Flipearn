import { clerkClient } from '@clerk/express'
import { prisma } from "../lib/prisma.js"

const getPrimaryEmail = (user) =>
    user.emailAddresses?.find((email) => email.id === user.primaryEmailAddressId)?.emailAddress ||
    user.emailAddresses?.[0]?.emailAddress ||
    `${user.id}@clerk.local`

const getDisplayName = (user) =>
    [user.firstName, user.lastName].filter(Boolean).join(" ").trim() ||
    user.username ||
    getPrimaryEmail(user)

const syncAuthenticatedUser = async (userId) => {
    const existingUser = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true },
    })

    if (existingUser) return

    const clerkUser = await clerkClient.users.getUser(userId)

    await prisma.user.upsert({
        where: { id: userId },
        update: {
            email: getPrimaryEmail(clerkUser),
            name: getDisplayName(clerkUser),
            image: clerkUser.imageUrl || "",
        },
        create: {
            id: userId,
            email: getPrimaryEmail(clerkUser),
            name: getDisplayName(clerkUser),
            image: clerkUser.imageUrl || "",
        },
    })
}

export const protect = async (req,res ,next )=>{
    try{
        const {userId, has} = await req.auth();
        if(!userId) return res.status(401).json({message:"unauthorized"});

        const hasPremiumPlan = await has({plan:"premium"});
        req.plan = hasPremiumPlan ? "premium": "free";
        await syncAuthenticatedUser(userId);
        return next()

    }catch(error){
        console.log(error);
        res.status(401).json({ message: error.code || error.message});

    }
}

export const protectAdmin = async (req, res, next) => {
    try {
        const { userId } = await req.auth()
       
        const user  = await clerkClient.users.getUser(userId)
       
        const isAdmin = process.env.ADMIN_EMAILS.split(",").includes(user.emailAddresses[0].emailAddress)
        if (!isAdmin) {
            return res.status(401).json({ message: "Unauthorized" })
        }
        return next()
    } catch (error) {
        console.log(error)
        res.status(401).json({ message: error.code || error.message })

    }
}
