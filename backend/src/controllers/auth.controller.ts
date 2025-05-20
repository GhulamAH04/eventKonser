import { Request, Response } from 'express';
import prisma from '../prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { registerUser, loginUser } from '../services/auth.service';

// JWT CONFIG
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

// LOGIN
// backend/src/controllers/auth.controller.ts

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    console.log('Incoming login:', email);

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '2d' }
    );


    res.status(200).json({ token });
  } catch (error) {
    console.error('Login failed:', error);
    res.status(500).json({ message: 'Login failed' });
  }
};



// REGISTER
export const register = async (req: Request, res: Response) => {
  try {
    const user = await registerUser(req.body);
    res.status(201).json({ message: 'Registration successful', userId: user.id });
  } catch (error) {
    console.error('Register failed:', error);
    res.status(500).json({ message: (error as Error).message });
  }
};
