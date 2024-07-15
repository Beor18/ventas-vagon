import { useSession, signIn } from "next-auth/react";
import { useEffect } from "react";

const withAuth = (
  WrappedComponent: React.ComponentType<any>,
  allowedRoles: string[]
) => {
  const ComponentWithAuth = (props: any) => {
    const { data: session, status }: any = useSession();

    useEffect(() => {
      if (status === "loading") return;
      if (!session) {
        signIn();
      } else if (!allowedRoles.includes(session.user.role)) {
        window.location.href = "/unauthorized";
      }
    }, [session, status]);

    if (
      status === "loading" ||
      !session ||
      !allowedRoles.includes(session.user.role)
    ) {
      return <p>Loading...</p>;
    }

    return <WrappedComponent {...props} />;
  };

  ComponentWithAuth.displayName = `WithAuth(${getDisplayName(
    WrappedComponent
  )})`;

  return ComponentWithAuth;
};

const getDisplayName = (WrappedComponent: React.ComponentType<any>) => {
  return WrappedComponent.displayName || WrappedComponent.name || "Component";
};

export default withAuth;
