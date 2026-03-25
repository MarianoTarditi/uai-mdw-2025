import { Outlet } from "react-router-dom";
import Sidebar from "../../private/sidebar/SideBar";
import { ThemeProvider } from "../../public/themeProvider/ThemeProvider";
import "@/styles/private-premium.css";

const MainLayout = () => {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <div className="fit-premium flex min-h-screen w-full text-foreground">
        <Sidebar>
          <main className="premium-main flex-1">
            <Outlet />
          </main>
        </Sidebar>
      </div>
    </ThemeProvider>
  );
};

export default MainLayout;
