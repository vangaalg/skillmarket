import { IconUsers } from "@/components/icons";

export default function TeamPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-coral/20 bg-coral-50 px-3 py-1 text-[12px] font-semibold uppercase tracking-widest text-coral-600">
        <IconUsers size={11} strokeWidth={2} />
        Phase 5 · Coming soon
      </div>
      <h1 className="headline text-ink mt-2">Team workspaces</h1>
      <p className="mt-3 text-[15px] text-ink-600">
        Shared skills, shared sessions, and admin/member roles. Backed by the{" "}
        <code className="bg-cream-200 px-1.5 py-0.5 rounded text-[13px]">teams</code> and{" "}
        <code className="bg-cream-200 px-1.5 py-0.5 rounded text-[13px]">team_members</code> tables.
      </p>
    </div>
  );
}
