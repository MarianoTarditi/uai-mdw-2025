import { Link } from "react-router-dom";
import { FolderClosed, ImageIcon, Pencil, PlayCircle, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { IVideoFolder } from "@/types/videoteca";
import { resolveMediaUrl } from "@/utils/mediaUrl";

interface FolderCardProps {
  folder: IVideoFolder;
  canManage: boolean;
  onRename: (folder: IVideoFolder) => void;
  onDelete: (folder: IVideoFolder) => void;
}

export function FolderCard({
  folder,
  canManage,
  onRename,
  onDelete,
}: FolderCardProps) {
  const coverUrl = resolveMediaUrl(folder.coverImageUrl, false);

  return (
    <Card className="group relative overflow-hidden border-primary/15 bg-gradient-to-br from-card via-card to-primary/5 py-0 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <CardContent className="p-0">
        <Link to={`/Videoteca/${folder._id}`} className="block">
          <div className="relative aspect-square overflow-hidden">
            {coverUrl ? (
              <>
                <img
                  src={coverUrl}
                  alt={folder.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />
              </>
            ) : (
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(34,197,94,0.24),_transparent_42%),linear-gradient(135deg,rgba(17,24,39,0.94),rgba(17,24,39,0.72))]" />
            )}

            {!coverUrl && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                  <FolderClosed className="h-14 w-14 text-emerald-200" />
                </div>
              </div>
            )}

            <div className="absolute inset-x-0 bottom-0 p-4 text-white">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h3 className="line-clamp-2 text-lg font-semibold tracking-tight">
                    {folder.name}
                  </h3>
                  <p className="line-clamp-2 text-sm text-white/75">
                    {folder.description || "Biblioteca de movilidad, técnica y descarga."}
                  </p>
                </div>
                <Badge variant="secondary" className="bg-white/15 text-white">
                  {folder.assetCount} assets
                </Badge>
              </div>
            </div>
          </div>
        </Link>

        <div className="flex items-center justify-between gap-2 border-t border-border/60 px-4 py-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <ImageIcon className="h-4 w-4" />
            <span>Fotos y videos</span>
            <PlayCircle className="ml-2 h-4 w-4" />
            <span>Hasta 60s</span>
          </div>

          {canManage && (
            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => onRename(folder)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-destructive hover:text-destructive"
                onClick={() => onDelete(folder)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
