require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// Models
const User = require('./models/User');
const Election = require('./models/Election');

// Database Models (Defined in-file for Vercel/Render reliability)
const Vote = mongoose.model('Vote', new mongoose.Schema({
    electionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Election' },
    candidate: String,
    receiptHash: String,
    timestamp: { type: Date, default: Date.now }
}));

const VoterStatus = mongoose.model('VoterStatus', new mongoose.Schema({
    electionId: String,
    userId: String,
}));

const TempOTP = mongoose.model('TempOTP', new mongoose.Schema({
    email: { type: String, lowercase: true },
    otp: String,
    createdAt: { type: Date, default: Date.now, expires: 300 } 
}));

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected"))
    .catch(err => console.log("❌ MongoDB Error:", err));

// 🛡️ Security Middleware
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).json({ error: "Access Denied" });
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ error: "Invalid Session" });
        req.user = decoded;
        next();
    });
};

// 📧 🚀 BREVO API SENDER (100% Reliability on Port 443)
const sendEmailViaAPI = async (toEmail, subject, htmlContent) => {
    try {
        const response = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'api-key': process.env.BREVO_API_KEY,
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                sender: { name: "EduVote Security", email: process.env.SENDER_EMAIL },
                to: [{ email: toEmail }],
                subject: subject,
                htmlContent: htmlContent
            })
        });
        return response.ok;
    } catch (error) { return false; }
};

// --- 🚀 ADVANCED REGISTRATION ---

app.post('/api/auth/register-otp', async (req, res) => {
    const { email } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    try {
        await TempOTP.create({ email: email.toLowerCase().trim(), otp });
        const success = await sendEmailViaAPI(email, "Registration Verification", `<h1>Code: ${otp}</h1>`);
        if (success) res.json({ message: "Sent" });
        else res.status(500).json({ error: "API Email failed" });
    } catch (err) { res.status(500).json({ error: "Server error" }); }
});
// 🚀 SEARCH for this line in server.js and replace it
app.patch('/api/elections/:id/stop', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        
        // 1. Verify the ID is a valid MongoDB ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid Election ID format" });
        }

        const result = await Election.findByIdAndUpdate(
            id, 
            { status: 'stopped' }, 
            { new: true }
        );

        if (!result) {
            return res.status(404).json({ error: "Election not found in database" });
        }

        console.log(`✅ Election ${id} stopped successfully`);
        res.json({ message: "Stopped", election: result });
    } catch (err) {
        console.error("Stop Route Error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
app.post('/api/auth/register-final', async (req, res) => {
    const { regno, email, password, role, otp, classPrefix, managedPrefix } = req.body;
    try {
        const validOtp = await TempOTP.findOne({ email: email.toLowerCase().trim(), otp });
        if (!validOtp) return res.status(401).json({ error: "Invalid OTP" });

        // 🛡️ FIX FOR "USER EXISTS": Ensure regno is unique for Staff
        let finalRegNo = regno || email.split('@')[0].toUpperCase() + "_STAFF";

        const existing = await User.findOne({ $or: [{ email: email.toLowerCase() }, { regno: finalRegNo }] });
        if (existing) return res.status(400).json({ error: "Email or ID already registered." });

        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({ 
            regno: finalRegNo, email: email.toLowerCase().trim(), password: hashedPassword, role, 
            classPrefix, managedPrefix, isVerified: role !== "Student" 
        });

        await TempOTP.deleteOne({ _id: validOtp._id });
        res.status(201).json({ message: "Success" });
    } catch (err) { res.status(400).json({ error: "Database error. Unique constraint failed." }); }
});

// --- AUTH & SYSTEM ROUTES ---
app.post('/api/auth/reset-password', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email: email.toLowerCase().trim() });
        if (!user) return res.status(404).json({ error: "Email not found." });

        // Generate Token
        const token = crypto.randomBytes(20).toString('hex');
        user.resetToken = token;
        user.resetTokenExpiry = Date.now() + 3600000; // 1 Hour
        await user.save();

        const resetUrl = `http://localhost:5173/reset-password-final/${token}`; // Update with your frontend URL
        const html = `
            <h3>Password Reset Request</h3>
            <p>You requested a password reset. Click the link below to set a new password:</p>
            <a href="${resetUrl}">${resetUrl}</a>
            <p>This link expires in 1 hour.</p>
        `;

        const success = await sendEmailViaAPI(user.email, "Password Reset Request", html);
        if (success) res.json({ message: "Recovery email sent." });
        else res.status(500).json({ error: "Email delivery failed." });
    } catch (err) { res.status(500).json({ error: "Server error during reset." }); }
});

