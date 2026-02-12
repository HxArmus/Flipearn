import express from "express"
import {protect} from "../middlewares/authMiddleware.js"
import { getAllUserChats, getChat, sendChatMessage } from "../controllers/chatController.js"

const Chatrouter = express.Router()

Chatrouter.post("/",protect,getChat)
Chatrouter.get("/user",protect,getAllUserChats)
Chatrouter.post("/send-message",protect,sendChatMessage)


export default Chatrouter;