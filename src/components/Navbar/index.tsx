"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const { data: session, status }: any = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const NavLink = ({
    href,
    children,
  }: {
    href: string;
    children: React.ReactNode;
  }) => (
    <Link href={href} passHref>
      <Button
        variant="ghost"
        className="text-white hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
      >
        {children}
      </Button>
    </Link>
  );

  return (
    <nav className="bg-gray-800">
      <div className="container mx-auto px-2 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-20">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <Button
              variant="ghost"
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </Button>
          </div>
          <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex-shrink-0 flex items-center">
              <Image
                src="/vagon_5_Transparent.png"
                alt="Logo"
                width={77}
                height={140}
                className="block h-8 w-auto"
              />
            </div>
            <div className="hidden sm:block sm:ml-6">
              <div className="flex space-x-4">
                {status === "authenticated" && (
                  <>
                    {session?.user.role === "Vendedor" && (
                      <NavLink href="/seller">Productos</NavLink>
                    )}
                    {session?.user.role === "Fabricante" && (
                      <NavLink href="/manufacture">Fabricante</NavLink>
                    )}
                    {session?.user.role === "Administrador" && (
                      <>
                        <NavLink href="/admin">Administrador</NavLink>
                        <NavLink href="/gallery">
                          Subir Imagenes / Galeria
                        </NavLink>
                        <NavLink href="/register">Registrar Usuarios</NavLink>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            {status === "authenticated" ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="text-sm text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md font-medium"
                  >
                    <Image
                      src="/avatar_placeholder.png"
                      alt="Avatar"
                      width={32}
                      height={32}
                      className="rounded-full mr-2"
                    />
                    <span className="hidden md:inline">Mi Cuenta</span>
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <span className="font-medium">
                      Hola, {session.user.email}
                    </span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      signOut({
                        callbackUrl: process.env.NEXT_PUBLIC_FRONTEND_BASE_URL,
                      })
                    }
                  >
                    Salir
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <NavLink href="/login">Login</NavLink>
            )}
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="sm:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {status === "authenticated" ? (
              <>
                {session?.user.role === "Vendedor" && (
                  <NavLink href="/seller">Productos</NavLink>
                )}
                {session?.user.role === "Fabricante" && (
                  <NavLink href="/manufacture">Fabricante</NavLink>
                )}
                {session?.user.role === "Administrador" && (
                  <>
                    <NavLink href="/admin">Administrador</NavLink>
                    <NavLink href="/gallery">Subir Imagenes / Galeria</NavLink>
                    <NavLink href="/register">Registrar Usuarios</NavLink>
                  </>
                )}
                <div className="pt-4 pb-3 border-t border-gray-700">
                  <div className="flex items-center px-5">
                    <div className="flex-shrink-0">
                      <Image
                        src="/avatar_placeholder.png"
                        alt="Avatar"
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium leading-none text-white">
                        {session.user.email}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 px-2 space-y-1">
                    <Button
                      variant="ghost"
                      className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700"
                      onClick={() =>
                        signOut({
                          callbackUrl:
                            process.env.NEXT_PUBLIC_FRONTEND_BASE_URL,
                        })
                      }
                    >
                      Salir
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <NavLink href="/login">Login</NavLink>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
