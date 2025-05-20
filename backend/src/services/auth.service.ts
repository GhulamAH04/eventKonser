import prisma from '../prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

// JWT CONFIG
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export const registerUser = async ({
  email,
  password,
  full_name,
  role,
  referral_code,
}: {
  email: string;
  password: string;
  full_name: string;
  role: 'CUSTOMER' | 'ORGANIZER' | 'ADMIN';
  referral_code?: string;
}) => {
  // Validasi wajib
  if (!email || !password || !full_name || !role) {
    throw new Error('Email, password, full_name, and role are required');
  }

  // Cek duplikat email
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new Error('Email already registered');
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Buat user baru
 const newUser = await prisma.user.create({
  data: {
    email,
    password: hashedPassword,
    full_name,
    role,
    ...(referral_code ? { referral_code } : {}),
  },
});

  return newUser;
};

// login user
export const loginUser = async ({ email, password }: any) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error('User not found');

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error('Invalid password');

  const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '2h' });

  return { token, user: { id: user.id, email: user.email, role: user.role } };
};