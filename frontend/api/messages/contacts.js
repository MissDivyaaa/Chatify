import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePic: { type: String, default: '' },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', userSchema);

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
    await connectDB();

    const filteredUsers = await User.find({ _id: { $ne: decoded._id } }).select('-password');
    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(401).json({ message: 'Unauthorized' });
  }
}