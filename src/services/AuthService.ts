import * as jwt from "jsonwebtoken";
import { User, UserRole } from "../models/User";
import { AppDataSource } from "../config/data/data-source";
import { LoginDTO, RegisterDTO, AuthResponseDTO } from "../dtos";

export class AuthService {
  private userRepository = AppDataSource.getRepository(User);

  async login(dto: LoginDTO): Promise<AuthResponseDTO | null> {
    const user = await this.userRepository.findOne({
      where: { email: dto.email },
    });
    if (!user) return null;

    const isMatch = await user.comparePassword(dto.password);
    if (!isMatch) return null;

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

  async register(dto: RegisterDTO): Promise<AuthResponseDTO> {
    const user = new User();
    user.fullName = dto.fullName;
    user.email = dto.email;
    user.passwordHash = dto.password; // Will be hashed by BeforeInsert
    user.phoneNumber = dto.phoneNumber;
    user.role = (dto.role as UserRole) || UserRole.USER;

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

  private generateToken(user: User): string {
    const secret = process.env.JWT_SECRET || "fallback_secret";
    console.debug(
      `[AuthService] Generating token. Secret used: ${
        secret === "fallback_secret" ? "FALLBACK" : "ENV_SECRET"
      }`
    );
    const expiresIn = (process.env.JWT_EXPIRES_IN ||
      "24h") as jwt.SignOptions["expiresIn"];

    return jwt.sign({ email: user.email, role: user.role }, secret, {
      expiresIn,
    });
  }
}
