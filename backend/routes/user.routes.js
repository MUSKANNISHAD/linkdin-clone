import { Router } from "express";
import { register, login, getUserProfileAndUserBasedOnUsername, downloadProfile, getUserAndProfileById } from "../controller/user.controller.js";
import multer from "multer";
import { updateuserprofile, getUserandProfile, uploadProfilePicture, updateProfileData, sendConnectionRequest } from "../controller/user.controller.js";
import { getAllUserProfile } from "../controller/user.controller.js";
import { getConnectionRequest, showMyConnection, acceptConnect } from "../controller/user.controller.js";

const router = Router();

// multer is a node.js middlware for express that processes mutilpart/form-data 
// and allows files uploaded by users to be recieved , stored and accessed.


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log("destination called");
        console.log(file);
        cb(null, "./uploads");
    },
    filename: (req, file, cb) => {
        console.log("filename called");
        console.log(file);
        cb(null, file.originalname);
    }
});


const upload = multer({ storage: storage });


router.post(
    "/update_profile_picture",
    (req, res, next) => {
        console.log("Route reached");
        next();
    },
    upload.single("profile_picture"),
    uploadProfilePicture
);

// router.route("/update_profile_picture").post(upload.single('profile_picture'), uploadProfilePicture);

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/update_User_Profile").patch(updateuserprofile);
router.route("/get_User_and_Profile").get(getUserandProfile);
router.route("/update_Profile_Data").post(updateProfileData);
router.route("/download_Profile").get(downloadProfile);
router.route("/get_All_User_Profile").get(getAllUserProfile);
router.route("/sending_Connection_Request").post(sendConnectionRequest);
router.route("/get_connection_request").get(getConnectionRequest);
router.route("/show_My_connection").get(showMyConnection);
router.route("/accept_connection").get(acceptConnect);
router.route("/get_User_and_Profile/:userId").get(getUserAndProfileById)
router.route("/get_User_Based_on_Username").get(getUserProfileAndUserBasedOnUsername);

export default router;

