import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

const Navbar = () => {
  const { data: session, status }: any = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2 gap-4">
          <Image
            src="/vagon_5_Transparent.png"
            alt="Logo"
            width={77}
            height={40}
          />
        </div>
        <div className="flex space-x-4 items-center">
          {status === "authenticated" ? (
            <>
              {session?.user.role === "Vendedor" && (
                <Link
                  className="text-white bg-blue-500 px-3 py-2 rounded-md"
                  href="/seller"
                >
                  Productos
                </Link>
              )}
              {session?.user.role === "Fabricante" && (
                <Link
                  className="text-white bg-blue-500 px-3 py-2 rounded-md"
                  href="/manufacture"
                >
                  Fabricante
                </Link>
              )}
              {session?.user.role === "Administrador" && (
                <>
                  <Link
                    className="text-white bg-blue-500 px-3 py-2 rounded-md"
                    href="/admin"
                  >
                    Administrador
                  </Link>
                  <Link
                    className="text-white bg-blue-500 px-3 py-2 rounded-md"
                    href="/register"
                  >
                    Registrar Usuarios
                  </Link>
                </>
              )}
              <div className="relative">
                <button
                  onClick={toggleDropdown}
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  <Image
                    src="/avatar_placeholder.png"
                    alt="Avatar"
                    width={45}
                    height={0}
                    className="rounded-full"
                  />
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-auto bg-white rounded-md shadow-lg py-2 z-20">
                    <span className="block font-bold px-4 py-2 text-gray-800">
                      Hola, {session.user.email}
                    </span>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        signOut({
                          redirect: true,
                          callbackUrl:
                            process.env.NEXT_PUBLIC_FRONTEND_BASE_URL,
                        });
                      }}
                      className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                    >
                      Salir
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <Link
              className="text-white bg-blue-500 px-3 py-2 rounded-md"
              href="/login"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
