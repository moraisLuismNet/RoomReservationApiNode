"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const UserService_1 = require("../services/UserService");
const service = new UserService_1.UserService();
class UserController {
    async getAll(req, res) {
        try {
            const users = await service.getAllUsers();
            res.json(users);
        }
        catch (error) {
            res.status(500).json({ message: "Error retrieving users", error });
        }
    }
    async getByEmail(req, res) {
        try {
            const user = await service.getUser(req.params.email);
            if (!user)
                return res.status(404).json({ message: "User not found" });
            res.json(user);
        }
        catch (error) {
            res.status(500).json({ message: "Error retrieving user", error });
        }
    }
    async update(req, res) {
        try {
            const user = await service.putUser(req.params.email, req.body);
            if (!user)
                return res.status(404).json({ message: "User not found" });
            res.json(user);
        }
        catch (error) {
            res.status(500).json({ message: "Error updating user", error });
        }
    }
    async delete(req, res) {
        try {
            const success = await service.deleteUser(req.params.email);
            if (!success)
                return res.status(404).json({ message: "User not found" });
            res.status(204).send();
        }
        catch (error) {
            res.status(500).json({ message: "Error deleting user", error });
        }
    }
}
exports.UserController = UserController;
