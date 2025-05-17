import { Request, Response } from 'express';
import prisma from '../../prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


// JWT CONFIG
const JWT_SECRET = process.env.JWT_SECRET || 'secret'; // Gunakan JWT_SECRET dari .env atau fallback ke default


//  LOGIN
export const login = async (req: Request, res: Response) => {
  try {
    // Ambil email dan password dari body request
    const { email, password } = req.body;

    // Cari user berdasarkan email
    const user = await prisma.user.findUnique({ where: { email } });

    // Kalau tidak ketemu, kirim error
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    // Bandingkan password input dengan password hash di database
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    // Buat JWT token berisi id, email, dan role
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '2d' } // Token berlaku selama 2 hari
    );

    // Kirim token ke client
    res.json({ accessToken: token });
  } catch (error) {
    console.error('Login failed:', error);
    res.status(500).json({ message: 'Login failed' });
  }
};export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, role, full_name, referral_code } = req.body;

    if (!email || !password || !role || !full_name) {
      return res.status(400).json({ message: 'Email, password, full_name, and role are required' });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role,
        full_name,
        referral_code: referral_code || null,
      },
    });

    res.status(201).json({ message: 'Registration successful', userId: newUser.id });
  } catch (error) {
    console.error('Register failed:', error);
    res.status(500).json({ message: 'Registration failed' });
  }
};
