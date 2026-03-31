import axiosPrivate from "@/config/axios";
import type {
  IFolderAssetsResponse,
  IVideoAsset,
  IVideoFolder,
} from "@/types/videoteca";

const VIDEOTECA_URL = "/videoteca";

const getFolders = async (): Promise<IVideoFolder[]> => {
  const response = await axiosPrivate.get(`${VIDEOTECA_URL}/folders`);
  return response.data.data;
};

const createFolder = async (payload: {
  name: string;
  description?: string | null;
  order?: number;
}): Promise<IVideoFolder> => {
  const response = await axiosPrivate.post(`${VIDEOTECA_URL}/folders`, payload);
  return response.data.data;
};

const updateFolder = async (
  folderId: string,
  payload: Partial<{
    name: string;
    description: string | null;
    order: number;
    coverAssetId: string | null;
  }>,
): Promise<IVideoFolder> => {
  const response = await axiosPrivate.patch(
    `${VIDEOTECA_URL}/folders/${folderId}`,
    payload,
  );
  return response.data.data;
};

const deleteFolder = async (folderId: string) => {
  const response = await axiosPrivate.delete(
    `${VIDEOTECA_URL}/folders/${folderId}`,
  );
  return response.data;
};

const getFolderAssets = async (
  folderId: string,
): Promise<IFolderAssetsResponse> => {
  const response = await axiosPrivate.get(
    `${VIDEOTECA_URL}/folders/${folderId}/assets`,
  );
  return response.data.data;
};

const uploadAsset = async (
  folderId: string,
  payload: FormData,
): Promise<IVideoAsset> => {
  const response = await axiosPrivate.post(
    `${VIDEOTECA_URL}/folders/${folderId}/assets`,
    payload,
  );
  return response.data.data;
};

const updateAsset = async (
  assetId: string,
  payload: { name?: string; description?: string | null },
): Promise<IVideoAsset> => {
  const response = await axiosPrivate.patch(
    `${VIDEOTECA_URL}/assets/${assetId}`,
    payload,
  );
  return response.data.data;
};

const replaceAssetFile = async (
  assetId: string,
  payload: FormData,
): Promise<IVideoAsset> => {
  const response = await axiosPrivate.put(
    `${VIDEOTECA_URL}/assets/${assetId}/file`,
    payload,
  );
  return response.data.data;
};

const deleteAsset = async (assetId: string) => {
  const response = await axiosPrivate.delete(`${VIDEOTECA_URL}/assets/${assetId}`);
  return response.data;
};

export default {
  getFolders,
  createFolder,
  updateFolder,
  deleteFolder,
  getFolderAssets,
  uploadAsset,
  renameAsset: updateAsset,
  updateAsset,
  replaceAssetFile,
  deleteAsset,
};
