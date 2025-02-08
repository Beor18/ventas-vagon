"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import {
  Menu,
  X,
  ChevronDown,
  User,
  LogOut,
  Home,
  Settings,
  Package,
  Users,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Navbar = () => {
  const { data: session, status }: any = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const NavLink = ({
    href,
    children,
    icon: Icon,
  }: {
    href: string;
    children: React.ReactNode;
    icon?: any;
  }) => (
    <Link href={href} passHref>
      <Button
        variant="ghost"
        className="w-full justify-start gap-2 text-muted-foreground hover:text-primary hover:bg-muted"
      >
        {Icon && <Icon className="h-4 w-4" />}
        {children}
      </Button>
    </Link>
  );

  const navigationItems = [
    { name: "Inicio", href: "/", icon: Home },
    { name: "Administración", href: "/admin", icon: Settings },
    { name: "Productos", href: "/products", icon: Package },
    { name: "Clientes", href: "/clients", icon: Users },
    { name: "Órdenes", href: "/orders", icon: FileText },
  ];

  return (
    <nav className="bg-background border-b">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo y navegación desktop */}
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <Image
                src="/logo.png"
                alt="Logo"
                width={40}
                height={40}
                className="rounded-full"
              />
            </Link>
            <div className="hidden md:ml-6 md:flex md:space-x-2">
              {navigationItems.map((item) => (
                <NavLink key={item.name} href={item.href} icon={item.icon}>
                  {item.name}
                </NavLink>
              ))}
            </div>
          </div>

          {/* Menú de usuario */}
          <div className="flex items-center gap-4">
            {session ? (
              <>
                <span className="hidden md:block text-sm text-muted-foreground">
                  {session.user.email}
                </span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-8 w-8 rounded-full"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={session.user.image || ""}
                          alt={session.user.email}
                        />
                        <AvatarFallback>
                          {session.user.email?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => signOut()}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Cerrar Sesión</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <NavLink href="/login">Iniciar Sesión</NavLink>
            )}

            {/* Menú móvil */}
            <div className="flex md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right">
                  <SheetHeader>
                    <SheetTitle>Menú</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6 flex flex-col space-y-2">
                    {navigationItems.map((item) => (
                      <NavLink
                        key={item.name}
                        href={item.href}
                        icon={item.icon}
                      >
                        {item.name}
                      </NavLink>
                    ))}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
