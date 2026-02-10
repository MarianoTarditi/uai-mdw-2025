
import axiosPrivate from "@/config/axios";
import { type IRoutine } from "./routineTypes";

const ROUTINE_URL = "/routines";

const createRoutine = async (data: any): Promise<IRoutine> => {
  const res = await axiosPrivate.post(ROUTINE_URL, data);
  return res.data.data;
};

const getAllRoutines = async () => {
  const res = await axiosPrivate.get(ROUTINE_URL);
  return res.data.data; // 🔥 SOLO ARRAY
};

const getRoutineById = async (id: string): Promise<IRoutine> => {
  const res = await axiosPrivate.get(`${ROUTINE_URL}/${id}`);
  return res.data.data;
};

const deleteRoutine = async (id: string) => {
  const res = await axiosPrivate.delete(`${ROUTINE_URL}/${id}`);
  return res.data;
};

const updateRoutine = async (id: string, data: any): Promise<IRoutine> => {
  const res = await axiosPrivate.put(`${ROUTINE_URL}/${id}`, data);
  return res.data.data;
};

const deleteExerciseAssignment = async (id: string) => {
  const res = await axiosPrivate.delete(`/exerciseAssignments/${id}`);
  return res.data;
};

export default {
  createRoutine,
  getAllRoutines,
  getRoutineById,
  deleteRoutine,
  updateRoutine,
  deleteExerciseAssignment,
};
