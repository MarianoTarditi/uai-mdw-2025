"use client";

import { Button } from "@/components/ui/button";
import * as React from "react";
import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Settings2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataTablePagination } from "../../components/exercises/table/DataTablePagination";
import { DataTableViewOptions } from "../../components/exercises/table/DataTableViewOptions";
import { useAppSelector, useAppDispatch } from "@/app/reduxHooks";
import { Center, Loader } from "@mantine/core";
import { getAllExercises } from "@/features/exercises/exerciseSlice";
import { UpdateExercise } from "@/components/exercises/UpdateExercise";
import { AddExercise } from "@/components/exercises/CreateExercise";
import { DeleteExercise } from "@/components/exercises/DeleteExercise";
import { DetailExercise } from "@/components/exercises/DetailExercise";
import type { IExercise } from "@/types/auth";

export function GetAllExercises() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [isOpenAdd, setIsOpenAdd] = React.useState(false);

  const dispatch = useAppDispatch();
  const { exercises, isFetchingLoading } = useAppSelector(
    (state) => state.exercise
  );

  React.useEffect(() => {
    dispatch(getAllExercises());
  }, [dispatch]);

  // ✅ Declaramos las columnas dentro del componente y las memorizamos
  const columns = React.useMemo<ColumnDef<IExercise>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "name",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name <ArrowUpDown />
          </Button>
        ),
      },
      {
        accessorKey: "muscleGroup",
        header: "Muscle Group",
      },
      {
        accessorKey: "description",
        header: "Description",
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const exercise = row.original;
          const [isEditOpen, setIsEditOpen] = React.useState(false);
          const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);
          const [isDetailOpen, setIsDetailOpen] = React.useState(false);

          return (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <MoreHorizontal />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setIsDetailOpen(true)}>
                    View Detail
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setIsEditOpen(true)}>
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setIsDeleteOpen(true)}>
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Modal de ver detalle */}
              <DetailExercise
                exercise={exercise}
                isOpen={isDetailOpen}
                setIsOpen={setIsDetailOpen}
              />

              {/* Modal de edición */}
              <UpdateExercise
                exercise={exercise}
                isOpen={isEditOpen}
                setIsOpen={setIsEditOpen}
              />

              {/* Modal de eliminación */}
              <DeleteExercise
                exercise={exercise}
                isOpen={isDeleteOpen}
                setIsOpen={setIsDeleteOpen}
              />
            </>
          );
        },
      },
    ],
    []
  );

  const table = useReactTable({
    data: exercises,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: { sorting, columnFilters, columnVisibility, rowSelection },
  });

  // Callback cuando se agrega un ejercicio
  const handleAddExercise = () => {
    setIsOpenAdd(false);
  };

  if (isFetchingLoading) {
    return (
      <Center style={{ width: "100%", height: "100%" }}>
        <Loader />
      </Center>
    );
  }

  return (
    <div className="w-full">
      {/* Filtro y opciones */}
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter by name..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />

        <Button
          onClick={() => setIsOpenAdd(true)}
          variant="outline"
          size="sm"
          className="ml-auto hidden h-8 lg:flex"
        >
          <Settings2 className="mr-2 h-4 w-4" />
          Create
        </Button>

        <DataTableViewOptions table={table} />
      </div>

      {/* Modal de creación */}
      <AddExercise
        isOpen={isOpenAdd}
        setIsOpen={setIsOpenAdd}
        onSubmit={handleAddExercise}
      />

      {/* Tabla */}
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
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <DataTablePagination table={table} />
    </div>
  );
}
