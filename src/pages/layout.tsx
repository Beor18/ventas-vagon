import React, { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Toaster } from "@/components/ui/toaster";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Menu,
  Home,
  ShoppingCart,
  Users,
  Settings,
  HelpCircle,
  LogOut,
} from "lucide-react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { data: session, status }: any = useSession();
  const pathname = usePathname();

  const navItems = [
    { icon: Home, label: "Inicio", href: "/admin" },
    // { icon: ShoppingCart, label: "Productos", href: "/products" },
    // { icon: Users, label: "Clientes", href: "/clients" },
    // { icon: Settings, label: "Configuración", href: "/settings" },
    // { icon: HelpCircle, label: "Ayuda", href: "/help" },
  ];

  const Sidebar = () => (
    <aside className="w-64 bg-gray-900 text-white h-full overflow-y-auto">
      <div className="p-4">
        <div className="pl-4">
          <Image
            src="/vagon_5_Transparent.png"
            alt="Logo"
            width={50}
            height={50}
            className="mb-8"
          />
        </div>
        <nav className="flex flex-col gap-2 space-y-2">
          {status === "authenticated" && (
            <>
              {session?.user.role === "Vendedor" && (
                // <NavLink href="/seller">Productos</NavLink>
                <Link key="/seller" href="/seller">
                  <Button
                    variant="ghost"
                    className={`w-full justify-start text-white hover:bg-gray-800 ${
                      pathname === "/seller" ? "bg-gray-800" : ""
                    }`}
                  >
                    Productos
                  </Button>
                </Link>
              )}
              {session?.user.role === "Fabricante" && (
                // <NavLink href="/manufacture">Fabricante</NavLink>
                <Link key="/manufacture" href="/manufacture">
                  <Button
                    variant="ghost"
                    className={`w-full justify-start text-white hover:bg-gray-800 ${
                      pathname === "/manufacture" ? "bg-gray-800" : ""
                    }`}
                  >
                    Fabricante
                  </Button>
                </Link>
              )}
              {session?.user.role === "Administrador" && (
                <>
                  <Link key="/admin" href="/admin">
                    <Button
                      variant="ghost"
                      className={`w-full justify-start text-white hover:bg-gray-800 ${
                        pathname === "/admin" ? "bg-gray-800" : ""
                      }`}
                    >
                      Administrador
                    </Button>
                  </Link>
                  <Link key="/gallery" href="/gallery">
                    <Button
                      variant="ghost"
                      className={`w-full justify-start text-white hover:bg-gray-800 ${
                        pathname === "/gallery" ? "bg-gray-800" : ""
                      }`}
                    >
                      Subir Imagenes / Galeria
                    </Button>
                  </Link>
                  <Link key="/register" href="/register">
                    <Button
                      variant="ghost"
                      className={`w-full justify-start text-white hover:bg-gray-800 ${
                        pathname === "/register" ? "bg-gray-800" : ""
                      }`}
                    >
                      Registrar usuario
                    </Button>
                  </Link>
                </>
              )}
            </>
          )}
        </nav>
      </div>
    </aside>
  );

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-gray-900 shadow-sm z-10">
          <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex items-center lg:hidden">
                  <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
                    <SheetTrigger asChild>
                      <Button variant="default" size="icon">
                        <Menu className="h-6 w-6" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 w-64 bg-gray-900">
                      <Sidebar />
                    </SheetContent>
                  </Sheet>
                </div>
              </div>
              <div className="flex items-center">
                {session?.user && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="relative h-8 w-8 rounded-full"
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={session.user.image || undefined}
                            alt={session.user.name || "User"}
                          />
                          <AvatarFallback>
                            {session.user.name?.[0] || "U"}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="w-56"
                      align="end"
                      forceMount
                    >
                      <DropdownMenuItem className="font-normal">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {session.user.name}
                          </p>
                          <p className="text-xs leading-none text-muted-foreground">
                            {session.user.email}
                          </p>
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          signOut({
                            callbackUrl:
                              process.env.NEXT_PUBLIC_FRONTEND_BASE_URL,
                          })
                        }
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Cerrar Sesión</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-2 sm:px-2 lg:px-2 py-2">
            {children}
            <Toaster />
          </div>
        </main>
      </div>
    </div>
  );
}
