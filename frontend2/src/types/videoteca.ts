export interface IVideoFolder {
  _id: string;
  name: string;
  slug: string;
  description: string | null;
  coverImageUrl: string | null;
  coverAssetId: string | null;
  order: number;
  assetCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface IVideoAsset {
  _id: string;
  folderId: string;
  name: string;
  description: string | null;
  type: "image" | "video";
  fileUrl: string;
  mimeType: string;
  fileSize: number;
  durationSeconds: number | null;
  originalName: string;
  createdAt: string;
  updatedAt: string;
}

export interface IFolderAssetsResponse {
  folder: IVideoFolder;
  assets: IVideoAsset[];
}

export type VideotecaAssetType = IVideoAsset["type"];
export type VideoFolderDto = IVideoFolder;
export type VideoAssetDto = IVideoAsset;
export type VideotecaFolderAssetsResponse = IFolderAssetsResponse;

export interface VideotecaFolderPayload {
  name: string;
  description?: string | null;
  order?: number;
  coverAssetId?: string | null;
}

export interface VideotecaAssetRenamePayload {
  name?: string;
  description?: string | null;
}
