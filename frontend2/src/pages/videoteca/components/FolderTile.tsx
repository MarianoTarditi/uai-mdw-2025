import { Link } from "react-router-dom";
import { ArrowUpRight, Folder, Layers3, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { resolveMediaUrl } from "@/utils/mediaUrl";
import type { IVideoFolder } from "@/types/videoteca";

interface FolderTileProps {
  folder: IVideoFolder;
  highlight?: boolean;
}

export function FolderTile({ folder, highlight = false }: FolderTileProps) {
  const coverImage = resolveMediaUrl(folder.coverImageUrl, false);

  return (
    <Link
      to={`/Videoteca/${folder._id}`}
      className={cn(
        "group relative block overflow-hidden rounded-[28px] border border-border/60 bg-card/70 p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl",
        highlight && "border-primary/30 shadow-lg shadow-primary/10",
      )}
    >
      {coverImage ? (
        <div
          className="absolute inset-0 opacity-20 transition-opacity duration-300 group-hover:opacity-30"
          style={{
            backgroundImage: `url(${coverImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      ) : null}

      <div className="relative flex aspect-square flex-col justify-between rounded-[22px] border border-border/60 bg-background/70 p-4 backdrop-blur-sm">
        <div className="flex items-start justify-between gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-inner shadow-primary/10">
            <Folder className="h-7 w-7" />
          </div>
          <ArrowUpRight className="h-5 w-5 text-muted-foreground transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-primary" />
        </div>

        <div className="space-y-3">
          <div className="space-y-1">
            <p className="line-clamp-2 text-lg font-semibold tracking-tight text-foreground">
              {folder.name}
            </p>
            <p className="text-sm text-muted-foreground">
              Última actualización:{" "}
              {new Date(folder.updatedAt).toLocaleDateString("es-AR")}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="rounded-full px-3 py-1">
              <Layers3 className="mr-1 h-3.5 w-3.5" />
              {folder.assetCount} archivos
            </Badge>
            <Badge variant="outline" className="rounded-full px-3 py-1 text-xs">
              <Sparkles className="mr-1 h-3.5 w-3.5" />
              {folder.slug}
            </Badge>
          </div>
        </div>
      </div>
    </Link>
  );
}
