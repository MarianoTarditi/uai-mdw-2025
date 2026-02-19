import axiosPrivate from "../../config/axios";
import type { IExercise } from "../../types/auth";

const API_URL = "/exercise/";

const getAllExercises = async (): Promise<IExercise[]> => {
  const response = await axiosPrivate.get(API_URL);
  return response.data.data;
};

const getExercise = async (id: string): Promise<IExercise> => {
  const response = await axiosPrivate.get(`${API_URL}${id}`);
  return response.data.data;
};

const createExercise = async (exerciseData: IExercise | FormData): Promise<IExercise> => {
  const response = await axiosPrivate.post(API_URL, exerciseData);
  return response.data.data;
};

const deleteExercise = async (id: string) => {
  const response = await axiosPrivate.delete(`${API_URL}${id}`);
  return response.data.data;
};

const updateExercise = async (
  id: string,
  exerciseData: IExercise | FormData
) => {
  const response = await axiosPrivate.put(`${API_URL}${id}`, exerciseData);
  return response.data.data;
};

export default {
  getAllExercises,
  getExercise,
  createExercise,
  deleteExercise,
  updateExercise,
};
