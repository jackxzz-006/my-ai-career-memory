import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { adminListUsers, adminSetUserRole } from "@/lib/roles.functions";
import { ROLE_META } from "@/lib/role-content";

const ROLES = ["student", "job_seeker", "mentor", "admin"] as const;

export const Route = createFileRoute("/_authenticated/_admin/admin")({
  head: () => ({ meta: [{ title: "Admin — CareerTwin AI" }] }),
  component: AdminUsersPage,
});

function AdminUsersPage() {
  const qc = useQueryClient();
  const list = useServerFn(adminListUsers);
  const setRole = useServerFn(adminSetUserRole);

  const q = useQuery({ queryKey: ["admin-users"], queryFn: () => list() });

  const mut = useMutation({
    mutationFn: (v: { userId: string; role: (typeof ROLES)[number] }) =>
      setRole({ data: v }),
    onSuccess: () => {
      toast.success("Role updated");
      qc.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="relative min-h-screen bg-[#050505] text-white">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <Link to="/dashboard" className="text-xs text-soft-gray hover:text-white">← Dashboard</Link>
        <h1 className="mt-4 font-display text-3xl font-semibold">Admin — Users</h1>
        <p className="mt-2 text-sm text-soft-gray">
          Change any user's role, or drill in to see their progress.
        </p>

        <div className="mt-8 overflow-hidden rounded-3xl border border-white/10">
          <table className="w-full text-sm">
            <thead className="bg-white/[0.03] text-xs uppercase tracking-widest text-soft-gray">
              <tr>
                <th className="px-4 py-3 text-left">User</th>
                <th className="px-4 py-3 text-left">XP</th>
                <th className="px-4 py-3 text-left">Role</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {q.data?.map((u) => (
                <tr key={u.id} className="border-t border-white/5">
                  <td className="px-4 py-3">
                    <p className="font-medium">{u.display_name || u.username}</p>
                    <p className="text-[10px] text-soft-gray">{u.id}</p>
                  </td>
                  <td className="px-4 py-3">{u.xp}</td>
                  <td className="px-4 py-3">
                    <select
                      value={u.primary_role ?? ""}
                      onChange={(e) =>
                        mut.mutate({
                          userId: u.id,
                          role: e.target.value as (typeof ROLES)[number],
                        })
                      }
                      className="rounded-lg border border-white/10 bg-black/40 px-3 py-1.5 text-xs"
                    >
                      <option value="" disabled>—</option>
                      {ROLES.map((r) => (
                        <option key={r} value={r}>
                          {ROLE_META[r].label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      to="/admin/users/$userId"
                      params={{ userId: u.id }}
                      className="rounded-full border border-white/10 px-3 py-1 text-xs hover:border-white/30"
                    >
                      View progress
                    </Link>
                  </td>
                </tr>
              ))}
              {q.isLoading && (
                <tr><td colSpan={4} className="px-4 py-6 text-center text-soft-gray">Loading…</td></tr>
              )}
              {q.data?.length === 0 && (
                <tr><td colSpan={4} className="px-4 py-6 text-center text-soft-gray">No users yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
