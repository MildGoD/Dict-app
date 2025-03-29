require('dotenv').config();

const config = require('./config.json');
const mongoose = require('mongoose');

mongoose.connect(config.connectionString);

const User = require('./models/user.model');
const Note = require('./models/note.model');

const express = require('express');
const cors = require('cors');
const app = express();

const jwt = require('jsonwebtoken');
const { authenticateToken } = require('./utilities');

app.use(express.json());

app.use(
  cors({
    origin: '*',
  })
);

app.get('/', (req, res) => {
  res.json({ data: 'hello' });
});

// Create Account
app.post('/create-account', async (req, res) => {
  const { fullName, email, password } = req.body;

  if (!fullName) {
    return res
      .status(400)
      .json({ error: true, message: 'Full Name is required' });
  }

  if (!email) {
    return res.status(400).json({ error: true, message: 'Email is required' });
  }

  if (!password) {
    return res
      .status(400)
      .json({ error: true, message: 'Password is required' });
  }

  const isUser = await User.findOne({ email: email });

  if (isUser) {
    return res.json({
      error: true,
      message: 'User already exist',
    });
  }

  const user = new User({
    fullName,
    email,
    password,
  });

  await user.save();

  const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '36000m',
  });

  return res.json({
    error: false,
    user,
    accessToken,
    message: 'Registration Successful',
  });
});

// Login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  if (!password) {
    return res.status(400).json({ message: 'Password is required' });
  }

  const userInfo = await User.findOne({ email: email });

  if (!userInfo) {
    return res.status(400).json({ message: 'User not found' });
  }

  if (userInfo.email == email && userInfo.password == password) {
    const user = { user: userInfo };
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '36000m',
    });

    return res.json({
      error: false,
      message: 'Login Successful',
      email,
      accessToken,
    });
  } else {
    return res.status(400).json({
      error: true,
      message: 'Invalid Credentials',
    });
  }
});

// Get User
app.get('/get-user', authenticateToken, async (req, res) => {
  const { user } = req.user;

  const isUser = await User.findOne({ _id: user._id });

  if (!isUser) {
    return res.sendStatus(401);
  }

  return res.json({
    user: {
      fullName: isUser.fullName,
      email: isUser.email,
      _id: isUser._id,
      createdOn: isUser.createdOn,
    },
    message: '',
  });
});

// Add Note
app.post('/add-note', authenticateToken, async (req, res) => {
  const { title, content, tags, departments } = req.body;
  const { user } = req.user;

  if (!title) {
    return res.status(400).json({ error: true, message: 'Title is required' });
  }

  if (!content) {
    return res
      .status(400)
      .json({ error: true, message: 'Content is required' });
  }

  try {
    const note = new Note({
      title,
      content,
      tags: tags || [],
      departments: departments || {},
      userId: user._id,
    });

    await note.save();

    return res.json({
      error: false,
      note,
      message: 'Note added successfully',
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: 'Internal Server Error',
    });
  }
});

// Edit Note
app.put('/edit-note/:noteId', authenticateToken, async (req, res) => {
  const noteId = req.params.noteId;
  const { title, content, tags, isPinned, departments } = req.body;
  const { user } = req.user;

  if (!title && !content && !tags) {
    return res
      .status(400)
      .json({ error: true, message: 'No changes provided' });
  }

  try {
    const note = await Note.findOne({ _id: noteId });

    if (!note) {
      return res.status(400).json({ error: true, message: 'Note not found' });
    }

    if (title) note.title = title;
    if (content) note.content = content;
    if (tags) note.tags = tags;
    if (isPinned !== undefined) note.isPinned = isPinned;
    if (departments) note.departments = departments;

    await note.save();

    return res.json({
      error: false,
      note,
      message: 'Note updated successfully',
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: 'Internal Server Error',
    });
  }
});

// Get All Notes
app.get('/get-all-notes/', authenticateToken, async (req, res) => {
  const { user } = req.user;

  try {
    const notes = await Note.find().select(
      '_id title content tags departments pinnedBy createdOn'
    );

    // จัดเรียงโน๊ตที่ผู้ใช้ปักหมุดขึ้นมาก่อน
    const sortedNotes = notes.sort((a, b) => {
      const aPinned = a.pinnedBy.includes(user._id);
      const bPinned = b.pinnedBy.includes(user._id);
      return bPinned - aPinned; // ถ้า `b` ถูกปักหมุดให้มาก่อน `a`
    });

    return res.json({
      error: false,
      notes: sortedNotes, // ส่งโน๊ตที่เรียงแล้วกลับไป
      message: 'All notes retrieved successfully',
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: 'Internal Server Error',
    });
  }
});

// Delete Note
app.delete('/delete-note/:noteId', authenticateToken, async (req, res) => {
  const noteId = req.params.noteId;
  const { user } = req.user;

  try {
    const note = await Note.findOne({ _id: noteId, userId: user._id });

    if (!note) {
      return res.status(400).json({ error: true, message: 'Note not found' });
    }

    await Note.deleteOne({ _id: noteId, userId: user._id });

    return res.json({
      error: false,
      message: 'Note deleted successfully',
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: 'Internal Server Error',
    });
  }
});

// Updete isPinned Value
app.put('/update-note-pinned/:noteId', authenticateToken, async (req, res) => {
  const noteId = req.params.noteId;
  const { user } = req.user; // ดึงข้อมูล User ที่ล็อกอินอยู่

  try {
    const note = await Note.findOne({ _id: noteId });

    if (!note) {
      return res.status(400).json({ error: true, message: 'Note not found' });
    }

    // ป้องกัน `pinnedBy` เป็น `undefined`
    note.pinnedBy = note.pinnedBy || [];

    // ตรวจสอบว่าผู้ใช้ปักหมุดอยู่หรือไม่
    const isAlreadyPinned = note.pinnedBy.includes(user._id);

    if (isAlreadyPinned) {
      note.pinnedBy = note.pinnedBy.filter((id) => id !== user._id); // ถ้าปักหมุดอยู่แล้วให้เลิกปักหมุด
    } else {
      note.pinnedBy.push(user._id); // ถ้ายังไม่ได้ปักหมุด ให้เพิ่ม userId เข้าไป
    }

    await note.save();

    return res.json({
      error: false,
      note,
      message: isAlreadyPinned
        ? 'Unpinned successfully'
        : 'Pinned successfully',
    });
  } catch (error) {
    console.error('Error updating pinned status:', error); // log error
    return res.status(500).json({
      error: true,
      message: 'Internal Server Error',
    });
  }
});

// Search Notes
app.get('/search-notes/', authenticateToken, async (req, res) => {
  const { user } = req.user;
  const { query } = req.query;

  if (!query) {
    return res
      .status(400)
      .json({ error: true, message: 'Search query is required' });
  }

  try {
    const matchingNotes = await Note.find({
      $or: [
        { title: { $regex: new RegExp(query, 'i') } },
        { content: { $regex: new RegExp(query, 'i') } },
        { tags: { $regex: new RegExp(query, 'i') } },
        { 'departments.dept': { $regex: new RegExp(query, 'i') } }, // ค้นหาชื่อแผนก
        { 'departments.term': { $regex: new RegExp(query, 'i') } }, // ค้นหาคำที่ใช้เรียกแผนก
      ],
    });

    return res.json({
      error: false,
      notes: matchingNotes,
      message: 'Search results retrieved successfully',
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: 'Internal Server Error',
    });
  }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`🚀 PORT ${PORT} ไม่บัคจ้าดีใจด้วยน้า 🤗`);
});

module.exports = app;
