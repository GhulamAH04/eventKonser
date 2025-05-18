"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = exports.login = void 0;
const client_1 = __importDefault(require("../prisma/client"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// JWT CONFIG
const JWT_SECRET = process.env.JWT_SECRET || 'secret'; // Gunakan JWT_SECRET dari .env atau fallback ke default
//  LOGIN
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Ambil email dan password dari body request
        const { email, password } = req.body;
        // Cari user berdasarkan email
        const user = yield client_1.default.user.findUnique({ where: { email } });
        // Kalau tidak ketemu, kirim error
        if (!user)
            return res.status(401).json({ message: 'Invalid credentials' });
        // Bandingkan password input dengan password hash di database
        const match = yield bcrypt_1.default.compare(password, user.password);
        if (!match)
            return res.status(401).json({ message: 'Invalid credentials' });
        // Buat JWT token berisi id, email, dan role
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '2d' } // Token berlaku selama 2 hari
        );
        // Kirim token ke client
        res.json({ accessToken: token });
    }
    catch (error) {
        console.error('Login failed:', error);
        res.status(500).json({ message: 'Login failed' });
    }
});
exports.login = login;
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, role, full_name, referral_code } = req.body;
        if (!email || !password || !role || !full_name) {
            return res.status(400).json({ message: 'Email, password, full_name, and role are required' });
        }
        const existingUser = yield client_1.default.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ message: 'Email already registered' });
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const newUser = yield client_1.default.user.create({
            data: {
                email,
                password: hashedPassword,
                role,
                full_name,
                referral_code: referral_code || null,
            },
        });
        res.status(201).json({ message: 'Registration successful', userId: newUser.id });
    }
    catch (error) {
        console.error('Register failed:', error);
        res.status(500).json({ message: 'Registration failed' });
    }
});
exports.register = register;
