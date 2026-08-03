import post from "../model/post.model.js";
import User from "../model/user.model.js";
import bcrypt from "bcrypt";
import Profile from "../model/profile.model.js";
import crypto from "crypto";
import { use } from "react";
import PDFDocument from "pdfkit";
import fs from "fs";
import connectionReq from "../model/connection.model.js";

export const ConvertUserDataToPDF = async (userData) => {
    const doc = new PDFDocument();
    const OutputPath = crypto.randomBytes(32).toString("hex") + ".pdf";
    const stream = createWriteStream("uploads/" + OutputPath);

    doc.pipe(stream);

    doc.image(`uploads/${userData.userId.profilePicture})`, { align: "center", width: 100 })
    doc.fontSize(14).text(`Name:$(userData:userId.name)`);
    doc.fontSize(14).text(`Username:${userData.userId.username}`);
    doc.fontSize(14).text(`Email:$(userDta.userId.email)`);
    doc.fontSize(14).text(`Bio:$(userDta.bio)`);
    doc.fontSize(14).text(`Current Position: $(userDta.curreantPosition)`);

    doc.fontSize(14).text("Past work:")
    userData.pastWork.forEach((work, index) => {
        doc.fontSize(14).text(`Company Name: ${work.companyName}`);
        doc.fontSize(14).text(`Position: ${work.position}`);
        doc.fontSize(14).text(`Years: ${work.years}`);
    });

    doc.end();

    return OutputPath;
}


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

        return res.status(200).json({ message: "User successfully registered" });
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
        return res.status(200).json({ message: "user profile updated successfully" });
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
        const { token } = req.query;
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

        console.log(Profiles);
        return res.json({ Profiles });

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

export const downloadProfile = async (req, res) => {

    const user_id = req.query.id;

    const userProfile = await Profile.findOne({ userId: user_id })
        .populate('userId', 'name username email  profilePicture');

    let OutputPath = await ConvertUserDataToPDF(userProfile);

    return res.json({ "message": OutputPath });

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
            return res.status(404).json({ message: " Connection user not found" });
        }

        const ExistingUser = await connectionReq.findOne(
            {
                userId: user._id,
                connectionId: connectionUser._id
            });
        if (ExistingUser) {
            return res.status(400).json({ message: "request already sent" });
        }

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
        return res.status(500).json({ message: "internal server err", err });
    }
}

export const showMyConnection = async (req, res) => {
    try {
        const { token } = req.query;

        const user = await User.findOne({ token });
        if (!user) {
            return res.status(404).json({ message: "user not found" });
        }

        const connections = await connectionReq.findOne({ connectionId: user._Id })
            .populate('connectionId', 'username name email profilePicture');

        return res.json({ connections });
    } catch (err) {
        return res.status(500).json({ message: "internal server err", err });
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
            connection.status_accept = true;
        } else {
            connection.status_accept = false;
        }

        await connection.save();

        return res.json({ messgae: "Requset accepted" });
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

        return res.json({ userProfile });
    } catch (err) {
        return res.status(500).json({ message: "Internal server error", err })
    }
}