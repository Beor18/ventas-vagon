import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";

const Navbar = () => {
  const { data: session, status }: any = useSession();

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2 gap-4">
          <Image
            src="/vagon_5_Transparent.png"
            alt="Logo"
            width={77}
            height={0}
          />
          {/* <Link className="text-white font-bold text-xl" href="/">
            Home
          </Link> */}
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
                    href="/registro"
                  >
                    Registrar Usuarios
                  </Link>
                </>
              )}
              <span className="text-white">Hello, {session.user.email}</span>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  signOut({
                    redirect: true,
                    callbackUrl: process.env.NEXT_PUBLIC_FRONTEND_BASE_URL,
                  });
                }}
                className="text-white bg-red-500 px-3 py-2 rounded-md"
              >
                <a
                  style={{ textDecoration: "none", color: "#fff" }}
                  href={`/api/auth/signout`}
                >
                  Logout
                </a>
              </button>
            </>
          ) : (
            <>
              <Link
                className="text-white bg-blue-500 px-3 py-2 rounded-md"
                href="/login"
              >
                Login
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
