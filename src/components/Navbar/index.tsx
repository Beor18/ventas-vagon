import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";

const Navbar = () => {
  const { data: session, status }: any = useSession();

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div>
          <Link className="text-white font-bold text-xl" href="/">
            Home
          </Link>
        </div>
        <div className="flex space-x-4 items-center">
          {status === "authenticated" ? (
            <>
              <span className="text-white">Hello, {session.user.email}</span>
              <button
                onClick={() => signOut()}
                className="text-white bg-red-500 px-3 py-2 rounded-md"
              >
                Logout
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

              <Link
                className="text-white bg-green-500 px-3 py-2 rounded-md"
                href="/register"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;