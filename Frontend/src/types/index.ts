export interface User {
  id: number;
  email: string;
  name: string;
}

export type ProductStatus = 'disponible' | 'agotado' | 'descontinuado';

export interface Product {
  id: number;
  userId: number;
  name: string;
  image: string;
  price: number;
  status: ProductStatus;
  expirationDate: string | null;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export class ApiError extends Error {
  field?: string;

  constructor(message: string, field?: string) {
    super(message);
    this.field = field;
  }
}
