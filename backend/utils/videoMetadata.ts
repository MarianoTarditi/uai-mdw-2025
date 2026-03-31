import { execFile } from "child_process";
import { promisify } from "util";

const ffprobeStatic = require("ffprobe-static") as { path?: string };

const execFileAsync = promisify(execFile);

export const MAX_VIDEO_DURATION_SECONDS = 60;

export const getVideoDurationSeconds = async (filePath: string) => {
  const ffprobePath = ffprobeStatic?.path;

  if (!ffprobePath) {
    throw new Error("ffprobe binary is not available");
  }

  const { stdout } = await execFileAsync(ffprobePath, [
    "-v",
    "error",
    "-print_format",
    "json",
    "-show_format",
    "-show_streams",
    filePath,
  ]);

  const parsed = JSON.parse(stdout || "{}") as {
    format?: { duration?: string };
    streams?: Array<{ codec_type?: string; duration?: string }>;
  };

  const streamDuration = parsed.streams?.find(
    (stream) => stream.codec_type === "video" && stream.duration,
  )?.duration;

  const durationValue = Number(parsed.format?.duration ?? streamDuration ?? 0);

  if (!Number.isFinite(durationValue) || durationValue <= 0) {
    throw new Error("Could not determine video duration");
  }

  return durationValue;
};
