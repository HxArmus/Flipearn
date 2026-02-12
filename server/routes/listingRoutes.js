import express from "express"
import { addCredential, addListings, deleteUserListing, getAllPublicListing, getAllUserListing, getAllUserOrders, markFeatured, purchaseAccount, toggleStatus, updateListing, widthDrawnAmount } from "../controllers/listingController.js"
import { protect } from "../middlewares/authMiddleware.js"
import upload from "../lib/multer.js"

const router = express.Router()

router.post("/", upload.array("images", 5), protect, addListings)
router.put("/", upload.array("images", 5), protect, updateListing)
router.get("/public", getAllPublicListing)
router.get("/user", protect, getAllUserListing)
router.put("/:id/status", protect, toggleStatus)
router.delete("/:listingId", protect, deleteUserListing)
router.post("/add-credential", protect, addCredential)
router.put("/featured/:id", protect, markFeatured)
router.get("/user-orders", protect, getAllUserOrders)
router.post("/withdrawn", protect, widthDrawnAmount)
router.post("/purchase-account/:listingId",protect,purchaseAccount)


export default router;