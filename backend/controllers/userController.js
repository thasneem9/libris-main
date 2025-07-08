import {db} from '../firebase/firebaseAdmin.js'; // Your firebase-admin initialized db
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Token creation helpers
const createAccessToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '40m' });

const createRefreshToken = (userId) =>
  jwt.sign({ id: userId }, process.env.REFRESH_SECRET, { expiresIn: '7d' });

// SIGN UP USER
const signupUser = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;

    // Check for existing user by email or username
    const userQuery = await db
      .collection('users')
      .where('email', '==', email)
      .get();

    const usernameQuery = await db
      .collection('users')
      .where('username', '==', username)
      .get();

    if (!userQuery.empty || !usernameQuery.empty) {
      return res.status(409).json({ message: 'USER ALREADY EXISTS' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user document
    const newUserRef = await db.collection('users').add({
      name,
      username,
      email,
      password: hashedPassword,
      createdAt: new Date()
    });

    const newUserSnapshot = await newUserRef.get();
    const newUser = { id: newUserSnapshot.id, ...newUserSnapshot.data() };

    return res.status(200).json({ message: 'USER CREATED SUCCESSFULLY', newUser });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// LOGIN USER
const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user by username
    const userQuery = await db
      .collection('users')
      .where('username', '==', username)
      .limit(1)
      .get();

    if (userQuery.empty) {
      return res.status(404).json({ message: 'User does not exist' });
    }

    const userDoc = userQuery.docs[0];
    const user = userDoc.data();
    const userId = userDoc.id;

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const accessToken = createAccessToken(userId);
    const refreshToken = createRefreshToken(userId);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'Strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({ accessToken,userId });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// REFRESH ACCESS TOKEN
const refreshAccessToken = (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ error: 'No refresh token' });

  jwt.verify(token, process.env.REFRESH_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: 'Invalid refresh token' });

    const newAccessToken = createAccessToken(decoded.id);
    res.json({ accessToken: newAccessToken });
  });
};

// LOGOUT USER
const logout = (req, res) => {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: true,
    sameSite: 'Strict',
  });
  res.json({ message: 'Logged out' });
};

export { signupUser, loginUser, refreshAccessToken, logout };
