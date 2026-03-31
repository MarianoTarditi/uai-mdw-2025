import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { isAxiosError } from "axios";
import videotecaService from "./videotecaService";
import type {
  IFolderAssetsResponse,
  IVideoAsset,
  IVideoFolder,
} from "@/types/videoteca";

interface VideotecaState {
  folders: IVideoFolder[];
  selectedFolder: IVideoFolder | null;
  assets: IVideoAsset[];
  isFoldersLoading: boolean;
  isFolderDetailLoading: boolean;
  isSavingFolder: boolean;
  isDeletingFolder: boolean;
  isUploadingAsset: boolean;
  isSavingAsset: boolean;
  isDeletingAsset: boolean;
  isError: boolean;
  message: string;
}

const initialState: VideotecaState = {
  folders: [],
  selectedFolder: null,
  assets: [],
  isFoldersLoading: false,
  isFolderDetailLoading: false,
  isSavingFolder: false,
  isDeletingFolder: false,
  isUploadingAsset: false,
  isSavingAsset: false,
  isDeletingAsset: false,
  isError: false,
  message: "",
};

const getErrorMessage = (error: unknown, fallback: string) => {
  if (isAxiosError(error)) {
    return error.response?.data?.message ?? error.message ?? fallback;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
};

export const fetchVideotecaFolders = createAsyncThunk<
  IVideoFolder[],
  void,
  { rejectValue: string }
>("videoteca/fetchFolders", async (_, thunkAPI) => {
  try {
    return await videotecaService.getFolders();
  } catch (error) {
    return thunkAPI.rejectWithValue(
      getErrorMessage(error, "No se pudieron cargar las carpetas"),
    );
  }
});

export const createVideotecaFolder = createAsyncThunk<
  IVideoFolder,
  { name: string; description?: string | null; order?: number },
  { rejectValue: string }
>("videoteca/createFolder", async (payload, thunkAPI) => {
  try {
    return await videotecaService.createFolder(payload);
  } catch (error) {
    return thunkAPI.rejectWithValue(
      getErrorMessage(error, "No se pudo crear la carpeta"),
    );
  }
});

export const updateVideotecaFolder = createAsyncThunk<
  IVideoFolder,
  {
    folderId: string;
    payload: Partial<{
      name: string;
      description: string | null;
      order: number;
      coverAssetId: string | null;
    }>;
  },
  { rejectValue: string }
>("videoteca/updateFolder", async ({ folderId, payload }, thunkAPI) => {
  try {
    return await videotecaService.updateFolder(folderId, payload);
  } catch (error) {
    return thunkAPI.rejectWithValue(
      getErrorMessage(error, "No se pudo actualizar la carpeta"),
    );
  }
});

export const deleteVideotecaFolder = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("videoteca/deleteFolder", async (folderId, thunkAPI) => {
  try {
    await videotecaService.deleteFolder(folderId);
    return folderId;
  } catch (error) {
    return thunkAPI.rejectWithValue(
      getErrorMessage(error, "No se pudo eliminar la carpeta"),
    );
  }
});

export const fetchVideotecaFolderAssets = createAsyncThunk<
  IFolderAssetsResponse,
  string,
  { rejectValue: string }
>("videoteca/fetchFolderAssets", async (folderId, thunkAPI) => {
  try {
    return await videotecaService.getFolderAssets(folderId);
  } catch (error) {
    return thunkAPI.rejectWithValue(
      getErrorMessage(error, "No se pudieron cargar los archivos"),
    );
  }
});

export const uploadVideotecaAsset = createAsyncThunk<
  IVideoAsset,
  { folderId: string; formData: FormData },
  { rejectValue: string }
>("videoteca/uploadAsset", async ({ folderId, formData }, thunkAPI) => {
  try {
    return await videotecaService.uploadAsset(folderId, formData);
  } catch (error) {
    return thunkAPI.rejectWithValue(
      getErrorMessage(error, "No se pudo subir el archivo"),
    );
  }
});

export const updateVideotecaAsset = createAsyncThunk<
  IVideoAsset,
  { assetId: string; name?: string; description?: string | null },
  { rejectValue: string }
>("videoteca/updateAsset", async ({ assetId, name, description }, thunkAPI) => {
  try {
    return await videotecaService.updateAsset(assetId, { name, description });
  } catch (error) {
    return thunkAPI.rejectWithValue(
      getErrorMessage(error, "No se pudo actualizar el archivo"),
    );
  }
});

export const replaceVideotecaAsset = createAsyncThunk<
  IVideoAsset,
  { assetId: string; formData: FormData },
  { rejectValue: string }
>("videoteca/replaceAsset", async ({ assetId, formData }, thunkAPI) => {
  try {
    return await videotecaService.replaceAssetFile(assetId, formData);
  } catch (error) {
    return thunkAPI.rejectWithValue(
      getErrorMessage(error, "No se pudo reemplazar el archivo"),
    );
  }
});

export const deleteVideotecaAsset = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("videoteca/deleteAsset", async (assetId, thunkAPI) => {
  try {
    await videotecaService.deleteAsset(assetId);
    return assetId;
  } catch (error) {
    return thunkAPI.rejectWithValue(
      getErrorMessage(error, "No se pudo eliminar el archivo"),
    );
  }
});

const upsertFolder = (folders: IVideoFolder[], nextFolder: IVideoFolder) => {
  const exists = folders.some((folder) => folder._id === nextFolder._id);
  const nextFolders = exists
    ? folders.map((folder) =>
        folder._id === nextFolder._id ? nextFolder : folder,
      )
    : [...folders, nextFolder];

  return nextFolders.sort(
    (a, b) => a.order - b.order || a.name.localeCompare(b.name),
  );
};

const videotecaSlice = createSlice({
  name: "videoteca",
  initialState,
  reducers: {
    resetVideotecaState(state) {
      state.isError = false;
      state.message = "";
    },
    clearVideotecaDetail(state) {
      state.selectedFolder = null;
      state.assets = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVideotecaFolders.pending, (state) => {
        state.isFoldersLoading = true;
        state.isError = false;
      })
      .addCase(fetchVideotecaFolders.fulfilled, (state, action) => {
        state.isFoldersLoading = false;
        state.folders = action.payload;
      })
      .addCase(fetchVideotecaFolders.rejected, (state, action) => {
        state.isFoldersLoading = false;
        state.isError = true;
        state.message = action.payload ?? "Error";
      })
      .addCase(createVideotecaFolder.pending, (state) => {
        state.isSavingFolder = true;
        state.isError = false;
      })
      .addCase(createVideotecaFolder.fulfilled, (state, action) => {
        state.isSavingFolder = false;
        state.folders = [...state.folders, action.payload].sort(
          (a, b) => a.order - b.order || a.name.localeCompare(b.name),
        );
      })
      .addCase(createVideotecaFolder.rejected, (state, action) => {
        state.isSavingFolder = false;
        state.isError = true;
        state.message = action.payload ?? "Error";
      })
      .addCase(updateVideotecaFolder.pending, (state) => {
        state.isSavingFolder = true;
        state.isError = false;
      })
      .addCase(updateVideotecaFolder.fulfilled, (state, action) => {
        state.isSavingFolder = false;
        state.folders = upsertFolder(state.folders, action.payload);
        if (state.selectedFolder?._id === action.payload._id) {
          state.selectedFolder = action.payload;
        }
      })
      .addCase(updateVideotecaFolder.rejected, (state, action) => {
        state.isSavingFolder = false;
        state.isError = true;
        state.message = action.payload ?? "Error";
      })
      .addCase(deleteVideotecaFolder.pending, (state) => {
        state.isDeletingFolder = true;
        state.isError = false;
      })
      .addCase(deleteVideotecaFolder.fulfilled, (state, action) => {
        state.isDeletingFolder = false;
        state.folders = state.folders.filter(
          (folder) => folder._id !== action.payload,
        );
        if (state.selectedFolder?._id === action.payload) {
          state.selectedFolder = null;
          state.assets = [];
        }
      })
      .addCase(deleteVideotecaFolder.rejected, (state, action) => {
        state.isDeletingFolder = false;
        state.isError = true;
        state.message = action.payload ?? "Error";
      })
      .addCase(fetchVideotecaFolderAssets.pending, (state) => {
        state.isFolderDetailLoading = true;
        state.isError = false;
      })
      .addCase(fetchVideotecaFolderAssets.fulfilled, (state, action) => {
        state.isFolderDetailLoading = false;
        state.selectedFolder = action.payload.folder;
        state.assets = action.payload.assets;
        const exists = state.folders.some(
          (folder) => folder._id === action.payload.folder._id,
        );
        state.folders = exists
          ? upsertFolder(state.folders, action.payload.folder)
          : [...state.folders, action.payload.folder].sort(
              (a, b) => a.order - b.order || a.name.localeCompare(b.name),
            );
      })
      .addCase(fetchVideotecaFolderAssets.rejected, (state, action) => {
        state.isFolderDetailLoading = false;
        state.isError = true;
        state.message = action.payload ?? "Error";
      })
      .addCase(uploadVideotecaAsset.pending, (state) => {
        state.isUploadingAsset = true;
        state.isError = false;
      })
      .addCase(uploadVideotecaAsset.fulfilled, (state, action) => {
        state.isUploadingAsset = false;
        state.assets.unshift(action.payload);
        if (state.selectedFolder) {
          state.selectedFolder.assetCount += 1;
          if (!state.selectedFolder.coverImageUrl && action.payload.type === "image") {
            state.selectedFolder.coverImageUrl = action.payload.fileUrl;
          }
          state.folders = upsertFolder(state.folders, state.selectedFolder);
        }
      })
      .addCase(uploadVideotecaAsset.rejected, (state, action) => {
        state.isUploadingAsset = false;
        state.isError = true;
        state.message = action.payload ?? "Error";
      })
      .addCase(updateVideotecaAsset.pending, (state) => {
        state.isSavingAsset = true;
        state.isError = false;
      })
      .addCase(updateVideotecaAsset.fulfilled, (state, action) => {
        state.isSavingAsset = false;
        state.assets = state.assets.map((asset) =>
          asset._id === action.payload._id ? action.payload : asset,
        );
      })
      .addCase(updateVideotecaAsset.rejected, (state, action) => {
        state.isSavingAsset = false;
        state.isError = true;
        state.message = action.payload ?? "Error";
      })
      .addCase(replaceVideotecaAsset.pending, (state) => {
        state.isSavingAsset = true;
        state.isError = false;
      })
      .addCase(replaceVideotecaAsset.fulfilled, (state, action) => {
        state.isSavingAsset = false;
        state.assets = state.assets.map((asset) =>
          asset._id === action.payload._id ? action.payload : asset,
        );
        if (state.selectedFolder && action.payload.type === "image") {
          state.selectedFolder.coverImageUrl = state.selectedFolder.coverImageUrl
            ? state.selectedFolder.coverImageUrl
            : action.payload.fileUrl;
          state.folders = upsertFolder(state.folders, state.selectedFolder);
        }
      })
      .addCase(replaceVideotecaAsset.rejected, (state, action) => {
        state.isSavingAsset = false;
        state.isError = true;
        state.message = action.payload ?? "Error";
      })
      .addCase(deleteVideotecaAsset.pending, (state) => {
        state.isDeletingAsset = true;
        state.isError = false;
      })
      .addCase(deleteVideotecaAsset.fulfilled, (state, action) => {
        state.isDeletingAsset = false;
        const removedAsset = state.assets.find((asset) => asset._id === action.payload);
        state.assets = state.assets.filter((asset) => asset._id !== action.payload);

        if (removedAsset && state.selectedFolder) {
          state.selectedFolder.assetCount = Math.max(
            0,
            state.selectedFolder.assetCount - 1,
          );
          if (state.selectedFolder.coverImageUrl === removedAsset.fileUrl) {
            const nextCover =
              state.assets.find((asset) => asset.type === "image")?.fileUrl ?? null;
            state.selectedFolder.coverImageUrl = nextCover;
          }
          state.folders = upsertFolder(state.folders, state.selectedFolder);
        }
      })
      .addCase(deleteVideotecaAsset.rejected, (state, action) => {
        state.isDeletingAsset = false;
        state.isError = true;
        state.message = action.payload ?? "Error";
      });
  },
});

export const { resetVideotecaState, clearVideotecaDetail } =
  videotecaSlice.actions;

export default videotecaSlice.reducer;
