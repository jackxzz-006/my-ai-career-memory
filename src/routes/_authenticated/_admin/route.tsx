import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { checkAmAdmin } from "@/lib/roles.functions";

export const Route = createFileRoute("/_authenticated/_admin")({
  ssr: false,
  beforeLoad: async () => {
    const res = await checkAmAdmin();
    if (!res.isAdmin) throw redirect({ to: "/dashboard" });
  },
  component: () => <Outlet />,
});
