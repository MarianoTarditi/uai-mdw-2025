"use client";

import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, FolderPlus, Pencil, Plus, Search, SlidersHorizontal, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/app/reduxHooks";
import { SpinnerButton } from "@/components/private/spinner/Spinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SelectNative } from "@/components/ui/select-native";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  clearVideotecaDetail,
  deleteVideotecaAsset,
  deleteVideotecaFolder,
  fetchVideotecaFolderAssets,
  fetchVideotecaFolders,
  replaceVideotecaAsset,
  updateVideotecaFolder,
  updateVideotecaAsset,
  uploadVideotecaAsset,
} from "@/features/videoteca/videotecaSlice";
import { UserRole } from "@/features/users/userSlice";
import { AssetCard } from "@/pages/videoteca/components/AssetCard";
import { AssetUploaderDialog } from "@/pages/videoteca/components/AssetUploaderDialog";
import { FolderDialog } from "@/pages/videoteca/components/FolderDialog";

export default function FolderDetail() {
  const { folderId = "" } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const {
    folders,
    assets,
    selectedFolder,
    isFolderDetailLoading,
    isUploadingAsset,
    isSavingAsset,
    isDeletingAsset,
    isSavingFolder,
    isDeletingFolder,
  } = useAppSelector((state) => state.videoteca);
  const roles = useAppSelector((state) => state.user.profile?.roles ?? []);
  const canManage =
    roles.includes(UserRole.Admin) || roles.includes(UserRole.Trainer);

  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [assetTypeFilter, setAssetTypeFilter] = useState<"all" | "image" | "video">("all");
  const [sortBy, setSortBy] = useState("recent");

  const currentFolder = useMemo(
    () => selectedFolder ?? folders.find((folder) => folder._id === folderId),
    [folderId, folders, selectedFolder],
  );

  useEffect(() => {
    dispatch(fetchVideotecaFolderAssets(folderId));

    if (folders.length === 0) {
      dispatch(fetchVideotecaFolders());
    }

    return () => {
      dispatch(clearVideotecaDetail());
    };
  }, [dispatch, folderId, folders.length]);

  const handleFolderRename = async (payload: {
    name: string;
    description: string | null;
  }) => {
    const result = await dispatch(
      updateVideotecaFolder({
        folderId,
        payload,
      }),
    );

    if (updateVideotecaFolder.fulfilled.match(result)) {
      toast.success("Nombre de carpeta actualizado.");
      setIsRenameOpen(false);
      return;
    }

    toast.error((result.payload as string) || "No pudimos renombrar la carpeta.");
  };

  const handleUpload = async (payload: FormData) => {
    const result = await dispatch(uploadVideotecaAsset({ folderId, formData: payload }));
    if (uploadVideotecaAsset.fulfilled.match(result)) {
      await dispatch(fetchVideotecaFolderAssets(folderId));
      toast.success("Archivo subido a la videoteca.");
      return;
    }

    throw new Error((result.payload as string) || "No pudimos subir el archivo.");
  };

  const handleAssetRename = async ({
    assetId,
    name,
    description,
  }: {
    assetId: string;
    name?: string;
    description?: string | null;
  }) => {
    const result = await dispatch(
      updateVideotecaAsset({
        assetId,
        name,
        description,
      }),
    );
    if (updateVideotecaAsset.fulfilled.match(result)) {
      toast.success("Archivo actualizado.");
      return;
    }

    throw new Error((result.payload as string) || "No pudimos actualizar el archivo.");
  };

  const handleAssetReplace = async (
    assetId: string,
    file: File,
    name: string | null,
  ) => {
    const payload = new FormData();
    payload.append("file", file);
    if (name?.trim()) {
      payload.append("name", name.trim());
    }

    const result = await dispatch(
      replaceVideotecaAsset({
        assetId,
        formData: payload,
      }),
    );
    if (replaceVideotecaAsset.fulfilled.match(result)) {
      await dispatch(fetchVideotecaFolderAssets(folderId));
      toast.success("Archivo reemplazado.");
      return;
    }

    throw new Error((result.payload as string) || "No pudimos reemplazar el archivo.");
  };

  const handleAssetDelete = async (assetId: string) => {
    const result = await dispatch(deleteVideotecaAsset(assetId));
    if (deleteVideotecaAsset.fulfilled.match(result)) {
      await dispatch(fetchVideotecaFolderAssets(folderId));
      toast.success("Archivo eliminado.");
      return;
    }

    toast.error((result.payload as string) || "No pudimos eliminar el archivo.");
  };

  const handleFolderDelete = async () => {
    const result = await dispatch(deleteVideotecaFolder(folderId));
    if (deleteVideotecaFolder.fulfilled.match(result)) {
      toast.success("Carpeta eliminada.");
      navigate("/Videoteca");
      return;
    }

    toast.error((result.payload as string) || "No pudimos eliminar la carpeta.");
  };

  const isLoadingInitialState =
    isFolderDetailLoading && assets.length === 0;
  const displayedAssetCount = currentFolder?.assetCount ?? assets.length;
  const filteredAssets = useMemo(() => {
    const query = search.trim().toLowerCase();

    return [...assets]
      .filter((asset) => {
        const matchesType =
          assetTypeFilter === "all" ? true : asset.type === assetTypeFilter;
        const matchesSearch =
          !query ||
          asset.name.toLowerCase().includes(query) ||
          (asset.description ?? "").toLowerCase().includes(query);

        return matchesType && matchesSearch;
      })
      .sort((left, right) => {
        if (sortBy === "alphabetical") {
          return left.name.localeCompare(right.name);
        }

        return (
          new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()
        );
      });
  }, [assetTypeFilter, assets, search, sortBy]);

  const handleSetFolderCover = async (assetId: string) => {
    const result = await dispatch(
      updateVideotecaFolder({
        folderId,
        payload: {
          coverAssetId: assetId,
        },
      }),
    );

    if (updateVideotecaFolder.fulfilled.match(result)) {
      toast.success("Portada actualizada.");
      return;
    }

    throw new Error((result.payload as string) || "No pudimos actualizar la portada.");
  };

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-border/60 bg-gradient-to-br from-primary/10 via-card to-card py-2 shadow-sm">
        <CardHeader className="gap-4 pb-0">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Button asChild variant="outline" className="rounded-full border-border/60 bg-background/80">
              <Link to="/Videoteca">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver a carpetas
              </Link>
            </Button>

            {canManage ? (
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  className="rounded-full border-border/60 bg-background/80"
                  onClick={() => setIsRenameOpen(true)}
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Renombrar carpeta
                </Button>
                <Button
                  variant="outline"
                  className="rounded-full border-border/60 bg-background/80"
                  onClick={() => setIsDeleteOpen(true)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Eliminar carpeta
                </Button>
                <Button
                  className="h-10 rounded-full px-4"
                  onClick={() => setIsUploadOpen(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Subir archivo
                </Button>
              </div>
            ) : null}
          </div>

          <div className="space-y-4">
            <div className="inline-flex w-fit rounded-full border border-border/60 bg-background/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
              {currentFolder?.slug || "videoteca"}
            </div>
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl space-y-2">
                <CardTitle className="text-2xl font-semibold tracking-tight md:text-3xl">
                  {currentFolder?.name || "Cargando carpeta..."}
                </CardTitle>
                <p className="text-sm leading-5 text-muted-foreground">
                  Material audiovisual ordenado para explicar, reforzar y repetir sin confusión.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="rounded-full border border-border/60 bg-background/70 px-4 py-2 text-foreground">
                  {displayedAssetCount} archivos
                </Badge>
                <Badge variant="secondary" className="rounded-full border border-border/60 bg-background/70 px-4 py-2 text-foreground">
                  {canManage ? "Modo gestión" : "Solo lectura"}
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {isLoadingInitialState ? (
        <div className="flex min-h-[240px] items-center justify-center rounded-[28px] border border-dashed border-border/60 bg-card/40">
          <SpinnerButton variant="sizes" />
        </div>
      ) : assets.length === 0 ? (
        <Card className="rounded-[28px] border-dashed border-border/60 py-8">
          <CardContent className="space-y-3 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[20px] bg-primary/10 text-primary">
              <FolderPlus className="h-8 w-8" />
            </div>
            <p className="text-lg font-semibold">
              Esta carpeta todavía no tiene archivos.
            </p>
            <p className="mx-auto max-w-xl text-sm text-muted-foreground">
              {canManage
                ? "Subí imágenes o videos cortos para que el alumno tenga una referencia clara y concreta."
                : "Cuando tu trainer agregue material, lo vas a encontrar acá con vista previa y detalles."}
            </p>
            {canManage ? (
              <div>
                <Button onClick={() => setIsUploadOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Subir primer archivo
                </Button>
              </div>
            ) : null}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <Card className="border-border/60 bg-card/70 py-2 shadow-sm">
            <CardContent className="grid gap-3 pt-4 md:grid-cols-[minmax(0,1fr)_180px_180px]">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Buscar dentro de la carpeta..."
                  className="h-10 rounded-full border-border/60 bg-background/70 pl-11"
                />
              </div>
              <SelectNative
                value={assetTypeFilter}
                onChange={(event) =>
                  setAssetTypeFilter(event.target.value as "all" | "image" | "video")
                }
                className="h-10 rounded-full border-border/60 bg-background/70"
              >
                <option value="all">Todos los tipos</option>
                <option value="image">Solo imágenes</option>
                <option value="video">Solo videos</option>
              </SelectNative>
              <div className="flex items-center gap-2">
                <SelectNative
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value)}
                  className="h-10 rounded-full border-border/60 bg-background/70"
                >
                  <option value="recent">Más recientes</option>
                  <option value="alphabetical">A-Z</option>
                </SelectNative>
                <div className="hidden items-center rounded-full border border-border/60 bg-background/70 px-4 py-2 text-xs text-muted-foreground md:flex">
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
                  {filteredAssets.length} resultados
                </div>
              </div>
            </CardContent>
          </Card>

          {filteredAssets.length === 0 ? (
            <Card className="rounded-[28px] border-dashed border-border/60 py-8">
              <CardContent className="space-y-2 text-center">
                <p className="text-lg font-semibold">
                  No encontramos archivos con esos filtros.
                </p>
                <p className="text-sm text-muted-foreground">
                  Probá con otra búsqueda o cambiá el tipo de material para seguir explorando la carpeta.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 xl:grid-cols-2">
              {filteredAssets.map((asset) => (
                <AssetCard
                  key={asset._id}
                  asset={asset}
                  canManage={canManage}
                  isBusy={isUploadingAsset || isSavingAsset || isDeletingAsset}
                  isCover={currentFolder?.coverAssetId === asset._id}
                  onSaveDetails={handleAssetRename}
                  onReplace={handleAssetReplace}
                  onDelete={handleAssetDelete}
                  onSetAsCover={handleSetFolderCover}
                />
              ))}
            </div>
          )}
        </div>
      )}

      <FolderDialog
        open={isRenameOpen}
        title="Renombrar carpeta"
        description="Mantené nombres claros para que el alumno encuentre rápido el grupo articular correcto."
        initialName={currentFolder?.name}
        initialDescription={currentFolder?.description}
        isLoading={isSavingFolder}
        onOpenChange={setIsRenameOpen}
        onSubmit={handleFolderRename}
      />

      <AssetUploaderDialog
        open={isUploadOpen}
        isSubmitting={isUploadingAsset}
        onOpenChange={setIsUploadOpen}
        onSubmit={handleUpload}
      />

      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar carpeta</AlertDialogTitle>
            <AlertDialogDescription>
              Se van a eliminar también sus archivos asociados. Si no lo pensaste bien, frená ahora.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeletingFolder}
              onClick={() => void handleFolderDelete()}
            >
              Eliminar carpeta
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
