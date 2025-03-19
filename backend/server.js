
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/email-test-hub', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Models (will be defined in separate files in a production app)
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const User = mongoose.model('User', userSchema);

const testSchema = new mongoose.Schema({
  name: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  emailAccount: {
    address: { type: String, required: true },
    uuid: { type: String, required: true }
  },
  content: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'in_progress', 'completed'], 
    default: 'pending' 
  },
  responses: [{
    subject: String,
    content: String,
    receivedAt: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now }
});

const Test = mongoose.model('Test', testSchema);

// Middleware for authentication
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ message: 'Access denied' });

  jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret', (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Auth Routes
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Create new user
    const user = new User({ name, email, password });
    await user.save();
    
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Create token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '1d' }
    );
    
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Email accounts API (mock data for now)
app.get('/api/emails', authenticateToken, (req, res) => {
  // In a real app, this would connect to Email Guard service
  const emails = Array(8).fill(null).map((_, i) => ({
    id: `email-${i}`,
    address: `test${i + 1}@example.com`,
    uuid: `uuid-${i}`,
    available: i % 3 !== 0 // Make some unavailable to simulate real usage
  }));
  
  res.json(emails);
});

// Tests API
app.get('/api/tests', authenticateToken, async (req, res) => {
  try {
    const tests = await Test.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(tests);
  } catch (error) {
    console.error('Error fetching tests:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/tests/:id', authenticateToken, async (req, res) => {
  try {
    const test = await Test.findOne({ _id: req.params.id, user: req.user.id });
    
    if (!test) {
      return res.status(404).json({ message: 'Test not found' });
    }
    
    res.json(test);
  } catch (error) {
    console.error('Error fetching test details:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/tests', authenticateToken, async (req, res) => {
  try {
    const { name, emailAccountId, content } = req.body;
    
    // In a real app, you would verify the email account exists
    // and is available for use
    
    const emailAccount = {
      address: `test${Math.floor(Math.random() * 8) + 1}@example.com`,
      uuid: `uuid-${emailAccountId}`
    };
    
    const test = new Test({
      name,
      user: req.user.id,
      emailAccount,
      content,
      status: 'pending'
    });
    
    await test.save();
    
    // In a real app, you would send the email using Email Bison here
    
    res.status(201).json(test);
  } catch (error) {
    console.error('Error creating test:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Mock endpoint for receiving email responses (in a real app, this would be a webhook)
app.post('/api/webhook/email-response', async (req, res) => {
  try {
    const { testId, subject, content } = req.body;
    
    const test = await Test.findById(testId);
    if (!test) {
      return res.status(404).json({ message: 'Test not found' });
    }
    
    test.responses.push({
      subject,
      content,
      receivedAt: new Date()
    });
    
    if (test.status === 'pending') {
      test.status = 'in_progress';
    }
    
    await test.save();
    
    res.status(200).json({ message: 'Response recorded' });
  } catch (error) {
    console.error('Error recording response:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
