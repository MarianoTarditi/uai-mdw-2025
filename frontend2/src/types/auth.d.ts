// @register user
export interface IRegisterUserData {
  name: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// @login user
export interface ILoginUserData {
  email: string;
  password: string;
}

// Estado de Auth en Redux
export interface IAuthState {
  user: User | null;
  isError: boolean;
  isSuccess: boolean;
  isLoading: boolean;
  message: string;
}

//  Usuario en el estado de Redux
export interface IUser {
  idToken: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  email: string;
  name: string;
  lastName: string;
  roles?: string[];
}

// Reutilizando tu esquema de Mongoose como referencia
export interface IExercise {
  _id?: string;
  name: string;
  description?: string;
  muscleGroup: string;
  videoUrl?: string;
  imageUrl?: string;
}

interface IExerciseState {
  exercises: IExercise[];
  exercise?: IExercise;
  isError: boolean;
  message: string;

  isFetchingSuccess: boolean;
  isCreatingSuccess: boolean;
  isUpdatingSuccess: boolean;
  isDeletingSuccess: boolean;

  isFetchingLoading: boolean;
  isCreatingLoading: boolean;
  isUpdatingLoading: boolean;
  isDeletingLoading: boolean;
}
