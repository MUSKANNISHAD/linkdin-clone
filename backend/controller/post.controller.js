import Post from "../model/post.model.js";
import User from "../model/user.model.js";
import bcrypt from "bcrypt";
import Profile from "../model/profile.model.js";
import Comment from "../model/comments.model.js";

export const activeCheck = async (req, res) => {
    return res.status(200).json({ message: "running" });
}

export const createPost = async (req, res) => {
    const { token } = req.body;
    try {
        const user = await User.findOne({ token });
        if (!user) {
            return res.status(404).json({ message: "user not found" });
        }

        const post = new Post({
            userId: user._id,
            body: req.body.body,
            media: req.file != undefined ? req.file.filename : "",
            fileType: req.file != undefined ? req.file.mimetype.split("/")[1] : ""

        })
        await post.save();

        return res.status(200).json({ message: "post created" });
    }
    catch (err) {
        console.error(err);

        return res.status(500).json({
            message: "Internal server error",
            error: err.message
        });
    }
}


export const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find().populate('userId', 'name username email profilePicture');
        return res.json({ posts });

    } catch (err) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const deletePost = async (req, res) => {
    const { token, post_id } = req.body;
    try {
        const user = await User.findone({ token });
        if (!user) {
            return res.status(404).json({ message: "user not found" });
        }
        const post = await Post.findOne({ _id: post_id });
        if (!post) {
            return res.status(404).json({ message: "post not found" });
        }

        if (post.userId.toString() !== user._id.toString()) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        await Post.deleteOne({ _id: post_id });

        return res.json({ message: "post deleted" });
    } catch (err) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const PostComment = async (req, res) => {
    const { token, post_id, commentBody } = req.body;
    try {
        const user = await User.findOne({ token });
        if (!user) {
            return res.status(404).json({ message: "user not found" }).select("_id");
        }

        const post = await Post.findOne({ "_id": post_id });
        if (!post) {
            return res.status(404).json({ message: "post not found" });
        }

        const comment = new Comment({
            userId: user._id,
            postId: post_id,
            body: commentBody
        })
        await comment.save();

        return res.status(200).json({ message: "You commented ", comment });
    } catch (err) {
        console.error(err);

        return res.status(500).json({
            message: "Internal server error",
            error: err.message
        });
    }
}

export const get_comments_by_post = async (req, res) => {
    const { post_id } = req.query;
    try {
        const post = await Post.findOne({ "_id": post_id });
        if (!post) {
            return res.status(404).json({ message: "post not found" });
        }

        const Comments = await Comment
            .find({ postId: post_id })
            .populate("userId", "username  name");


        return res.json(Comments.reverse());
    } catch (err) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const delete_user_comment = async (req, res) => {
    const { token, comment_id } = req.body;
    try {
        const user = await User.findOne({ token });
        if (!user) {
            return res.status(404).json({ message: "user not found" }).select("_id");
        }
        const comment = await Comment.findOne({ "_id": comment_id });
        if (!comment) {
            return res.status(404).json({ message: "comment not found" });
        }

        if (comment.userId.toString() !== user._id.toString()) {
            return res.status(401).json({ message: "UNAUTHORIZED" });
        }

        await Comment.deleteOne({ "_id": comment_id });
        return res.json({ message: "Comment deleted" });

    } catch (err) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const likesIncrement = async (req, res) => {
    const { post_id } = req.body;
    try {
        const post = await Post.findOne({ "_id": post_id });
        if (!post) {
            return res.status(404).json({ message: "post not found" });
        }

        post.likes = post.likes + 1;
        await post.save();

        return res.json({ message: "likes incremented" });
    } catch (err) {
        return res.status(500).json({ message: "Internal server error" });
    }
}