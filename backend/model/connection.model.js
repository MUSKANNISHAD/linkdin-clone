import mongoose from "mongoose";


const connectionRequest = new mongoose.Schema({
    user_Id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    connection_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
    },
    statue: {
        type: Boolean,
        default: null
    }
})

const connectionReq = mongoose.model("ConnectionRequest", connectionRequest);

export default connectionReq;