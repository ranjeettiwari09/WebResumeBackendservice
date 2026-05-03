const Message = require('../models/Message');

// ─── SEND MESSAGE ─────────────────────────────────────────────────────────────
// POST /api/messages
// PUBLIC — anyone can submit a message
const sendMessage = async (req, res) => {
  try {
    const { senderName, senderEmail, message } = req.body;

    if (!senderName || !senderEmail || !message) {
      return res.status(400).json({ message: 'senderName, senderEmail, and message are required.' });
    }

    const newMessage = new Message({ senderName, senderEmail, message });
    await newMessage.save();

    res.status(201).json({ message: 'Message sent successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to send message', error: error.message });
  }
};

// ─── GET ALL MESSAGES ─────────────────────────────────────────────────────────
// GET /api/messages
// OWNER ONLY
const getMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve messages', error: error.message });
  }
};

// ─── MARK MESSAGE AS READ ─────────────────────────────────────────────────────
// PATCH /api/messages/:id/read
// OWNER ONLY
const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const msg = await Message.findByIdAndUpdate(id, { isRead: true }, { new: true });
    if (!msg) return res.status(404).json({ message: 'Message not found' });
    res.status(200).json(msg);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update message', error: error.message });
  }
};

// ─── DELETE MESSAGE ───────────────────────────────────────────────────────────
// DELETE /api/messages/:id
// OWNER ONLY
const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const msg = await Message.findByIdAndDelete(id);
    if (!msg) return res.status(404).json({ message: 'Message not found' });
    res.status(200).json({ message: 'Message deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete message', error: error.message });
  }
};

module.exports = { sendMessage, getMessages, markAsRead, deleteMessage };
