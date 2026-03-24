"use client";

import { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/reduxHooks";
import {
  fetchStudentPayments,
  fetchPaymentsSummary,
  fetchStudentsProgressSummary,
  sendPaymentReminder,
  updateStudentPayment,
  type IStudentPayment,
} from "@/features/users/paymentSlice";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
  type VisibilityState,
  flexRender,
} from "@tanstack/react-table";
import { DataTablePagination } from "@/components/private/table/DataTablePagination";
import { DataTableViewOptions } from "@/components/private/table/DataTableViewOptions";
import { SpinnerButton } from "@/components/private/spinner/Spinner";
import {
  ArrowUpDown,
  CircleDollarSign,
  Hourglass,
  Mail,
  MessageCircle,
  Pencil,
  Wallet,
} from "lucide-react";
import { toast } from "sonner";
import { PageHero } from "@/components/private/premium/PageHero";
import { MetricStrip } from "@/components/private/premium/MetricStrip";
import { PremiumTableShell } from "@/components/private/premium/PremiumTableShell";
import { PremiumErrorState } from "@/components/private/premium/PremiumErrorState";

const currencyFormatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 2,
});

const dateFormatter = new Intl.DateTimeFormat("es-AR");

const formatDate = (value: string | null | undefined) => {
  if (!value) return "-";
  return dateFormatter.format(new Date(value));
};

const toDateInputValue = (value: string | null | undefined) => {
  if (!value) return "";
  return new Date(value).toISOString().split("T")[0];
};

const paymentStatusMap: Record<
  "al_dia" | "vence" | "vencido" | "sin_configurar",
  { label: string; className: string }
> = {
  al_dia: { label: "Al día", className: "bg-green-600 hover:bg-green-700" },
  vence: { label: "Vence pronto", className: "bg-amber-500 hover:bg-amber-600" },
  vencido: { label: "Vencido", className: "bg-red-600 hover:bg-red-700" },
  sin_configurar: {
    label: "Sin configurar",
    className: "bg-slate-500 hover:bg-slate-600",
  },
};

const buildReminderMessage = (student: IStudentPayment) => {
  const fullName = `${student.name} ${student.lastName}`;
  const amountText =
    student.payment?.amount !== null && student.payment?.amount !== undefined
      ? currencyFormatter.format(student.payment.amount)
      : "el monto pendiente";

  const dueDateText = student.paymentStatus?.nextDueDate
    ? dateFormatter.format(new Date(student.paymentStatus.nextDueDate))
    : "la fecha pactada";

  return `Hola ${fullName}, te recuerdo el pago de ${amountText}. Próximo vencimiento: ${dueDateText}.`;
};

const normalizeWhatsappPhone = (phone?: string | null) => {
  if (!phone) return null;
  const digits = phone.replace(/\D/g, "");
  if (!digits) return null;
  return digits.startsWith("00") ? digits.slice(2) : digits;
};

const buildWhatsappLink = (student: IStudentPayment) => {
  const message = buildReminderMessage(student);
  const phone = normalizeWhatsappPhone(student.phone);
  if (!phone) return null;
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
};

