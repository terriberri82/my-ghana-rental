import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";

const setAuthCookie = (res, user) => {
  const token = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );

  const isProduction = process.env.NODE_ENV === "production";

  res.cookie("token", token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

export const signup = async (req, res) => {
  try {
    const { firstName, lastName, phone, password, email } = req.body;

    if (!firstName || !lastName || !phone || !password) {
      return res.status(400).json({
        message: "First name, last name, phone and password are required.",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "Your password needs to be at least 8 characters.",
      });
    }
    if (email) {
      const emailTaken = await prisma.user.findUnique({
        where: { email: email.toLowerCase().trim() },
      });
      if (emailTaken) {
        return res.status(409).json({
          message: "An account with this email already exists.",
        });
      }
    }

    const existing = await prisma.user.findUnique({ where: { phone } });
    if (existing) {
      return res.status(409).json({
        message:
          "An account with this phone number already exists. Try logging in instead.",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        phone,
        email: email ? email.toLowerCase().trim() : null,
        passwordHash,
        role: "LANDLORD",
      },
    });

    setAuthCookie(res, user);

    res.status(201).json({
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("signup:", error);
    res.status(500).json({
      message: "Couldn't create your account. Please try again.",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({
        message: "Phone number or email, and password, are required.",
      });
    }

    const isEmail = identifier.includes("@");

    const user = await prisma.user.findUnique({
      where: isEmail
        ? { email: identifier.toLowerCase().trim() }
        : { phone: identifier.trim() },
    });

    if (!user) {
      return res.status(404).json({
        message: "No account found with that phone number or email.",
      });
    }

    if (!user.passwordHash) {
      return res.status(403).json({
        message: "This account has not been activated yet.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
      return res.status(401).json({
        message: "Incorrect password. Please try again.",
      });
    }

    setAuthCookie(res, user);

    res.status(200).json({
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("login:", error);
    res.status(500).json({
      message: "Couldn't log you in. Please try again.",
    });
  }
};

export const logout = (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });
    res.status(200).json({ message: "Logged out." });
  } catch (error) {
    console.error("logout:", error);
    res.status(500).json({ message: "Couldn't log you out." });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        role: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error("getMe:", error);
    res.status(500).json({ message: "Couldn't load your account." });
  }
};
