import { Router } from "express";
import * as userController from "../controllers/user.controller";
import * as userValidate from "../validates/user.validate";
import multer from "multer";
import { storage } from "../helpers/cloudinary.helpers";
import * as authMiddleware from "../middlewares/auth.middlewares";


const router = Router();

const upload = multer({ storage: storage });

router.post(
    '/register',
    userValidate.registerPost,
    userController.registerPost
);

router.post(
    '/login',
    userValidate.loginPost,
    userController.loginPost
);

router.patch(
    '/profile',
    authMiddleware.verifyTokenUser,
    upload.single("avatar"),
    userController.profilePatch
);

router.get(
    '/cv/list',
    authMiddleware.verifyTokenUser,
    userController.listCV
);

router.get(
    '/cv/detail/:id',
    authMiddleware.verifyTokenUser,
    userController.detailCV
);
router.delete(
    '/cv/delete/:id',
    authMiddleware.verifyTokenUser,
    userController.deleteCVDel
);



export default router;
