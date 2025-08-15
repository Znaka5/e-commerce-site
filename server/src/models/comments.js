import { Schema, model, Types } from "mongoose";

const commentSchema = new Schema({
    message: {
        type: String,
        required: true,
    },
    rating: {
        type: String,
    },
    post_id: {
        type: Types.ObjectId,
    }
})

const Comment = model("comments", commentSchema)

export default Comment