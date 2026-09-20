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

    const cleanPhone = phone.replace(/\s/g, "");

    if (!/^0\d{9}$/.test(cleanPhone)) {
      return res.status(400).json({
        message: "Enter a valid Ghanaian phone number, like 024 123 4567.",
      });
    }

    let cleanEmail = null;

    if (email) {
      cleanEmail = email.toLowerCase().trim();

      if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(cleanEmail)) {
        return res.status(400).json({
          message: "That doesn't look like a valid email address.",
        });
      }

      const emailTaken = await prisma.user.findUnique({
        where: { email: cleanEmail },
      });

      if (emailTaken) {
        return res.status(409).json({
          message: "An account with this email already exists.",
        });
      }
    }

    const existing = await prisma.user.findUnique({
      where: { phone: cleanPhone },
    });

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
        phone: cleanPhone,
        email: cleanEmail,
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
        : { phone: identifier.replace(/\s/g, "") },
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

export const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, phone, email } = req.body;

    if (!firstName || !lastName || !phone) {
      return res.status(400).json({
        message: "First name, last name and phone number are required.",
      });
    }

    const cleanPhone = phone.replace(/\s/g, "");

    if (!/^0\d{9}$/.test(cleanPhone)) {
      return res.status(400).json({
        message: "Enter a valid Ghanaian phone number, like 024 123 4567.",
      });
    }

    const phoneTaken = await prisma.user.findFirst({
      where: { phone: cleanPhone, NOT: { id: req.userId } },
    });

    if (phoneTaken) {
      return res.status(409).json({
        message: "That phone number is already in use.",
      });
    }

    let cleanEmail = null;

    if (email) {
      cleanEmail = email.toLowerCase().trim();

      if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(cleanEmail)) {
        return res.status(400).json({
          message: "That doesn't look like a valid email address.",
        });
      }

      const emailTaken = await prisma.user.findFirst({
        where: { email: cleanEmail, NOT: { id: req.userId } },
      });

      if (emailTaken) {
        return res.status(409).json({
          message: "That email is already in use.",
        });
      }
    }

    const user = await prisma.user.update({
      where: { id: req.userId },
      data: {
        firstName,
        lastName,
        phone: cleanPhone,
        email: cleanEmail,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        role: true,
      },
    });

    res.status(200).json({ user });
  } catch (error) {
    console.error("updateProfile:", error);
    res.status(500).json({ message: "Couldn't save your changes." });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Your current password and a new password are required.",
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        message: "Your new password needs to be at least 8 characters.",
      });
    }

    const user = await prisma.user.findUnique({ where: { id: req.userId } });

    if (!user || !user.passwordHash) {
      return res.status(404).json({ message: "Account not found." });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);

    if (!isMatch) {
      return res.status(401).json({
        message: "That's not your current password.",
      });
    }
    if (currentPassword === newPassword) {
      return res.status(400).json({
        message: "Your new password has to be different from your current one.",
      });
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: req.userId },
      data: { passwordHash },
    });

    res.status(200).json({ message: "Password changed." });
  } catch (error) {
    console.error("changePassword:", error);
    res.status(500).json({ message: "Couldn't change your password." });
  }
};
