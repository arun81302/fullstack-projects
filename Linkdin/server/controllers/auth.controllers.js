import genToken from "../config/token.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

// Cookie ki settings yahan define ki hain
const cookieOptions = {
    httpOnly: true,
    maxAge: 2 * 24 * 60 * 60 * 1000,
    sameSite: "lax",
    secure: process.env.NODE_ENVIRONMENT === "production",
};

// Naya user register karne ke liye
export const signUp = async (req, res) => {
    try {
        const { firstName, lastName, userName, email, password } = req.body;

        // Check karo ki saari required fields mili hain ya nahi
        if (!firstName || !lastName || !userName || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        // Check karo ki email pehle se registered toh nahi hai
        const existEmail = await User.findOne({ email });

        if (existEmail) {
            return res.status(400).json({
                message: "Email already exists!"
            });
        }

        // Check karo ki username kisi aur user ne toh nahi liya
        const existUser = await User.findOne({ userName });

        if (existUser) {
            return res.status(400).json({
                message: "Username already exists!"
            });
        }

        // Password kam se kam 8 characters ka hona chahiye
        if (password.length < 8) {
            return res.status(400).json({
                message: "Password must be at least 8 characters"
            });
        }

        // Original password ko hash karke database mein save karo
        const hashedPassword = await bcrypt.hash(password, 10);

        // Database mein naya user create karo
        const user = await User.create({
            firstName,
            lastName,
            userName,
            email,
            password: hashedPassword,
        });

        // User ID se JWT token generate karo
        const token = await genToken(user._id);

        // Token ko HTTP-only cookie mein store karo
        res.cookie("token", token, cookieOptions);

        // Password ko response se remove karke user data bhejo
        const safeUser = await User.findById(user._id).select("-password");

        return res.status(201).json(safeUser);

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Signup error"
        });
    }
};

// Existing user ko login karne ke liye
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Email ke through user ko database mein search karo
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "Email not found"
            });
        }

        // Enter kiye password ko database wale hashed password se compare karo
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                message: "Incorrect password"
            });
        }

        // Login successful hone par JWT token generate karo
        const token = await genToken(user._id);

        // Token ko browser ki HTTP-only cookie mein save karo
        res.cookie("token", token, cookieOptions);

        // Password ko response mein bhejne se pehle remove karo
        const safeUser = await User.findById(user._id).select("-password");

        return res.status(200).json(safeUser);

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Login error"
        });
    }
};

// User ko logout karne ke liye
export const logout = async (req, res) => {
    try {
        // Browser se authentication cookie clear karo
        res.clearCookie("token", cookieOptions);

        return res.status(200).json({
            message: "Logout successful"
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Logout error"
        });
    }
};