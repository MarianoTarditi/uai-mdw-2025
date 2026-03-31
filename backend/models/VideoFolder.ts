import { InferSchemaType, Schema, model } from "mongoose";
import { auditPlugin } from "../utils/auditPlugin";

const videoFolderSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 80,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      index: true,
    },
    description: {
      type: String,
      default: null,
      trim: true,
      maxlength: 250,
    },
    coverImageUrl: {
      type: String,
      default: null,
      trim: true,
    },
    coverAssetId: {
      type: Schema.Types.ObjectId,
      ref: "VideoAsset",
      default: null,
    },
    order: {
      type: Number,
      default: 0,
      min: 0,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

videoFolderSchema.plugin(auditPlugin);

type VideoFolderType = InferSchemaType<typeof videoFolderSchema>;
const VideoFolder = model<VideoFolderType>("VideoFolder", videoFolderSchema);

export default VideoFolder;
