import { useMemo, useState } from "react";
import { ImagePlus, UploadCloud, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const MAX_FILE_SIZE = 100 * 1024 * 1024;
const MAX_VIDEO_DURATION_SECONDS = 60;

const formatBytes = (bytes: number) => {
  if (!bytes) return "0 KB";
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const getVideoDuration = (file: File) =>
  new Promise<number>((resolve, reject) => {
    const video = document.createElement("video");
    const url = URL.createObjectURL(file);

    video.preload = "metadata";
    video.onloadedmetadata = () => {
      URL.revokeObjectURL(url);
      resolve(video.duration);
    };
    video.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("No se pudo leer la duración del video."));
    };
    video.src = url;
  });

interface AssetUploaderProps {
  isLoading: boolean;
  onUpload: (payload: { file: File; name: string | null }) => Promise<void>;
}

export function AssetUploader({ isLoading, onUpload }: AssetUploaderProps) {
  const [assetName, setAssetName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const helperText = useMemo(
    () => "Acepta JPG, PNG, WEBP, GIF, MP4, WEBM y MOV. Videos hasta 100MB y 60 segundos.",
    [],
  );

  const validateFile = async (file: File) => {
    if (file.size > MAX_FILE_SIZE) {
      throw new Error("El archivo supera el límite de 100MB.");
    }

    if (file.type.startsWith("video/")) {
      const duration = await getVideoDuration(file);
      if (duration > MAX_VIDEO_DURATION_SECONDS) {
        throw new Error("El video no puede durar más de 60 segundos.");
      }
    }
  };

  const handleFileChange = async (file: File | null) => {
    setSelectedFile(null);
    setError(null);

    if (!file) {
      return;
    }

    try {
      await validateFile(file);
      setSelectedFile(file);
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "No se pudo validar el archivo.",
      );
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Seleccioná un archivo para subir.");
      return;
    }

    await onUpload({
      file: selectedFile,
      name: assetName.trim() || null,
    });

    setAssetName("");
    setSelectedFile(null);
    setError(null);
  };

  return (
    <Card className="border-primary/15 bg-card/80 py-4 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <UploadCloud className="h-5 w-5 text-primary" />
          Subir nuevo contenido
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 md:grid-cols-[1.2fr,1fr]">
          <div className="space-y-2">
            <label className="text-sm font-medium">Nombre del archivo</label>
            <Input
              value={assetName}
              onChange={(event) => setAssetName(event.target.value)}
              placeholder="Ej: movilidad de tobillo en pared"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Archivo local</label>
            <Input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/quicktime"
              onChange={(event) => void handleFileChange(event.target.files?.[0] ?? null)}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-dashed border-primary/20 bg-primary/5 p-4">
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="inline-flex items-center gap-2 rounded-full bg-background px-3 py-1 text-muted-foreground">
              <ImagePlus className="h-4 w-4 text-primary" />
              Imagen o video
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-background px-3 py-1 text-muted-foreground">
              <Video className="h-4 w-4 text-primary" />
              Videos: {MAX_VIDEO_DURATION_SECONDS}s máx.
            </span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">{helperText}</p>
          {selectedFile && (
            <p className="mt-3 text-sm font-medium text-foreground">
              Seleccionado: {selectedFile.name} · {formatBytes(selectedFile.size)}
            </p>
          )}
          {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
        </div>

        <div className="flex justify-end">
          <Button type="button" onClick={handleUpload} disabled={isLoading || !selectedFile}>
            {isLoading ? "Subiendo..." : "Subir asset"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
