const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  getUsers,
  sendMessage,
  getConversation,
  markAsRead,
} = require("../controllers/chatController");

router.get("/users", protect, getUsers);
router.post("/send", protect, sendMessage);
router.get("/conversation/:userId", protect, getConversation);
router.patch("/read/:userId", protect, markAsRead);

module.exports = router;