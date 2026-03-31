"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Search, SlidersHorizontal } from "lucide-react";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/app/reduxHooks";
import { SpinnerButton } from "@/components/private/spinner/Spinner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SelectNative } from "@/components/ui/select-native";
import {
  createVideotecaFolder,
  fetchVideotecaFolders,
} from "@/features/videoteca/videotecaSlice";
import { UserRole } from "@/features/users/userSlice";
import { FolderDialog } from "@/pages/videoteca/components/FolderDialog";
import { FolderTile } from "@/pages/videoteca/components/FolderTile";

export default function Videoteca() {
  const dispatch = useAppDispatch();
  const { folders, isFoldersLoading, isSavingFolder } = useAppSelector(
    (state) => state.videoteca,
  );
  const roles = useAppSelector((state) => state.user.profile?.roles ?? []);
  const canManage =
    roles.includes(UserRole.Admin) || roles.includes(UserRole.Trainer);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("recent");

  useEffect(() => {
    dispatch(fetchVideotecaFolders());
  }, [dispatch]);

  const filteredFolders = useMemo(() => {
    const query = search.trim().toLowerCase();

    const nextFolders = folders.filter((folder) => {
      if (!query) return true;

      return (
        folder.name.toLowerCase().includes(query) ||
        folder.slug.toLowerCase().includes(query)
      );
    });

    return [...nextFolders].sort((left, right) => {
      if (sortBy === "alphabetical") {
        return left.name.localeCompare(right.name);
      }

      if (sortBy === "assets") {
        return right.assetCount - left.assetCount || left.name.localeCompare(right.name);
      }

      return (
        new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime()
      );
    });
  }, [folders, search, sortBy]);

  const handleCreateFolder = async (payload: {
    name: string;
    description: string | null;
  }) => {
    const result = await dispatch(createVideotecaFolder(payload));
    if (createVideotecaFolder.fulfilled.match(result)) {
      toast.success("Carpeta creada. Ahora sí tenés un contenedor serio para tu contenido.");
      setIsDialogOpen(false);
      return;
    }

    toast.error((result.payload as string) || "No pudimos crear la carpeta.");
  };

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-border/60 bg-gradient-to-br from-primary/10 via-card to-card py-2 shadow-sm">
        <CardHeader className="gap-3 pb-0">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-xl space-y-2">
              <div className="inline-flex rounded-full border border-border/60 bg-background/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                Videoteca
              </div>
              <CardTitle className="text-2xl font-semibold tracking-tight md:text-3xl">
                Biblioteca de ejercicios, movilidad y técnica.
              </CardTitle>
              <p className="text-sm leading-5 text-muted-foreground">
                Organizá contenido por articulación y dejá todo claro para que el alumno vea, entienda y repita sin perderse.
              </p>
            </div>

            {canManage ? (
              <Button
                onClick={() => setIsDialogOpen(true)}
                className="h-10 rounded-full px-4"
              >
                <Plus className="mr-2 h-4 w-4" />
                Nueva carpeta
              </Button>
            ) : null}
          </div>
        </CardHeader>
        <CardContent className="mt-4">
          <div className="grid gap-2 md:grid-cols-[minmax(0,1fr)_220px_auto]">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar por articulación..."
                className="h-10 rounded-full border-border/60 bg-background/70 pl-11"
              />
            </div>
            <SelectNative
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              className="h-10 rounded-full border-border/60 bg-background/70"
            >
              <option value="recent">Más recientes</option>
              <option value="alphabetical">A-Z</option>
              <option value="assets">Más archivos</option>
            </SelectNative>
            <div className="flex items-center rounded-full border border-border/60 bg-background/70 px-4 py-2 text-xs text-muted-foreground">
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              4 carpetas por fila
            </div>
          </div>
        </CardContent>
      </Card>

      {isFoldersLoading ? (
        <div className="flex min-h-[240px] items-center justify-center rounded-[28px] border border-dashed border-border/60 bg-card/40">
          <SpinnerButton variant="sizes" />
        </div>
      ) : filteredFolders.length === 0 ? (
        <Card className="rounded-[28px] border-dashed border-border/60 py-8">
          <CardContent className="space-y-3 text-center">
            <p className="text-lg font-semibold">
              {search.trim() ? "No encontramos carpetas con esa búsqueda." : "Todavía no hay carpetas creadas."}
            </p>
            <p className="mx-auto max-w-xl text-sm text-muted-foreground">
              {canManage
                ? "Empezá creando una carpeta por articulación. Cadera, rodilla, tobillo... lo que haga falta, pero ordenado."
                : "Cuando tu trainer cargue material, lo vas a ver acá organizado por carpeta."}
            </p>
            {canManage ? (
              <div>
                <Button onClick={() => setIsDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Crear primera carpeta
                </Button>
              </div>
            ) : null}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {filteredFolders.map((folder, index) => (
            <FolderTile
              key={folder._id}
              folder={folder}
              highlight={index < 2}
            />
          ))}
        </div>
      )}

      <FolderDialog
        open={isDialogOpen}
        title="Nueva carpeta de videoteca"
        description="Creá un grupo claro para que cada articulación tenga su propio espacio."
        isLoading={isSavingFolder}
        onOpenChange={setIsDialogOpen}
        onSubmit={handleCreateFolder}
      />
    </div>
  );
}

