import { InferSchemaType, Schema, model } from "mongoose";
import { auditPlugin } from "../utils/auditPlugin";

const videoAssetSchema = new Schema(
  {
    folderId: {
      type: Schema.Types.ObjectId,
      ref: "VideoFolder",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 120,
    },
    description: {
      type: String,
      default: null,
      trim: true,
      maxlength: 240,
    },
    type: {
      type: String,
      enum: ["image", "video"],
      required: true,
    },
    fileUrl: {
      type: String,
      required: true,
      trim: true,
    },
    mimeType: {
      type: String,
      required: true,
      trim: true,
    },
    fileSize: {
      type: Number,
      required: true,
      min: 0,
    },
    durationSeconds: {
      type: Number,
      default: null,
      min: 0,
    },
    originalName: {
      type: String,
      required: true,
      trim: true,
    },
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

videoAssetSchema.plugin(auditPlugin);

type VideoAssetType = InferSchemaType<typeof videoAssetSchema>;
const VideoAsset = model<VideoAssetType>("VideoAsset", videoAssetSchema);

export default VideoAsset;
