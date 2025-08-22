import catchAsync from "../utils/catchAsync.js";
import ErrorHandler from "../utils/errorHandler.js";
import { Chat, Message } from "../models/index.js";

export const getConversationMessages = catchAsync(async (req, res, next) => {
  const { id: chatId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  // Verify user has access to this chat
  const chat = await Chat.findById(chatId);
  if (!chat) {
    return next(new ErrorHandler("Conversation not found", 404));
  }

  if (!chat.users.includes(req.user._id)) {
    return next(new ErrorHandler("Access denied to this conversation", 403));
  }

  const messages = await Message.find({ chat: chatId })
    .populate({
      path: "sender",
      select: "username email photoURL",
    })
    .populate({
      path: "readBy.user",
      select: "username email",
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const totalMessages = await Message.countDocuments({ chat: chatId });

  res.status(200).json({
    success: true,
    messages: messages.reverse(), // Return in chronological order
    pagination: {
      page,
      limit,
      total: totalMessages,
      pages: Math.ceil(totalMessages / limit),
    },
  });
});
