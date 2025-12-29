"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const data_source_1 = require("../config/data/data-source");
const User_1 = require("../models/User");
class UserService {
    constructor() {
        this.userRepository = data_source_1.AppDataSource.getRepository(User_1.User);
    }
    async getAllUsers() {
        const users = await this.userRepository.find();
        return users.map((u) => this.mapToDTO(u));
    }
    async getUser(email) {
        const user = await this.userRepository.findOneBy({ email });
        return user ? this.mapToDTO(user) : null;
    }
    async putUser(email, dto) {
        const user = await this.userRepository.findOneBy({ email });
        if (!user)
            return null;
        if (dto.fullName)
            user.fullName = dto.fullName;
        if (dto.phoneNumber)
            user.phoneNumber = dto.phoneNumber;
        if (dto.isActive !== undefined)
            user.isActive = dto.isActive;
        if (dto.role)
            user.role = dto.role;
        await this.userRepository.save(user);
        return this.mapToDTO(user);
    }
    async deleteUser(email) {
        const result = await this.userRepository.delete({ email });
        return result.affected !== 0;
    }
    mapToDTO(u) {
        return {
            email: u.email,
            fullName: u.fullName,
            phoneNumber: u.phoneNumber,
            isActive: u.isActive,
            createdAt: u.createdAt,
            lastLogin: u.lastLogin,
            role: u.role,
        };
    }
}
exports.UserService = UserService;
