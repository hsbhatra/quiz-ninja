import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Define schema structure
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },

  password: {
    type: String,
    required: true,
    minlength: 6
  },

  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },

  scoreHistory: [
    {
      quizId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz'
      },
      score: Number,
      total: Number,
      date: {
        type: Date,
        default: Date.now
      }
    }
  ]
}, {
  timestamps: true // Auto adds createdAt and updatedAt
});

// Password hash middleware
userSchema.pre('save', async function (next) {
  // Only hash if password is new or modified
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10); // Generate salt
  this.password = await bcrypt.hash(this.password, salt); // Replace with hashed password
  next();
});

const User = mongoose.model('User', userSchema);
export default User;
