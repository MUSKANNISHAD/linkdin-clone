import { Router } from "express";
import { register, login } from "../controller/user.controller.js";
import multer from "multer";
import { updateuserprofile, getUserandProfile, uploadProfilePicture, updateProfileData, sendConnectionRequest } from "../controller/user.controller.js";
import { getAllUserProfile } from "../controller/user.controller.js";
import { getMyConnectionRequest, showMyConnection, acceptConnect } from "../controller/user.controller.js";


const router = Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads")
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

const upload = multer({ storage: storage });

router.route("/update_profile_picture").post(upload.single('profile_picture'), uploadProfilePicture);
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/updateUserProfile").post(updateuserprofile);
router.route("/get_User_and_Profile").get(getUserandProfile);
router.route("/updateProfileData").post(updateProfileData);
router.route("/get_All_User_Profile").get(getAllUserProfile);
router.route("/sendingConnectionRequest").post(sendConnectionRequest);
router.route("/get_my_connection_request").get(getMyConnectionRequest);
router.route("/show_My_connection").get(showMyConnection);
router.route("/accept_connection").get(acceptConnect);



export default router;