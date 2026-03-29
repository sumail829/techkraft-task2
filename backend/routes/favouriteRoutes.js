import express from "express";
import {
  addFavourite,
  removeFavourite,
  getMyFavourites,
} from "../controllers/favouriteController";
import verifyUserToken from "../middleware/auth";

const router = express.Router();

router.post("/add", verifyUserToken, addFavourite);
router.delete("/remove/:propertyId", verifyUserToken, removeFavourite);
router.get("/my", verifyUserToken, getMyFavourites);

export default router;