app.post('/api/auth/reset-password-confirm', async (req, res) => {
    const { token, newPassword } = req.body;
    try {
        const user = await User.findOne({ 
            resetToken: token, 
            resetTokenExpiry: { $gt: Date.now() } 
        });

        if (!user) return res.status(400).json({ error: "Invalid or expired link." });

        user.password = await bcrypt.hash(newPassword, 10);
        user.resetToken = undefined;
        user.resetTokenExpiry = undefined;
        await user.save();

        res.json({ message: "Password updated successfully." });
    } catch (err) { res.status(500).json({ error: "Failed to update password." }); }
});

// --- 🚀 ADVANCED REGISTRATION ---
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user || !(await bcrypt.compare(password, user.password))) return res.status(401).json({ error: "Invalid Credentials" });
    const token = jwt.sign({ id: user._id, role: user.role, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: user._id, email: user.email, role: user.role, classPrefix: user.classPrefix } });
});

app.get('/api/auth/me', verifyToken, async (req, res) => {
    const user = await User.findById(req.user.id);
    res.json({ id: user._id, _id: user._id, email: user.email, role: user.role, classPrefix: user.classPrefix, isBiometricEnrolled: user.isBiometricEnrolled, biometricId: user.biometricId });
});

app.post('/api/auth/enroll-biometrics', verifyToken, async (req, res) => {
    await User.findByIdAndUpdate(req.user.id, { isBiometricEnrolled: true, biometricId: req.body.biometricId });
    res.json({ message: "Success" });
});

app.get('/api/elections', verifyToken, async (req, res) => {
    const elections = await Election.find().sort({ createdAt: -1 });
    res.json(elections);
});

app.get('/api/elections/:id', verifyToken, async (req, res) => {
    const election = await Election.findById(req.params.id);
    res.json(election);
});

app.post('/api/elections', verifyToken, async (req, res) => {
    if (req.user.role === 'Student') return res.status(403).json({ error: "Unauthorized" });
    const election = await Election.create(req.body);
    res.json(election);
});

app.post('/api/vote/request-otp', verifyToken, async (req, res) => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await TempOTP.create({ email: req.user.email, otp });
    await sendEmailViaAPI(req.user.email, "Authorize Vote", `<h1>OTP: ${otp}</h1>`);
    res.json({ message: "Sent" });
});

app.post('/api/vote', verifyToken, async (req, res) => {
    const { electionId, candidate, receiptHash, otp } = req.body;
    const alreadyVoted = await VoterStatus.findOne({ electionId, userId: req.user.id });
    if (alreadyVoted) return res.status(400).json({ error: "Already voted" });
    if (otp !== "BIOMETRIC_VERIFIED") {
        const validOtp = await TempOTP.findOne({ email: req.user.email, otp });
        if (!validOtp) return res.status(401).json({ error: "Invalid OTP" });
    }
    await VoterStatus.create({ electionId, userId: req.user.id });
    await Vote.create({ electionId, candidate, receiptHash });
    res.json({ message: "Success" });
});

app.get('/api/results/:id', verifyToken, async (req, res) => {
    const votes = await Vote.find({ electionId: req.params.id });
    res.json(votes);
});

app.get('/api/users/role/:role', verifyToken, async (req, res) => {
    const users = await User.find({ role: req.params.role }, 'email');
    res.json(users);
});

app.delete('/api/admin/reset', verifyToken, async (req, res) => {
    if (req.user.role !== 'Admin') return res.status(403).json({ error: "Denied" });
    await Election.deleteMany({});
    await Vote.deleteMany({});
    await VoterStatus.deleteMany({});
    res.json({ message: "Reset Complete" });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => console.log(`🚀 Server ready on ${PORT}`));
