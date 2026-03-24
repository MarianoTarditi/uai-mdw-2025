
import axiosPrivate from "@/config/axios";
import {
  type IRoutine,
  type IRoutinePayload,
} from "./routineTypes";

const ROUTINE_URL = "/routines";

const createRoutine = async (data: IRoutinePayload): Promise<IRoutine> => {
  const res = await axiosPrivate.post(ROUTINE_URL, data);
  return res.data.data;
};

const getAllRoutines = async () => {
  const res = await axiosPrivate.get(ROUTINE_URL);
  return res.data.data; 
};

const getRoutineById = async (id: string): Promise<IRoutine> => {
  const res = await axiosPrivate.get(`${ROUTINE_URL}/${id}`);
  return res.data.data;
};

const deleteRoutine = async (id: string) => {
  const res = await axiosPrivate.delete(`${ROUTINE_URL}/${id}`);
  return res.data;
};

const updateRoutine = async (
  id: string,
  data: Partial<IRoutinePayload>,
): Promise<IRoutine> => {
  const res = await axiosPrivate.put(`${ROUTINE_URL}/${id}`, data);
  return res.data.data;
};

const deleteExerciseAssignment = async (id: string) => {
  const res = await axiosPrivate.delete(`/exerciseAssignments/${id}`);
  return res.data;
};

const getStudents = async () => {
  const res = await axiosPrivate.get("/routines/students");
  return res.data.data;
};

const getRoutineTemplates = async () => {
  const res = await axiosPrivate.get("/routines/templates");
  return res.data.data;
};

const uploadRoutineTemplate = async (payload: FormData) => {
  const res = await axiosPrivate.post("/routines/templates", payload);
  return res.data.data;
};

const deleteRoutineTemplate = async (id: string) => {
  const res = await axiosPrivate.delete(`/routines/templates/${id}`);
  return res.data;
};

const renameRoutineTemplate = async (id: string, title: string) => {
  const res = await axiosPrivate.patch(`/routines/templates/${id}/title`, {
    title,
  });
  return res.data.data;
};

export default {
  createRoutine,
  getAllRoutines,
  getRoutineById,
  deleteRoutine,
  updateRoutine,
  deleteExerciseAssignment,
  getStudents,
  getRoutineTemplates,
  uploadRoutineTemplate,
  deleteRoutineTemplate,
  renameRoutineTemplate,
};
