import { Outlet } from "react-router-dom";
// import { Footer } from "../footer/Footer";
import Sidebar from "../../private/sidebar/SideBar";
import { ThemeProvider } from "../../public/themeProvider/ThemeProvider";

const MainLayout = () => {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <div className="flex min-h-screen w-full bg-background text-foreground">
        <Sidebar>
          <main className="flex-1 px-4 py-6">
            <Outlet />
          </main>
        </Sidebar>
      </div>
    </ThemeProvider>
  );
};

export default MainLayout;
