import post from "../model/post.model.js";
import User from "../model/user.model.js";
import bcrypt from "bcrypt";
import Profile from "../model/profile.model.js";
import crypto from "crypto";
import { use } from "react";
import PDFDocument from "pdfkit";
import fs from "fs";
import connectionReq from "../model/connection.model.js";
import { createWriteStream } from "fs";



export const ConvertUserDataToPDF = async (userData) => {
    const doc = new PDFDocument();

    const outputPath = crypto.randomBytes(32).toString("hex") + ".pdf";

    const stream = createWriteStream("uploads/" + outputPath);

    doc.pipe(stream);
    console.log("userData is : ", userData);

    doc.image(`uploads/${userData.userId.profilePicture}`, {
        align: "center",
        width: 100
    });

    doc.moveDown();
    doc.moveDown();

    doc.fontSize(14).text(`Name: ${userData.userId.name}`);
    doc.fontSize(14).text(`Username: ${userData.userId.username}`);
    doc.fontSize(14).text(`Email: ${userData.userId.email}`);
    doc.fontSize(14).text(`Bio: ${userData.bio}`);
    doc.fontSize(14).text(`Current Position: ${userData.currentPost}`);

    doc.moveDown();

    doc.fontSize(14).text("Past Work:-");

    userData.pastWork.forEach((work) => {
        doc.text(`Company Name: ${work.company}`);
        doc.text(`Position: ${work.position}`);
        doc.text(`Years: ${work.years}`);
    });

    doc.moveDown();

    doc.fontSize(14).text("Education :-");

    userData.education.forEach((study) => {
        doc.text(`Institute is:${study.Institute}`);
        doc.text(`degree:${study.degree}`);
        doc.text(`fieldofStudy:${study.fieldofStudy}`);
        doc.moveDown();
    });

    doc.end();

    await new Promise((resolve) => {
        stream.on("finish", resolve);
    });
    return outputPath;
};


