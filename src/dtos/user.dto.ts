export interface UserDTO {
  email: string;
  fullName: string;
  phoneNumber?: string;
  isActive: boolean;
  createdAt: Date;
  lastLogin?: Date;
  role: string;
}

export interface UpdateUserDTO {
  fullName?: string;
  phoneNumber?: string;
  isActive?: boolean;
  role?: string;
}
