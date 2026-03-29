import express from "express";
import { createUser,loginUser,getSingleUser,getUser,updateUser,deleteUser} from "../controllers/userController.js";
import verifyUserToken from "../middleware/verifyUserToken.js";


const router = express.Router();

router.post("/user/createUser",createUser);
router.post("/user/loginUser",loginUser);
router.get("/user/",verifyUserToken,getUser);
router.get("/user/:id",verifyUserToken,getSingleUser);
router.patch("/user/:id",verifyUserToken,updateUser);
router.delete("/user/:id",verifyUserToken,deleteUser);

export default router;