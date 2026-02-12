import express from "express"
import "dotenv/config";
import cors from "cors"
import { clerkMiddleware } from '@clerk/express'
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js"
import router from "./routes/listingRoutes.js";
import Chatrouter from "./routes/chatRoutes.js";
import adminRouter from "./routes/adminRoutes.js";

const app = express();
app.use(express.json());
app.use(cors());
app.use(clerkMiddleware());



app.get("/",(req,res)=>res.send("server is Live !"));
app.use("/api/inngest", serve({ client: inngest, functions }));

app.use("/api/listing",router)
app.use("/api/chat",Chatrouter)
app.use("/api/admin",adminRouter)

const PORT =process.env.PORT || 3000;
app.listen(PORT,()=>{console.log(`server running on port ${PORT}`)})
