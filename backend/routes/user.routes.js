import { Router } from "express";
import { register, login, getUserProfileAndUserBasedOnUsername } from "../controller/user.controller.js";
import multer from "multer";
import { updateuserprofile, getUserandProfile, uploadProfilePicture, updateProfileData, sendConnectionRequest } from "../controller/user.controller.js";
import { getAllUserProfile } from "../controller/user.controller.js";
import { getConnectionRequest, showMyConnection, acceptConnect } from "../controller/user.controller.js";


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
router.route("/sending_Connection_Request").post(sendConnectionRequest);
router.route("/get_connection_request").get(getConnectionRequest);
router.route("/show_My_connection").get(showMyConnection);
router.route("/accept_connection").get(acceptConnect);
router.route("/user/get_User_Based_on_Username").get(getUserProfileAndUserBasedOnUsername)



export default router;