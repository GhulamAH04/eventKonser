import { Request, Response } from 'express';
import prisma from '../../prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret'; // Ambil JWT_SECRET dari .env atau pakai default 'secret'

export const login = async (req: Request, res: Response) => {
  // Ambil email dan password dari request body
  const { email, password } = req.body;

  // Cari user berdasarkan email di database
  const user = await prisma.user.findUnique({ where: { email } });

  // Kalau user tidak ditemukan, kirim error 401 (unauthorized)
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  // Bandingkan password yang dimasukkan dengan password hash di database
  const match = await bcrypt.compare(password, user.password);

  // Kalau password salah, kirim error 401
  if (!match) return res.status(401).json({ message: 'Invalid credentials' });

  // Buat JWT token yang berisi id, email, dan role user
  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,               // Gunakan secret key untuk enkripsi
    { expiresIn: '2d' }       // Token akan expired dalam 2 hari
  );

  // Kirimkan token ke client agar bisa dipakai untuk login session
  res.json({ accessToken: token });
};
