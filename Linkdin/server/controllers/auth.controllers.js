import genToken from "../config/token.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

// Environment ke according cookie settings return karna
const getCookieOptions = () => {
    const isProduction =
        process.env.NODE_ENV === "production" ||
        process.env.NODE_ENVIRONMENT === "production";

    return {
        httpOnly: true,
        maxAge: 2 * 24 * 60 * 60 * 1000,
        sameSite: isProduction ? "none" : "lax",
        secure: isProduction,
    };
};

// Naya user register karne ke liye
export const signUp = async (req, res) => {
    try {
        const { firstName, lastName, userName, email, password } = req.body;

        // Required fields check karna
        if (!firstName || !lastName || !userName || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        // Email already registered hai ya nahi
        const existEmail = await User.findOne({ email });

        if (existEmail) {
            return res.status(400).json({
                message: "Email already exists!"
            });
        }

        // Username already registered hai ya nahi
        const existUser = await User.findOne({ userName });

        if (existUser) {
            return res.status(400).json({
                message: "Username already exists!"
            });
        }

        // Password validation
        if (password.length < 8) {
            return res.status(400).json({
                message: "Password must be at least 8 characters"
            });
        }

        // Password hash karke database mein save karna
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            firstName,
            lastName,
            userName,
            email,
            password: hashedPassword,
        });

        // JWT token generate karna
        const token = await genToken(user._id);

        // Authentication cookie set karna
        res.cookie("token", token, getCookieOptions());

        // Password remove karke user data return karna
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

        // Email se user find karna
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "Email not found"
            });
        }

        // Password compare karna
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                message: "Incorrect password"
            });
        }

        // JWT token generate karna
        const token = await genToken(user._id);

        // Authentication cookie set karna
        res.cookie("token", token, getCookieOptions());

        // Password remove karke user data return karna
        const safeUser = await User.findById(user._id).select("-password");

        return res.status(200).json(safeUser);

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Login error"
        });
    }
};

// User logout karne ke liye
export const logout = async (req, res) => {
    try {
        // Browser se authentication cookie clear karna
        res.clearCookie("token", getCookieOptions());

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