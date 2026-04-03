import { useEffect, useRef, useState } from "react";
import {
  FileVideo,
  ImageIcon,
  Maximize2,
  Pencil,
  RefreshCcw,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { IVideoAsset } from "@/types/videoteca";
import { resolveMediaUrl } from "@/utils/mediaUrl";

const formatBytes = (bytes: number) => {
  if (!bytes) return "0 KB";
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const formatDuration = (durationSeconds: number | null) => {
  if (!durationSeconds) return "Imagen";
  if (durationSeconds < 60) return `${Math.round(durationSeconds)}s`;
  const minutes = Math.floor(durationSeconds / 60);
  const seconds = Math.round(durationSeconds % 60);
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
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

interface AssetCardProps {
  asset: IVideoAsset;
  canManage: boolean;
  isBusy: boolean;
  isCover: boolean;
  onSaveDetails: (payload: {
    assetId: string;
    name?: string;
    description?: string | null;
  }) => Promise<void>;
  onReplace: (assetId: string, file: File, name: string | null) => Promise<void>;
  onDelete: (assetId: string) => Promise<void>;
  onSetAsCover?: (assetId: string) => Promise<void>;
}

export function AssetCard({
  asset,
  canManage,
  isBusy,
  isCover,
  onSaveDetails,
  onReplace,
  onDelete,
  onSetAsCover,
}: AssetCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [draftName, setDraftName] = useState(asset.name);
  const [draftDescription, setDraftDescription] = useState(asset.description ?? "");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const fileUrl = resolveMediaUrl(asset.fileUrl, false);
  const isImageAsset = asset.type === "image";

  useEffect(() => {
    setDraftName(asset.name);
    setDraftDescription(asset.description ?? "");
  }, [asset.description, asset.name]);

  const handleReplace = async (file: File | null) => {
    if (!file) return;

    if (file.size > 100 * 1024 * 1024) {
      throw new Error("El archivo supera el límite de 100MB.");
    }

    if (file.type.startsWith("video/")) {
      const duration = await getVideoDuration(file);
      if (duration > 60) {
        throw new Error("El video no puede durar más de 60 segundos.");
      }
    }

    await onReplace(asset._id, file, draftName.trim() || null);
  };

  return (
    <Card className="overflow-hidden border-border/70 py-0 shadow-sm">
      <CardContent className="p-0">
        <div className="relative aspect-video overflow-hidden bg-muted">
          {isImageAsset ? (
            <button
              type="button"
              className="h-full w-full"
              onClick={() => setIsPreviewOpen(true)}
              aria-label={`Abrir ${asset.name} en pantalla completa`}
            >
              <img src={fileUrl ?? ""} alt={asset.name} className="h-full w-full object-cover" />
            </button>
          ) : (
            <button
              type="button"
              className="h-full w-full"
              onClick={() => setIsPreviewOpen(true)}
              aria-label={`Abrir ${asset.name} en pantalla completa`}
            >
              <video src={fileUrl ?? ""} className="h-full w-full object-cover" controls />
            </button>
          )}

          <div className="absolute left-3 top-3 flex items-center gap-2">
            <Badge
              variant="secondary"
              className="border border-border/60 bg-background/80 text-foreground shadow-sm backdrop-blur-sm"
            >
              {asset.type === "image" ? (
                <ImageIcon className="mr-1 h-3.5 w-3.5" />
              ) : (
                <FileVideo className="mr-1 h-3.5 w-3.5" />
              )}
              {asset.type === "image" ? "Imagen" : "Video"}
            </Badge>
            {isCover ? (
              <Badge variant="secondary" className="bg-primary/85 text-primary-foreground">
                Portada
              </Badge>
            ) : null}
          </div>

          <Button
            type="button"
            variant="secondary"
            size="icon-sm"
            className="absolute right-3 top-3 border border-border/60 bg-background/80 text-foreground shadow-sm backdrop-blur-sm hover:bg-background/90"
            onClick={() => setIsPreviewOpen(true)}
            aria-label={`Ver ${asset.name} en pantalla completa`}
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-4 p-4">
          <div className="space-y-2">
            {isEditing ? (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    value={draftName}
                    onChange={(event) => setDraftName(event.target.value)}
                  />
                  <Button
                    type="button"
                    size="sm"
                    disabled={isBusy || draftName.trim().length < 2}
                    onClick={() =>
                      void (async () => {
                        try {
                          await onSaveDetails({
                            assetId: asset._id,
                            name: draftName.trim(),
                            description: draftDescription.trim() || null,
                          });
                          setIsEditing(false);
                        } catch (error) {
                          toast.error(
                            error instanceof Error
                              ? error.message
                              : "No se pudo actualizar el archivo.",
                          );
                        }
                      })()
                    }
                  >
                    Guardar
                  </Button>
                </div>
                <Textarea
                  value={draftDescription}
                  onChange={(event) => setDraftDescription(event.target.value)}
                  maxLength={240}
                  placeholder="Sumá una referencia breve para explicar mejor el ejercicio."
                  className="min-h-24"
                />
                <div className="text-right text-xs text-muted-foreground">
                  {draftDescription.length}/240
                </div>
              </div>
            ) : (
              <div className="space-y-1">
                <h3 className="text-base font-semibold">{asset.name}</h3>
                {asset.description ? (
                  <p className="text-sm leading-5 text-muted-foreground">
                    {asset.description}
                  </p>
                ) : null}
              </div>
            )}

            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
              <span>{formatBytes(asset.fileSize)}</span>
              <span>·</span>
              <span>{formatDuration(asset.durationSeconds)}</span>
              <span>·</span>
              <span>{new Date(asset.createdAt).toLocaleDateString("es-AR")}</span>
            </div>
          </div>

          {canManage && (
            <div className="flex flex-wrap items-center gap-2">
              {!isEditing ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Renombrar
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setDraftName(asset.name);
                    setDraftDescription(asset.description ?? "");
                    setIsEditing(false);
                  }}
                >
                  Cancelar
                </Button>
              )}

              {canManage && asset.type === "image" && !isCover ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={isBusy}
                  onClick={() => void onSetAsCover?.(asset._id)}
                >
                  Usar como portada
                </Button>
              ) : null}

              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isBusy}
                onClick={() => fileInputRef.current?.click()}
              >
                <RefreshCcw className="mr-2 h-4 w-4" />
                Reemplazar
              </Button>
              <input
                ref={fileInputRef}
                className="hidden"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/quicktime"
                onChange={(event) => {
                  const file = event.target.files?.[0] ?? null;
                  void handleReplace(file).catch((error) => {
                    toast.error(
                      error instanceof Error
                        ? error.message
                        : "No se pudo reemplazar el archivo.",
                    );
                  });
                  event.target.value = "";
                }}
              />

              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive"
                disabled={isBusy}
                onClick={() => void onDelete(asset._id)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Eliminar
              </Button>
            </div>
          )}
        </div>
      </CardContent>

      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent
          className={
            isImageAsset
              ? "relative h-[100dvh] w-[100vw] max-w-none overflow-hidden rounded-none border-0 bg-black p-0"
              : "h-[95vh] w-[95vw] max-w-none overflow-hidden p-0"
          }
        >
          <DialogHeader
            className={
              isImageAsset
                ? "absolute left-0 top-0 z-10 w-full border-b border-white/10 bg-black/55 px-5 py-3 text-white backdrop-blur-sm"
                : "border-b px-5 py-3"
            }
          >
            <DialogTitle className="truncate text-base">{asset.name}</DialogTitle>
          </DialogHeader>

          <div
            className={
              isImageAsset
                ? "flex h-full w-full items-center justify-center bg-black p-4 pt-16"
                : "flex h-full w-full items-center justify-center bg-background p-3"
            }
          >
            {isImageAsset ? (
              <img
                src={fileUrl ?? ""}
                alt={asset.name}
                className="max-h-full max-w-full object-contain"
              />
            ) : (
              <video
                src={fileUrl ?? ""}
                className="max-h-full max-w-full"
                controls
                autoPlay
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
