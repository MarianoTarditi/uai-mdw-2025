"use client";

import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/app/reduxHooks";
import {
  fetchRoutineTemplates,
  removeRoutineTemplate,
  renameRoutineTemplate,
  uploadRoutineTemplate,
} from "@/features/routines/routineSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SpinnerButton } from "@/components/private/spinner/Spinner";
import {
  ArrowLeft,
  Eye,
  FileSpreadsheet,
  Pencil,
  Save,
  Search,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const formatSize = (bytes: number) => {
  if (!bytes) return "0 KB";
  const kb = bytes / 1024;
  if (kb < 1024) return `${Math.round(kb)} KB`;
  return `${(kb / 1024).toFixed(2)} MB`;
};

type FileFilter = "all" | "pdf" | "excel";

export function RoutineTemplates() {
  const dispatch = useAppDispatch();
  const { templates, isTemplatesLoading, isTemplateUploading, isTemplateDeleting } =
    useAppSelector((state) => state.routine);
  const { profile } = useAppSelector((state) => state.user);
  const isStudent = profile?.roles?.includes("student");
  const staticUrl = import.meta.env.VITE_STATIC_URL;

  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FileFilter>("all");
  const [previewPdfUrl, setPreviewPdfUrl] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");

  useEffect(() => {
    dispatch(fetchRoutineTemplates());
  }, [dispatch]);

  const acceptedInfo = "Formatos permitidos: .pdf, .xls, .xlsx";

  const filteredTemplates = useMemo(() => {
    const q = search.toLowerCase().trim();

    return [...templates]
      .sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .filter((template) => {
        const isPdf = template.mimeType?.includes("pdf");
        const byType =
          filter === "all" || (filter === "pdf" && isPdf) || (filter === "excel" && !isPdf);
        const bySearch = template.title.toLowerCase().includes(q);
        return byType && bySearch;
      });
  }, [filter, search, templates]);

  const handleUpload = async () => {
    if (!file) {
      toast.error("Selecciona un archivo para subir");
      return;
    }

    const formData = new FormData();
    formData.append("template", file);
    if (title.trim()) formData.append("title", title.trim());

    const result = await dispatch(uploadRoutineTemplate(formData));
    if (uploadRoutineTemplate.fulfilled.match(result)) {
      toast.success("Plantilla subida correctamente");
      setFile(null);
      setTitle("");
    } else {
      toast.error((result.payload as string) || "No se pudo subir la plantilla");
    }
  };

  const handleDelete = async (id: string) => {
    const result = await dispatch(removeRoutineTemplate(id));
    if (removeRoutineTemplate.fulfilled.match(result)) {
      toast.success("Plantilla eliminada");
    } else {
      toast.error((result.payload as string) || "No se pudo eliminar");
    }
  };

  const startRename = (id: string, currentTitle: string) => {
    setEditingId(id);
    setEditingTitle(currentTitle);
  };

  const cancelRename = () => {
    setEditingId(null);
    setEditingTitle("");
  };

  const saveRename = async () => {
    if (!editingId) return;

    const cleanTitle = editingTitle.trim();
    if (cleanTitle.length < 3) {
      toast.error("El título debe tener al menos 3 caracteres");
      return;
    }

    const result = await dispatch(
      renameRoutineTemplate({ id: editingId, title: cleanTitle }),
    );
    if (renameRoutineTemplate.fulfilled.match(result)) {
      toast.success("Título actualizado");
      cancelRename();
    } else {
      toast.error((result.payload as string) || "No se pudo renombrar");
    }
  };

  return (
    <div className="w-full space-y-4">
      <Card className="border-primary/20 bg-gradient-to-r from-primary/10 via-card to-card py-4">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-xl">
            <FileSpreadsheet className="h-5 w-5 text-primary" />
            Plantillas de Rutinas (Excel/PDF)
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm text-muted-foreground">
            Sección separada para archivos externos de planificación.
          </p>
          <Button asChild variant="outline" size="sm">
            <Link to="/GetAllRoutines">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a Rutinas
            </Link>
          </Button>
        </CardContent>
      </Card>

      {!isStudent && (
        <Card className="py-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Subir nueva plantilla</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Título de la plantilla (opcional)"
            />
            <Input
              type="file"
              accept=".pdf,.xls,.xlsx,application/pdf,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            <p className="text-xs text-muted-foreground">{acceptedInfo}</p>
            <Button onClick={handleUpload} disabled={isTemplateUploading}>
              <Upload className="mr-2 h-4 w-4" />
              {isTemplateUploading ? "Subiendo..." : "Subir plantilla"}
            </Button>
          </CardContent>
        </Card>
      )}

      <Card className="py-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Plantillas cargadas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative min-w-[260px] flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-9"
                placeholder="Buscar por título..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant={filter === "all" ? "default" : "outline"}
                onClick={() => setFilter("all")}
              >
                Todo
              </Button>
              <Button
                size="sm"
                variant={filter === "pdf" ? "default" : "outline"}
                onClick={() => setFilter("pdf")}
              >
                PDF
              </Button>
              <Button
                size="sm"
                variant={filter === "excel" ? "default" : "outline"}
                onClick={() => setFilter("excel")}
              >
                Excel
              </Button>
            </div>
          </div>

          {isTemplatesLoading ? (
            <div className="flex justify-center py-8">
              <SpinnerButton variant="sizes" />
            </div>
          ) : filteredTemplates.length === 0 ? (
            <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
              No hay plantillas para ese filtro.
            </div>
          ) : (
            <div className="space-y-2">
              {filteredTemplates.map((template) => {
                const isPdf = template.mimeType?.includes("pdf");
                const fileUrl = `${staticUrl}${template.fileUrl}`;
                const isEditing = editingId === template._id;

                return (
                  <div
                    key={template._id}
                    className="flex flex-col gap-2 rounded-lg border bg-card p-3 md:flex-row md:items-center md:justify-between"
                  >
                    <div className="min-w-0 flex-1">
                      {isEditing ? (
                        <div className="flex items-center gap-2">
                          <Input
                            value={editingTitle}
                            onChange={(e) => setEditingTitle(e.target.value)}
                            className="h-8"
                          />
                          <Button size="sm" variant="secondary" onClick={saveRename}>
                            <Save className="mr-1 h-4 w-4" />
                            Guardar
                          </Button>
                          <Button size="sm" variant="ghost" onClick={cancelRename}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <p className="truncate font-medium">{template.title}</p>
                      )}
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        <Badge variant="secondary" className="text-[10px]">
                          {isPdf ? "PDF" : "EXCEL"}
                        </Badge>
                        <span>{formatSize(template.fileSize)}</span>
                        <span>
                          {new Date(template.createdAt).toLocaleDateString("es-AR")}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {isPdf ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setPreviewPdfUrl(fileUrl)}
                        >
                          <Eye className="mr-1 h-4 w-4" />
                          Vista previa
                        </Button>
                      ) : (
                        <Button asChild size="sm" variant="outline">
                          <a href={fileUrl} target="_blank" rel="noreferrer">
                            <FileSpreadsheet className="mr-1 h-4 w-4" />
                            Abrir
                          </a>
                        </Button>
                      )}

                      {!isStudent && !isEditing && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => startRename(template._id, template.title)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      )}

                      {!isStudent && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-destructive hover:text-destructive"
                          disabled={isTemplateDeleting}
                          onClick={() => handleDelete(template._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={Boolean(previewPdfUrl)} onOpenChange={(open) => !open && setPreviewPdfUrl(null)}>
        <DialogContent className="sm:max-w-[1000px] h-[90vh] p-0 overflow-hidden">
          <DialogHeader className="border-b px-5 py-3">
            <DialogTitle>Vista previa PDF</DialogTitle>
          </DialogHeader>
          {previewPdfUrl && (
            <iframe
              src={previewPdfUrl}
              title="Vista previa de plantilla PDF"
              className="h-full w-full"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
