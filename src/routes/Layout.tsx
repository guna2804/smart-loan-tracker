import { SidebarProvider, Sidebar, SidebarTrigger } from "../components/ui/sidebar";
import SidebarMenu from "../components/Sidebar";


const Layout = ({ children }: { children: React.ReactNode }) => (
  <SidebarProvider>
    <div className="w-screen flex min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <Sidebar>
  <SidebarMenu />
      </Sidebar>
      <div className="flex-1">
        {/* Navbar */}
        <nav className="flex items-center h-16 px-6 bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-20 transition-all duration-300">
          <SidebarTrigger className="mr-4 transition-all duration-300" />
          <span className="text-2xl font-bold text-gray-800 tracking-tight select-none">Moneyboard</span>
        </nav>
        {/* Main Content */}
        {children}
      </div>
    </div>
  </SidebarProvider>
);

export default Layout;
