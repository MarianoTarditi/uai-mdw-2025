// @register user
export interface RegisterUserData {
  name: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// @login user
export interface LoginUserData {
  email: string;
  password: string;
}

// Estado de Auth en Redux
export interface AuthState {
  user: User | null;
  isError: boolean;
  isSuccess: boolean;
  isLoading: boolean;
  message: string;
}

//  Usuario en el estado de Redux
export interface User {
  idToken: string; 
  refreshToken: string;
  expiresIn: string;
  localId: string;
  email: string;
  name: string;
  lastName: string;
  roles?: string[];
}