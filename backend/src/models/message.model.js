import mongoose from "mongoose";

const messageSchema = mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },

    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
    },

    delivered: {
      type: Boolean,
      default: false,
    },

    read: {
      type: Boolean,
      default: false,
    },

    readBy: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      readAt: {
        type: Date,
        default: Date.now,
      },
    }],
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;
