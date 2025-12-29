"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const AuthService_1 = require("../services/AuthService");
const authService = new AuthService_1.AuthService();
class AuthController {
    async login(req, res) {
        try {
            const result = await authService.login(req.body);
            if (!result) {
                return res.status(401).json({ message: "Invalid credentials" });
            }
            res.json(result);
        }
        catch (error) {
            res.status(500).json({ message: "Error during login", error });
        }
    }
    async register(req, res) {
        try {
            const result = await authService.register(req.body);
            res.status(201).json(result);
        }
        catch (error) {
            res.status(500).json({ message: "Error during registration", error });
        }
    }
}
exports.AuthController = AuthController;
