import axios from "axios";
import type { IExercise } from "../../types/auth";

const API_URL = "/api/exercise/";

const getAllExercises = async (): Promise<IExercise[]> => {
  const response = await axios.get(API_URL); // GET /api/exercise
  return response.data.map((ex: IExercise) => ({
    ...ex,
  }));
};

const getExercise = async (id: string): Promise<IExercise> => {
  const response = await axios.get(`${API_URL}${id}`);
  console.log(response.data);
  return {
    ...response.data.exercise,
  };
};

const createExercise = async (exerciseData: IExercise): Promise<IExercise> => {
  const response = await axios.post(API_URL, exerciseData);
  return response.data.exercise;
};

const deleteExercise = async (id: string): Promise<{ message: string }> => {
  const response = await axios.delete(`${API_URL}${id}`);
  return response.data;
};

export const updateExercise = async (
  id: string,
  exerciseData: IExercise
): Promise<IExercise> => {
  const response = await axios.put(`${API_URL}${id}`, exerciseData);
  // Asumiendo que la respuesta PUT también devuelve el ejercicio anidado
  return response.data.findExercise;
};

const exerciseService = {
  getAllExercises,
  getExercise,
  createExercise,
  deleteExercise,
  updateExercise,
};

export default exerciseService;
