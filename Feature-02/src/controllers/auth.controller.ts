import { Request, Response } from "express";
import { generateReferralCode } from "../utils/generateReferral";
import { hashPassword } from "../services/auth.service";
import prisma from "../lib/prisma";

export const registerController = async (req: Request, res: Response) => {
  try {
    const { email, full_name, password, referredBy } = req.body;

    if (!email || !full_name || !password) {
      return res.status(400).json({ message: "Data anda salah" });
    }

    const isExistUser = await prisma.user.findUnique({ where: { email } });
    if (isExistUser) {
      return res.status(409).json({ message: "Email sudah ada" });
    }

    const hashedPassword = await hashPassword(password);
    const referral_code = generateReferralCode(full_name);

    const newUser = await prisma.user.create({
      data: {
        email,
        full_name,
        password: hashedPassword,
        referral_code,
        referred_by: referredBy || null,
        role: "CUSTOMER", // default role
      },
    });

    // TODO (next step): If referredBy is valid → give point & coupon

    return res.status(201).json({
      message: "Pendaftaran telah berhasil",
      data: {
        id: newUser.id,
        email: newUser.email,
        fullName: newUser.full_name,
        referralCode: newUser.referral_code,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
