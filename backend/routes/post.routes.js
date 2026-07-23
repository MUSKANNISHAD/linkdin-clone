import { Router } from "express";
import { activeCheck } from "../controller/post.controller.js";
import { createPost,likesIncrement, getAllPosts, deletePost } from "../controller/post.controller.js";
import { PostComment, delete_user_comment, get_comments_by_post } from "../controller/post.controller.js";

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

router.route("/").get(activeCheck);

router.route("/post").post(upload.single('media'), createPost);
router.route("/get_All_Posts").get(getAllPosts);
router.route("/delete_Post").delete(deletePost);
router.route("/createComment").post(PostComment);
router.route("/get_comments_by_post").get(get_comments_by_post);
router.route("/delete_user_comment").delete(delete_user_comment);
router.route("/likes_increment").post(likesIncrement);

export default router;