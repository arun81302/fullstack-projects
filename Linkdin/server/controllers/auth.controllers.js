
import genToken from "../config/token.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

const getCookieOptions = () => {
    return {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
        maxAge: 2 * 24 * 60 * 60 * 1000,
    };
};

// Register new user
export const signUp = async (req, res) => {
    try {
        const { firstName, lastName, userName, email, password } = req.body;

        if (!firstName || !lastName || !userName || !email || !password) {
            return res.status(400).json({
                message: "All fields are required",
            });
        }

        const existEmail = await User.findOne({ email });

        if (existEmail) {
            return res.status(400).json({
                message: "Email already exists!",
            });
        }

        const existUser = await User.findOne({ userName });

        if (existUser) {
            return res.status(400).json({
                message: "Username already exists!",
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                message: "Password must be at least 8 characters",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            firstName,
            lastName,
            userName,
            email,
            password: hashedPassword,
        });

        const token = await genToken(user._id);

        res.cookie("token", token, getCookieOptions());

        const safeUser = await User.findById(user._id).select("-password");

        return res.status(201).json(safeUser);

    } catch (error) {
        console.log("Signup error:", error);

        return res.status(500).json({
            message: "Signup error",
        });
    }
};

// Login existing user
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "Email not found",
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                message: "Incorrect password",
            });
        }

        const token = await genToken(user._id);

        res.cookie("token", token, getCookieOptions());

        const safeUser = await User.findById(user._id).select("-password");

        return res.status(200).json(safeUser);

    } catch (error) {
        console.log("Login error:", error);

        return res.status(500).json({
            message: "Login error",
        });
    }
};

// Logout user
export const logout = async (req, res) => {
    try {
        const { maxAge, ...clearOptions } = getCookieOptions();

        res.clearCookie("token", clearOptions);

        return res.status(200).json({
            message: "Logout successful",
        });

    } catch (error) {
        console.log("Logout error:", error);

        return res.status(500).json({
            message: "Logout error",
        });
    }
};
