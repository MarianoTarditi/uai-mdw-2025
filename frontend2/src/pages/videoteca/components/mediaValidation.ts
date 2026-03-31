const ONE_HUNDRED_MB = 100 * 1024 * 1024;
const MAX_VIDEO_DURATION_SECONDS = 60;

export const isVideoFile = (file: File) => file.type.startsWith("video/");

export const getVideoDuration = (file: File) =>
  new Promise<number>((resolve, reject) => {
    const video = document.createElement("video");
    const objectUrl = URL.createObjectURL(file);

    const cleanup = () => {
      URL.revokeObjectURL(objectUrl);
      video.removeAttribute("src");
      video.load();
    };

    video.preload = "metadata";
    video.onloadedmetadata = () => {
      const duration = Number.isFinite(video.duration) ? video.duration : 0;
      cleanup();
      resolve(duration);
    };
    video.onerror = () => {
      cleanup();
      reject(new Error("No pudimos leer la duración del video seleccionado."));
    };
    video.src = objectUrl;
  });

export const validateVideotecaFile = async (file: File) => {
  if (file.size > ONE_HUNDRED_MB) {
    throw new Error("El archivo supera el límite de 100MB.");
  }

  if (isVideoFile(file)) {
    const duration = await getVideoDuration(file);
    if (duration > MAX_VIDEO_DURATION_SECONDS) {
      throw new Error("El video no puede superar los 60 segundos.");
    }
  }
};

export const formatBytes = (bytes: number) => {
  if (!bytes) return "0 KB";

  const units = ["KB", "MB", "GB"];
  let value = bytes / 1024;
  let unitIndex = 0;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }

  return `${value >= 10 ? value.toFixed(0) : value.toFixed(1)} ${units[unitIndex]}`;
};

export const formatDuration = (seconds?: number | null) => {
  if (seconds === undefined || seconds === null) return "—";

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.round(seconds % 60)
    .toString()
    .padStart(2, "0");

  return `${minutes}:${remainingSeconds}`;
};