export const register = async (req, res) => {
    try {
        const { name, username, email, password } = req.body;
        if (!name || !username || !email || !password) {
            return res.status(400).json({ message: "All feilds are required" });
        }

        const existUser = await User.findOne({ email });
        if (existUser) {
            return res.status(400).json({ message: "user already exist" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            name,
            username,
            password: hashedPassword,
            email
        })

        await newUser.save();

        const profile = new Profile({ userId: newUser._id });

        await profile.save();

        return res.status(200).json({ message: "User successfully registered", newUser });
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}

export const login = async (req, res) => {
    try {
        const { password, email } = req.body;
        if (!password || !email) {
            return res.status(400).json({ message: "All feilds are required" });
        }

        const userFound = await User.findOne({ email })

        if (!userFound) {
            return res.status(404).json({ message: "user not found" });
        }

        const isMatch = await bcrypt.compare(password, userFound.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid creadentials" })
        }

        const token = crypto.randomBytes(32).toString("hex");

        userFound.token = token;

        await userFound.save();

        return res.status(200).json({
            message: "Logged in",
            token: token
        });

    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}


export const uploadProfilePicture = async (req, res) => {
    const { token } = req.body;
    try {
        const user = await User.findOne({ token: token });

        if (!user) {
            return res.status(404).json({ message: "user not found" });
        }

        user.profilePicture = req.file.filename;

        await user.save();

        return res.json({ message: "profile picture updated" });

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            message: "internal server error",
            error: err.message,
            stack: err.stack
        });
    }
}

export const updateuserprofile = async (req, res) => {
    try {
        const { token, ...newUserData } = req.body;
        const user = await User.findOne({ token: token });
        if (!user) {
            return res.status(404).json({ message: "user not found" });
        }
        const { username, email } = newUserData;

        const existingUser = await User.findOne({ $or: [{ username }, { email }] })

        if (existingUser) {
            if (String(existingUser._id) !== String(user._id)) {
                return res.status(400).json({
                    message: "user already exists"
                });
            }
        }

        Object.assign(user, newUserData);

        await user.save();
        return res.status(200).json({ message: "user profile updated successfully", user });
    } catch (err) {
        return res.status(500).json({
            message: "internal server error",
            error: err.message,
            stack: err.stack
        });
    }
}


export const getUserandProfile = async (req, res) => {
    try {
        const  token  = req.query.token;
        const user = await User.findOne({ token: token });
        if (!user) {
            return res.status(404).json({ message: "user not found" });
        }

        console.log(user);

        const userProfile = await Profile.findOne({ userId: user._id })
            .populate('userId', 'name username email profilePicture');

        console.log(userProfile);
        return res.json({ "profile": userProfile });

    } catch (err) {
        return res.status(500).json({
            message: "internal server error",
            error: err.message,
            stack: err.stack
        });
    }
}

export const updateProfileData = async (req, res) => {
    try {
        const { token, ...newProfileData } = req.body;

        const userProfile = await User.findOne({ token: token });
        if (!userProfile) {
            return res.status(404).json({ message: "user not found" });
        }

        const Profile_to_Update = await Profile.findOne({ userId: userProfile.id });

        Object.assign(Profile_to_Update, newProfileData);

        await Profile_to_Update.save();

        return res.status(200).json({ message: "profile updated successfully", Profile_to_Update });

    } catch (err) {
        return res.status(500).json({
            message: "internal server error",
            error: err.message,
            stack: err.stack
        });
    }
}

export const getAllUserProfile = async (req, res) => {
    try {
        const Profiles = await Profile.find().populate("userId", 'name username email profilePicture');

        return res.json({ Profiles });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

export const downloadProfile = async (req, res) => {
    const user_id = req.query.id;
    try {
        if (!user_id) {
            return res.status(400).json({ message: "user not found" });
        }

        const userProfile = await Profile.findOne({ userId: user_id })
            .populate('userId', 'name username email  profilePicture');

        let OutputPath = await ConvertUserDataToPDF(userProfile);

        return res.json({ "message(your Profile)": OutputPath });
    } catch (err) {
        return res.status(500).json({
            message: "internal server error",
            error: err.message,
            stack: err.stack
        });
    }
}

export const sendConnectionRequest = async (req, res) => {
    try {
        const { token, connectionId } = req.body;

        const user = await User.findOne({ token });

        if (!user) {
            return res.status(404).json({ message: "user not found" });
        }

        const connectionUser = await User.findOne({ _id: connectionId });

        if (!connectionUser) {
            return res.status(404).json({ message: " Connection Id is Invalid" });
        }

        const ExistingUser = await connectionReq.findOne(
            {
                user_Id: user._id,
                connection_id: connectionUser._id
            });
        if (ExistingUser) {
            return res.status(400).json({ message: "request already sent" });
        }

        const request = new connectionReq({
            user_Id: user._id,
            connection_id: connectionUser._id
        })

        await request.save();
        return res.status(200).json({ message: "Connection sent" });

    } catch (err) {
        return res.status(500).json({ message: "internal server err", err });
    }
}


export const getConnectionRequest = async (req, res) => {
    try {
        const { token } = req.body;

        const user = await User.findOne({ token });
        if (!user) {
            return res.status(404).json({ message: "user not found" });
        }

        const connections = await connectionReq.findOne({ userId: user._Id })
            .populate('connectionId', 'username name email profilePicture');

        return res.json({ connections });

    } catch (err) {
        return res.status(500).json({
            message: "internal server error",
            error: err.message,
            stack: err.stack
        });
    }
}

export const showMyConnection = async (req, res) => {
    try {
        const { token } = req.query;

        const user = await User.findOne({ token });
        if (!user) {
            return res.status(404).json({ message: "user not found" });
        }

        const connections = await connectionReq.findOne({ connection_id: user._Id })
            .populate('connectionId', 'username name email profilePicture');

        return res.json({ connections });
    } catch (err) {
        return res.status(500).json({
            message: "internal server error",
            error: err.message,
            stack: err.stack
        });
    }
}

export const acceptConnect = async (req, res) => {
    const { token, requestId, action_type } = req.body;
    try {
        const user = await User.findOne({ token });
        if (!user) {
            return res.status(404).json({ message: "user not found" });
        }
        const connection = await connectionReq.findOne({ _id: requestId });
        if (!connection) {
            return res.status(404).json({ message: "connection not found" });
        }

        if (action_type === "accept") {
            connection.status = true;
        } else {
            connection.status = false;
        }

        await connection.save();

        return res.json({ messgae: "Request accepted", connection });
    } catch (err) {
        return res.status(500).json({ message: "internal server err", err });
    }
}


export const getUserProfileAndUserBasedOnUsername = async (req, res) => {
    const { username } = req.query;
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(200).json({ message: "user not found" });
        }

        const userProfile = await Profile.findOne({ userId: user._Id })
            .populate('userId', 'username name email profilePicture');

        console.log("userProfile", userProfile);

        return res.json({ userProfile });
    } catch (err) {
        return res.status(500).json({ message: "Internal server error", err })
    }
}

export const getUserAndProfileById = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        const profile = await Profile.findOne({
            userId: userId
        });
        if (!profile) {
            return res.status(400).json({ message: " Profile not found" });
        }

        return res.status(200).json({ user, profile });
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};