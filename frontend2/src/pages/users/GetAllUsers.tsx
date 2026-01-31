import { useAppSelector, useAppDispatch } from "@/app/reduxHooks";
import { getAllUsers, selectAllUsers } from "@/features/users/userSlice"; // Asegúrate de exportar selectAllUsers del slice
import { useEffect } from "react";
import { SpinnerButton } from "@/components/spinner/Spinner";
import { Input } from "@/components/ui/input"; // Faltaba importar Input

// Importamos nuestros nuevos hooks y componentes de usuario
import { useUserTable } from "./Table/useUserTable"; 
import { UserTable } from "./Table/UserTable";
import { DataTableViewOptions } from "../../components/exercises/table/DataTableViewOptions"; // Puedes reutilizar este si es genérico

export const GetAllUsers = () => {
  const dispatch = useAppDispatch();
  
  // 1. Usamos el selector correcto para obtener los usuarios
  const users = useAppSelector(selectAllUsers); 
  const { isLoading } = useAppSelector((state) => state.user);

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  // 2. Inicializamos la tabla con los usuarios (evitamos undefined pasando array vacío)
  const { table } = useUserTable(users || []);

  if (isLoading) return <SpinnerButton variant="sizes" />;

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between py-4">
        {/* FILTRO: Cambiado a 'email' o 'name' según tus columnas */}
        <Input
          placeholder="Filtrar por email..."
          value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
          onChange={(e) =>
            table.getColumn("email")?.setFilterValue(e.target.value)
          }
          className="max-w-sm"
        />
        
        <div className="flex items-center space-x-2">
           {/* Si tienes un componente para Crear Usuario, va aquí. 
               Si no, quita ExerciseButton para que no confunda */}
           {/* <CreateUserButton /> */} 
           
          <DataTableViewOptions table={table} />
        </div>
      </div>

      {/* TABLA: Pasamos la instancia de la tabla */}
      <UserTable table={table} />
    </div>
  );
};