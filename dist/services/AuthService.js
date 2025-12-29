"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const jwt = __importStar(require("jsonwebtoken"));
const User_1 = require("../models/User");
const data_source_1 = require("../config/data/data-source");
class AuthService {
    constructor() {
        this.userRepository = data_source_1.AppDataSource.getRepository(User_1.User);
    }
    async login(dto) {
        const user = await this.userRepository.findOne({
            where: { email: dto.email },
        });
        if (!user)
            return null;
        const isMatch = await user.comparePassword(dto.password);
        if (!isMatch)
            return null;
        const token = this.generateToken(user);
        return {
            token,
            user: {
                email: user.email,
                fullName: user.fullName,
                role: user.role,
            },
        };
    }
    async register(dto) {
        const user = new User_1.User();
        user.fullName = dto.fullName;
        user.email = dto.email;
        user.passwordHash = dto.password; // Will be hashed by BeforeInsert
        user.phoneNumber = dto.phoneNumber;
        user.role = dto.role || User_1.UserRole.USER;
        const savedUser = await this.userRepository.save(user);
        const token = this.generateToken(savedUser);
        return {
            token,
            user: {
                email: savedUser.email,
                fullName: savedUser.fullName,
                role: savedUser.role,
            },
        };
    }
    generateToken(user) {
        const secret = process.env.JWT_SECRET || "fallback_secret";
        console.debug(`[AuthService] Generating token. Secret used: ${secret === "fallback_secret" ? "FALLBACK" : "ENV_SECRET"}`);
        const expiresIn = (process.env.JWT_EXPIRES_IN ||
            "24h");
        return jwt.sign({ email: user.email, role: user.role }, secret, {
            expiresIn,
        });
    }
}
exports.AuthService = AuthService;
