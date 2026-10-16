import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, IUser, UserRole } from '../models/User';
import { Profile } from '../models/Profile';
import { Referral } from '../models/Referral';
import { ENV } from '../config/env';
import { AuthRequest } from '../middlewares/auth';

const generateToken = (user: IUser): string => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role, name: user.name },
    ENV.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

const generateReferralCode = (name: string): string => {
  const clean = name.replace(/[^a-zA-Z]/g, '').toUpperCase().slice(0, 4) || 'STAY';
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `${clean}${rand}`;
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, phone, password, role, referralCode, preferredLanguage } = req.body;

    if (!name || !email || !phone || !password) {
      res.status(400).json({ success: false, message: 'Please provide all required fields (Name, Email, Phone, Password).' });
      return;
    }

    const existingUser = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { phone }]
    });

    if (existingUser) {
      res.status(400).json({
        success: false,
        message: existingUser.email === email.toLowerCase()
          ? 'An account with this email already exists.'
          : 'An account with this mobile number already exists.'
      });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    let userReferralCode = generateReferralCode(name);
    let codeExists = await User.findOne({ referralCode: userReferralCode });
    while (codeExists) {
      userReferralCode = generateReferralCode(name);
      codeExists = await User.findOne({ referralCode: userReferralCode });
    }

    const newUser = await User.create({
      name,
      email: email.toLowerCase(),
      phone,
      passwordHash,
      role: (role as UserRole) || 'student',
      referralCode: userReferralCode,
      referredBy: referralCode || undefined,
      isVerified: role === 'admin' ? true : false,
      lastLoginAt: new Date()
    });

    // Create default profile
    await Profile.create({
      userId: newUser._id,
      preferredLanguage: preferredLanguage || 'en',
      preferredLocations: []
    });

    // Handle Referral Reward if code provided
    if (referralCode) {
      const referrer = await User.findOne({ referralCode: referralCode.toUpperCase() });
      if (referrer) {
        await Referral.create({
          referrerId: referrer._id,
          refereeId: newUser._id,
          referralCode: referralCode.toUpperCase(),
          rewardAmount: 50,
          status: 'signed_up'
        });
      }
    }

    const token = generateToken(newUser);

    res.status(201).json({
      success: true,
      message: 'Registration successful! Welcome to StayBite.',
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
        avatar: newUser.avatar,
        isVerified: newUser.isVerified,
        referralCode: newUser.referralCode,
        walletBalance: newUser.walletBalance
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Registration failed' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      res.status(400).json({ success: false, message: 'Please provide Email/Phone and Password.' });
      return;
    }

    const user = await User.findOne({
      $or: [
        { email: identifier.toLowerCase().trim() },
        { phone: identifier.trim() }
      ]
    });

    if (!user) {
      res.status(401).json({ success: false, message: 'Invalid credentials. User not found.' });
      return;
    }

    if (user.isBlocked) {
      res.status(403).json({
        success: false,
        message: `Account is suspended. Reason: ${user.blockedReason || 'Policy violation'}`
      });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Invalid password. Please check and try again.' });
      return;
    }

    user.lastLoginAt = new Date();
    await user.save();

    const profile = await Profile.findOne({ userId: user._id });
    const token = generateToken(user);

    res.json({
      success: true,
      message: 'Login successful!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
        isVerified: user.isVerified,
        referralCode: user.referralCode,
        walletBalance: user.walletBalance
      },
      profile
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Login failed' });
  }
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const profile = await Profile.findOne({ userId: req.user._id });

    res.json({
      success: true,
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        phone: req.user.phone,
        role: req.user.role,
        avatar: req.user.avatar,
        isVerified: req.user.isVerified,
        referralCode: req.user.referralCode,
        walletBalance: req.user.walletBalance,
        createdAt: req.user.createdAt
      },
      profile
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const {
      name,
      avatar,
      preferredLanguage,
      collegeOrWorkplace,
      courseOrDesignation,
      yearOrExp,
      gender,
      dateOfBirth,
      bio,
      currentCity,
      preferredLocations,
      budgetMin,
      budgetMax,
      roomPreference,
      foodPreference,
      emergencyContact,
      address
    } = req.body;

    if (name) {
      req.user.name = name;
    }
    if (avatar !== undefined) {
      req.user.avatar = avatar;
    }
    await req.user.save();

    let profile = await Profile.findOne({ userId: req.user._id });
    if (!profile) {
      profile = new Profile({ userId: req.user._id });
    }

    if (preferredLanguage) profile.preferredLanguage = preferredLanguage;
    if (collegeOrWorkplace !== undefined) profile.collegeOrWorkplace = collegeOrWorkplace;
    if (courseOrDesignation !== undefined) profile.courseOrDesignation = courseOrDesignation;
    if (yearOrExp !== undefined) profile.yearOrExp = yearOrExp;
    if (gender !== undefined) profile.gender = gender;
    if (dateOfBirth !== undefined) profile.dateOfBirth = dateOfBirth;
    if (bio !== undefined) profile.bio = bio;
    if (currentCity !== undefined) profile.currentCity = currentCity;
    if (preferredLocations !== undefined) profile.preferredLocations = preferredLocations;
    if (budgetMin !== undefined) profile.budgetMin = budgetMin;
    if (budgetMax !== undefined) profile.budgetMax = budgetMax;
    if (roomPreference !== undefined) profile.roomPreference = roomPreference;
    if (foodPreference !== undefined) profile.foodPreference = foodPreference;
    if (emergencyContact !== undefined) profile.emergencyContact = emergencyContact;
    if (address !== undefined) profile.address = address;

    await profile.save();

    res.json({
      success: true,
      message: 'Profile updated successfully!',
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        phone: req.user.phone,
        role: req.user.role,
        avatar: req.user.avatar,
        isVerified: req.user.isVerified,
        referralCode: req.user.referralCode,
        walletBalance: req.user.walletBalance
      },
      profile
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Demo OTP Mock Helper for fast & reliable login verification
export const sendOtp = async (req: Request, res: Response): Promise<void> => {
  const { phone } = req.body;
  if (!phone) {
    res.status(400).json({ success: false, message: 'Mobile number is required' });
    return;
  }
  // Fast Indian OTP simulation for testing/production fallback
  res.json({
    success: true,
    message: `OTP sent successfully to ${phone}. For testing use OTP: 123456`,
    demoOtp: '123456'
  });
};

export const verifyOtp = async (req: Request, res: Response): Promise<void> => {
  const { phone, otp } = req.body;
  if (!phone || !otp) {
    res.status(400).json({ success: false, message: 'Phone and OTP are required' });
    return;
  }

  if (otp !== '123456') {
    res.status(400).json({ success: false, message: 'Invalid OTP code. Please enter 123456.' });
    return;
  }

  let user = await User.findOne({ phone: phone.trim() });
  if (!user) {
    // Return flag that user needs to complete signup
    res.json({
      success: true,
      isNewUser: true,
      message: 'OTP verified successfully. Please complete your registration.'
    });
    return;
  }

  const token = generateToken(user);
  res.json({
    success: true,
    isNewUser: false,
    message: 'OTP verified successfully! Logged in.',
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      avatar: user.avatar,
      isVerified: user.isVerified
    }
  });
};
