import express, { Router } from "express";
import {
  addFavourite,
  removeFavourite,
  getMyFavourites,
  
} from "../controllers/favouriteController";
import verifyUserToken from "../middleware/verifyUserToken";

const router: Router = express.Router();

router.post("/add", verifyUserToken, addFavourite);
router.delete("/:propertyId", verifyUserToken, removeFavourite);
router.get("/my", verifyUserToken, getMyFavourites);

export default router;