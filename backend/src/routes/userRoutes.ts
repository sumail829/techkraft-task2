import express, { Router } from "express";
import { createUser,loginUser,getSingleUser,getUser,updateUser,deleteUser} from "../controllers/userController";
import verifyUserToken from "../middleware/verifyUserToken";


const router: Router = express.Router();

router.post("/user/create",createUser);
router.post("/user/login",loginUser);
router.get("/user/",verifyUserToken,getUser);
router.get("/user/:id",verifyUserToken,getSingleUser);
router.patch("/user/:id",verifyUserToken,updateUser);
router.delete("/user/:id",verifyUserToken,deleteUser);

export default router;