const buildMailtoLink = (student: IStudentPayment) => {
  const subject = `Recordatorio de pago - ${student.name} ${student.lastName}`;
  const body = buildReminderMessage(student);
  return `mailto:${student.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};

function UpdatePaymentDialog({ student }: { student: IStudentPayment }) {
  const dispatch = useAppDispatch();
  const { isUpdatingLoading } = useAppSelector((state) => state.payment);

  const [isOpen, setIsOpen] = useState(false);
  const [startDate, setStartDate] = useState(
    toDateInputValue(student.payment?.startDate),
  );
  const [amount, setAmount] = useState(
    student.payment?.amount !== null && student.payment?.amount !== undefined
      ? String(student.payment.amount)
      : "",
  );
  const [paymentDate, setPaymentDate] = useState(
    toDateInputValue(student.payment?.paymentDate),
  );
  const [isPaid, setIsPaid] = useState(Boolean(student.payment?.isPaid));
  const [billingCycleDays, setBillingCycleDays] = useState(
    student.payment?.billingCycleDays ? String(student.payment.billingCycleDays) : "30",
  );

  useEffect(() => {
    if (!isOpen) return;
    setStartDate(toDateInputValue(student.payment?.startDate));
    setAmount(
      student.payment?.amount !== null && student.payment?.amount !== undefined
        ? String(student.payment.amount)
        : "",
    );
    setPaymentDate(toDateInputValue(student.payment?.paymentDate));
    setIsPaid(Boolean(student.payment?.isPaid));
    setBillingCycleDays(
      student.payment?.billingCycleDays ? String(student.payment.billingCycleDays) : "30",
    );
  }, [isOpen, student]);

  const handleSave = async () => {
    const payload = {
      startDate: startDate || null,
      amount: amount.trim() === "" ? null : Number(amount),
      paymentDate: paymentDate || null,
      isPaid,
      billingCycleDays:
        billingCycleDays.trim() === "" ? 30 : Number(billingCycleDays),
    };

    const result = await dispatch(
      updateStudentPayment({ id: student._id, payment: payload }),
    );

    if (updateStudentPayment.fulfilled.match(result)) {
      toast.success("Pago actualizado correctamente");
      dispatch(fetchPaymentsSummary());
      setIsOpen(false);
    } else {
      toast.error((result.payload as string) || "Error al actualizar pago");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Pencil className="h-4 w-4 mr-2" />
          Editar
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Editar pago</DialogTitle>
          <DialogDescription>
            {student.name} {student.lastName}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor={`start-date-${student._id}`}>Fecha de inicio</Label>
            <Input
              id={`start-date-${student._id}`}
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor={`amount-${student._id}`}>Monto</Label>
            <Input
              id={`amount-${student._id}`}
              type="number"
              min={0}
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Ej: 35000"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor={`payment-date-${student._id}`}>Fecha de pago</Label>
            <Input
              id={`payment-date-${student._id}`}
              type="date"
              value={paymentDate}
              onChange={(e) => setPaymentDate(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3">
            <Checkbox
              id={`is-paid-${student._id}`}
              checked={isPaid}
              onCheckedChange={(value) => setIsPaid(!!value)}
            />
            <Label htmlFor={`is-paid-${student._id}`}>Pago realizado</Label>
          </div>

          <div className="grid gap-2">
            <Label htmlFor={`billing-cycle-${student._id}`}>
              Ciclo de pago (días)
            </Label>
            <Input
              id={`billing-cycle-${student._id}`}
              type="number"
              min={1}
              max={365}
              value={billingCycleDays}
              onChange={(e) => setBillingCycleDays(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            onClick={handleSave}
            disabled={isUpdatingLoading}
          >
            {isUpdatingLoading ? "Guardando..." : "Guardar cambios"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ReminderActions({ student }: { student: IStudentPayment }) {
  const dispatch = useAppDispatch();
  const status = student.paymentStatus?.status ?? "sin_configurar";
  const canSendReminder = status === "vence" || status === "vencido";
  const hasWhatsappPhone = Boolean(normalizeWhatsappPhone(student.phone));

  const handleReminder = async (channel: "email" | "whatsapp") => {
    const targetUrl =
      channel === "whatsapp" ? buildWhatsappLink(student) : buildMailtoLink(student);

    if (!targetUrl) {
      toast.error("Este alumno no tiene teléfono cargado para WhatsApp");
      return;
    }

    const trackingResult = await dispatch(
      sendPaymentReminder({ id: student._id, channel }),
    );

    if (sendPaymentReminder.rejected.match(trackingResult)) {
      toast.error((trackingResult.payload as string) || "No se pudo registrar el recordatorio");
      return;
    }

    window.open(targetUrl, "_blank", "noopener,noreferrer");
    toast.success(`Recordatorio por ${channel === "whatsapp" ? "WhatsApp" : "email"} listo`);
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        size="sm"
        variant="secondary"
        onClick={() => handleReminder("whatsapp")}
        disabled={!canSendReminder || !hasWhatsappPhone}
      >
        <MessageCircle className="h-4 w-4 mr-1" />
        WhatsApp
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={() => handleReminder("email")}
        disabled={!canSendReminder}
      >
        <Mail className="h-4 w-4 mr-1" />
        Email
      </Button>
    </div>
  );
}

export const GetAllPayments = () => {
  const dispatch = useAppDispatch();
  const { user, isCheckingAuth } = useAppSelector((state) => state.auth);
  const { students, summary, isFetchingLoading, isError, message } = useAppSelector(
    (state) => state.payment,
  );

  useEffect(() => {
    if (isCheckingAuth || !user) return;
    void Promise.all([
      dispatch(fetchStudentPayments()),
      dispatch(fetchPaymentsSummary()),
      dispatch(fetchStudentsProgressSummary()),
    ]);
  }, [dispatch, isCheckingAuth, user]);

  const columns = useMemo<ColumnDef<IStudentPayment>[]>(
    () => [
      {
        accessorKey: "name",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Alumno <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <span className="font-medium">
            {row.original.name} {row.original.lastName}
          </span>
        ),
      },
      {
        accessorKey: "email",
        header: "Email",
      },
      {
        accessorKey: "phone",
        header: "WhatsApp",
        cell: ({ row }) => row.original.phone || "-",
      },
      {
        id: "startDate",
        header: "Fecha inicio",
        cell: ({ row }) => formatDate(row.original.payment?.startDate),
      },
      {
        id: "amount",
        header: "Monto",
        cell: ({ row }) => {
          const amount = row.original.payment?.amount;
          if (amount === null || amount === undefined) return "-";
          return currencyFormatter.format(amount);
        },
      },
      {
        id: "nextDueDate",
        header: "Próximo vencimiento",
        cell: ({ row }) => formatDate(row.original.paymentStatus?.nextDueDate),
      },
      {
        id: "progressEntries",
        header: "Entrenamientos cargados",
        cell: ({ row }) => row.original.progressSummary?.totalEntries ?? 0,
      },
      {
        id: "lastProgressDate",
        header: "Ult. progreso",
        cell: ({ row }) =>
          formatDate(row.original.progressSummary?.lastEntryDate || null),
      },
      {
        id: "trafficStatus",
        header: "Semáforo",
        cell: ({ row }) => {
          const status = row.original.paymentStatus?.status ?? "sin_configurar";
          const data = paymentStatusMap[status];
          return (
            <Badge className={data.className}>{data.label}</Badge>
          );
        },
      },
      {
        id: "daysUntilDue",
        header: "Días al venc.",
        cell: ({ row }) => {
          const days = row.original.paymentStatus?.daysUntilDue;
          if (days === null || days === undefined) return "-";
          return days <= 0 ? `Vencido` : `${days} días`;
        },
      },
      {
        id: "lastReminder",
        header: "Últ. recordatorio",
        cell: ({ row }) => {
          const reminderAt = row.original.payment?.lastReminderAt;
          const channel = row.original.payment?.lastReminderChannel;
          if (!reminderAt) return "-";
          const channelLabel =
            channel === "whatsapp"
              ? "WhatsApp"
              : channel === "email"
                ? "Email"
                : "Canal";
          return `${channelLabel} · ${dateFormatter.format(new Date(reminderAt))}`;
        },
      },
      {
        id: "actions",
        header: "Acciones",
        cell: ({ row }) => (
          <div className="flex flex-wrap gap-2">
            <UpdatePaymentDialog student={row.original} />
            <ReminderActions student={row.original} />
          </div>
        ),
      },
    ],
    [],
  );

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [globalFilter, setGlobalFilter] = useState("");

  const table = useReactTable({
    data: students,
    columns,
    state: { sorting, columnFilters, columnVisibility, globalFilter },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: (row, _, filterValue: string) => {
      const search = filterValue.toLowerCase();
      const fullName = `${row.original.name} ${row.original.lastName}`.toLowerCase();
      const email = (row.original.email || "").toLowerCase();
      const phone = (row.original.phone || "").toLowerCase();
      return fullName.includes(search) || email.includes(search) || phone.includes(search);
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  if (isFetchingLoading && students.length === 0) {
    return <SpinnerButton variant="sizes" />;
  }

  if (isError && students.length === 0) {
    return (
      <PremiumErrorState
        title="No se pudo cargar pagos"
        description={message || "Ocurrió un error al obtener la sección de pagos."}
        tone="default"
        retryLabel="Reintentar"
        onRetry={() => {
          void Promise.all([
            dispatch(fetchStudentPayments()),
            dispatch(fetchPaymentsSummary()),
            dispatch(fetchStudentsProgressSummary()),
          ]);
        }}
      />
    );
  }

  const paymentMetrics = [
    {
      label: "Pagos cobrados",
      value: summary?.paidStudents ?? 0,
      helper: currencyFormatter.format(summary?.collectedAmount ?? 0),
      icon: CircleDollarSign,
      tone: "positive" as const,
    },
    {
      label: "Vence pronto",
      value: summary?.dueSoonStudents ?? 0,
      helper: "Proximos 3 dias",
      icon: Hourglass,
      tone: "warning" as const,
    },
    {
      label: "Vencidos",
      value: summary?.overdueStudents ?? 0,
      helper: `Pendiente: ${currencyFormatter.format(summary?.pendingAmount ?? 0)}`,
      icon: Wallet,
      tone: "danger" as const,
    },
    {
      label: "Total estimado mensual",
      value: currencyFormatter.format(summary?.totalAmount ?? 0),
      helper: `Alumnos: ${summary?.totalStudents ?? 0}`,
      icon: ArrowUpDown,
      tone: "default" as const,
    },
  ];

  return (
    <div className="w-full space-y-4">
      <PageHero
        icon={Wallet}
        title="Gestión de Pagos"
        description="Visualiza estado financiero, vencimientos y recordatorios en una vista operativa para sostener ingresos y adherencia."
        badge={`${students.length} alumnos`}
        chips={["Cobranza Activa", "Seguimiento Diario", "Control de Riesgo"]}
      />

      <MetricStrip items={paymentMetrics} />

      <PremiumTableShell
        searchPlaceholder="Filtrar por nombre, email o telefono..."
        searchValue={(table.getState().globalFilter as string) ?? ""}
        onSearchChange={(value) => table.setGlobalFilter(value)}
        actions={<DataTableViewOptions table={table} />}
      >
        <div className="overflow-hidden rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No hay estudiantes con rol student para mostrar.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <DataTablePagination table={table} />
      </PremiumTableShell>
    </div>
  );
};
