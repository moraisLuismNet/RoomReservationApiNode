export interface LoginDTO {
  email: string;
  password: string;
}

export interface RegisterDTO {
  fullName: string;
  email: string;
  password: string;
  phoneNumber?: string;
  role?: string;
}

export interface AuthResponseDTO {
  token: string;
  user: {
    email: string;
    fullName: string;
    role: string;
  };
}
