const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // --- CORE IDENTITY ---
  regno: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    toLowerCase: true,
    trim: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  role: { 
    type: String, 
    enum: ['Student', 'Rep', 'Staff', 'Admin'], 
    default: 'Student' 
  },

  // --- INSTITUTIONAL HIERARCHY (🚀 NEW) ---
  // For Students: Extracted from ID Card (e.g., "2024CS")
  classPrefix: { 
    type: String,
    default: "" 
  },
  // For Reps/Staff: The prefix of the class they are authorized to manage
  managedPrefix: { 
    type: String,
    default: "" 
  },

  // --- SECURITY & VERIFICATION ---
  isVerified: { 
    type: Boolean, 
    default: false 
  },
  isBiometricEnrolled: { 
    type: Boolean, 
    default: false 
  },
  biometricId: { 
    type: String 
  },

  // --- ACCOUNT RECOVERY ---
  resetToken: { 
    type: String 
  },
  resetTokenExpiry: { 
    type: Date 
  },

  // --- METADATA ---
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('User', userSchema);
