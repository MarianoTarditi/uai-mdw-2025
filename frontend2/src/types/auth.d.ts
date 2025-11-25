// @register user
export interface IRegisterUserData {
  name: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;

  gender: "Male" | "Female" | "Other";
  birthDate: string; 
}

export type IEditProfileData = z.infer<typeof editProfileSchema>;



// @login user
export interface ILoginUserData {
  email: string;
  password: string;
}

// EXERCISE
export interface IExercise {
  _id?: string;
  name: string;
  description?: string;
  muscleGroup: string;
  videoUrl?: string;
  imageUrl?: string;
}

export interface IExerciseState {
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
