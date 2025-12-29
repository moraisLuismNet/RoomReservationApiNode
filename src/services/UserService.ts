import { AppDataSource } from "../config/data/data-source";
import { User, UserRole } from "../models/User";
import { UserDTO, UpdateUserDTO } from "../dtos";

export class UserService {
  private userRepository = AppDataSource.getRepository(User);

  async getAllUsers(): Promise<UserDTO[]> {
    const users = await this.userRepository.find();
    return users.map((u) => this.mapToDTO(u));
  }

  async getUser(email: string): Promise<UserDTO | null> {
    const user = await this.userRepository.findOneBy({ email });
    return user ? this.mapToDTO(user) : null;
  }

  async putUser(email: string, dto: UpdateUserDTO): Promise<UserDTO | null> {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) return null;

    if (dto.fullName) user.fullName = dto.fullName;
    if (dto.phoneNumber) user.phoneNumber = dto.phoneNumber;
    if (dto.isActive !== undefined) user.isActive = dto.isActive;
    if (dto.role) user.role = dto.role as UserRole;

    await this.userRepository.save(user);
    return this.mapToDTO(user);
  }

  async deleteUser(email: string): Promise<boolean> {
    const result = await this.userRepository.delete({ email });
    return result.affected !== 0;
  }

  private mapToDTO(u: User): UserDTO {
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
