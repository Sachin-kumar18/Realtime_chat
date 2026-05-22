const User = require("../models/userModel");
const Message = require("../models/Message");
const mongoose = require("mongoose");

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user.id } }).select(
      "name email profilePic isOnline",
    );
    res.status(200).json({ status: "success", users });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, content } = req.body;

    if (!receiverId || !content?.trim()) {
      return res
        .status(400)
        .json({ message: "receiverId and content are required" });
    }

    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ message: "Receiver not found" });
    }

    const message = await Message.create({
      senderId: req.user.id,
      receiverId,
      content,
    });

    res.status(201).json({ status: "success", message });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getConversation = async (req, res) => {
  try {
    const { userId } = req.params;
    const myId = req.user.id.toString();

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userId },
        { senderId: userId, receiverId: myId },
      ],
    }).sort({ createdAt: 1 }); 

    res.status(200).json({ status: "success", messages });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const { userId } = req.params;
    const myId = req.user.id;

    const result = await Message.updateMany(
      { senderId: userId, receiverId: myId, status: { $ne: "read" } },
      { $set: { status: "read" } },
    );

    res.status(200).json({
      status: "success",
      updated: result.modifiedCount,
      message: "Messages marked as read",
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
