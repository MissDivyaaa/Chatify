import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

const messageSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String },
  image: { type: String },
}, { timestamps: true });

const Message = mongoose.models.Message || mongoose.model('Message', messageSchema);

const connectDB = async () => {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect(process.env.MONGO_URI);
};

const authenticate = (req) => {
  const token = req.cookies.token;
  if (!token) throw new Error('No token');
  return jwt.verify(token, process.env.JWT_SECRET);
};

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const decoded = authenticate(req);
    const { id: userToChatId } = req.query;

    await connectDB();

    const messages = await Message.find({
      $or: [
        { senderId: decoded._id, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: decoded._id },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}