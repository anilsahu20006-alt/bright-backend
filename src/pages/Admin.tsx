import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useEffect, useMemo, useState } from "react";
import {
  Download, Search, Trash2, Lock, ShieldCheck, RefreshCw, FileText,
  CheckCircle2, Clock, XCircle, Loader2, Eye, X, Plus, Image as ImageIcon,
  LayoutDashboard, Package, Upload, Pencil,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  listApplications, updateApplicationStatus, deleteApplication, type AppRow,
  listServices, createService, updateService, deleteService, uploadServiceImage, type SvcRow,
} from "@/lib/data";

const ADMIN_PASS = "Anilsahu@8480"; // demo only — front-end gate
const STATUSES: AppRow["status"][] = ["Submitted", "Processing", "Approved", "Rejected"];

const Admin = () => {
  const [authed, setAuthed] = useState(false);
  const [pass, setPass] = useState("");
  const [tab, setTab] = useState<"apps" | "services">("apps");

  useEffect(() => {
    if (sessionStorage.getItem("ds_admin") === "1") setAuthed(true);
  }, []);

  if (!authed) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container py-16 max-w-md">
          <div className="rounded-2xl border border-border bg-card shadow-card p-8">
            <div className="h-12 w-12 rounded-full bg-saffron/10 grid place-items-center mb-4">
              <Lock className="h-6 w-6 text-saffron" />
            </div>
            <h1 className="text-2xl font-bold text-ink">Admin Login</h1>
            <p className="text-sm text-muted-foreground mt-1">Restricted area. Enter the admin password.</p>
            <input type="password" value={pass} onChange={(e) => setPass(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") {
                if (pass === ADMIN_PASS) { sessionStorage.setItem("ds_admin", "1"); setAuthed(true); }
                else toast({ title: "Wrong password", variant: "destructive" });
              }}}
              placeholder="Password"
              className="mt-4 w-full rounded-md border border-border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-saffron" />
            <button onClick={() => {
              if (pass === ADMIN_PASS) { sessionStorage.setItem("ds_admin", "1"); setAuthed(true); }
              else toast({ title: "Wrong password", variant: "destructive" });
            }} className="mt-3 w-full rounded-md bg-deep-green text-white font-semibold py-2.5 hover:opacity-90">
              Sign In
            </button>
            
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 bg-muted/30">
      <Navbar />

      <section className="bg-gradient-flag border-b border-border">
        <div className="container py-6 flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 text-saffron text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="h-4 w-4" /> Admin Dashboard
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-ink mt-1">Control Panel</h1>
          </div>
          <button onClick={() => { sessionStorage.removeItem("ds_admin"); setAuthed(false); }}
            className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-3 py-2 text-sm font-semibold hover:bg-muted">
            Logout
          </button>
        </div>
      </section>

      <div className="container pt-4">
        <div className="inline-flex rounded-lg bg-card border border-border p-1 shadow-card">
          <button onClick={() => setTab("apps")}
            className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition ${tab === "apps" ? "bg-deep-green text-white" : "text-ink hover:bg-muted"}`}>
            <LayoutDashboard className="h-4 w-4" /> Applications
          </button>
          <button onClick={() => setTab("services")}
            className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition ${tab === "services" ? "bg-deep-green text-white" : "text-ink hover:bg-muted"}`}>
            <Package className="h-4 w-4" /> Services
          </button>
        </div>
      </div>

      {tab === "apps" ? <ApplicationsTab /> : <ServicesTab />}

      <Footer />
    </div>
  );
};

/* ============== APPLICATIONS TAB ============== */
const ApplicationsTab = () => {
  const [rows, setRows] = useState<AppRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<string>("all");
  const [view, setView] = useState<AppRow | null>(null);

  const load = async () => {
    setLoading(true);
    try { setRows(await listApplications()); }
    catch (e: any) { toast({ title: "Failed to load", description: e?.message, variant: "destructive" }); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const updateStatus = async (row: AppRow, status: AppRow["status"]) => {
    if (!row.id) return;
    try {
      await updateApplicationStatus(row.id, status);
      setRows((rs) => rs.map((r) => (r.id === row.id ? { ...r, status } : r)));
      toast({ title: "Status updated", description: `${row.appId} → ${status}` });
    } catch (e: any) { toast({ title: "Update failed", description: e?.message, variant: "destructive" }); }
  };

  const removeRow = async (row: AppRow) => {
    if (!row.id || !confirm(`Delete application ${row.appId}?`)) return;
    try {
      await deleteApplication(row.id);
      setRows((rs) => rs.filter((r) => r.id !== row.id));
      toast({ title: "Deleted", description: row.appId });
    } catch (e: any) { toast({ title: "Delete failed", description: e?.message, variant: "destructive" }); }
  };

  const filtered = useMemo(() => rows.filter((r) => {
    const matchQ = [r.appId, r.service, r.fullName, r.phone, r.email].join(" ").toLowerCase().includes(q.toLowerCase());
    const matchF = filter === "all" || r.status === filter;
    return matchQ && matchF;
  }), [rows, q, filter]);

  const stats = useMemo(() => ({
    total: rows.length,
    processing: rows.filter((r) => r.status === "Processing").length,
    approved: rows.filter((r) => r.status === "Approved").length,
    rejected: rows.filter((r) => r.status === "Rejected").length,
  }), [rows]);

  const exportCsv = () => {
    if (!filtered.length) { toast({ title: "Nothing to export" }); return; }
    const headers = ["App ID", "Service", "Full Name", "Phone", "Email", "Status", "Submitted At", "Documents"];
    const escape = (v: string) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const csv = [
      headers.join(","),
      ...filtered.map((r) => [
        r.appId, r.service, r.fullName, r.phone, r.email, r.status, r.submittedAt,
        (r.docs?.map((d: any) => `${d.label}: ${d.url}`).join(" | ")) || (r.documents?.join(" | ") ?? ""),
      ].map(escape).join(",")),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `applications-${new Date().toISOString().slice(0, 10)}.csv`; a.click();
    URL.revokeObjectURL(url);
    toast({ title: "CSV exported", description: `${filtered.length} applications` });
  };

  return (
    <>
      <section className="container py-6 grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat icon={FileText} label="Total" value={stats.total} color="text-ink bg-muted" />
        <Stat icon={Clock} label="Processing" value={stats.processing} color="text-amber-700 bg-amber-50" />
        <Stat icon={CheckCircle2} label="Approved" value={stats.approved} color="text-emerald-700 bg-emerald-50" />
        <Stat icon={XCircle} label="Rejected" value={stats.rejected} color="text-rose-700 bg-rose-50" />
      </section>

      <section className="container pb-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by ID, name, phone, service…"
            className="w-full rounded-md border border-border pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-saffron bg-card" />
        </div>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}
          className="rounded-md border border-border px-3 py-2 text-sm bg-card">
          <option value="all">All statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <button onClick={load} disabled={loading} className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-3 py-2 text-sm font-semibold hover:bg-muted disabled:opacity-60">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />} Refresh
        </button>
        <button onClick={exportCsv} className="inline-flex items-center gap-1 rounded-md bg-deep-green text-white px-3 py-2 text-sm font-semibold hover:opacity-90">
          <Download className="h-4 w-4" /> Export CSV
        </button>
      </section>

      <section className="container">
        <div className="rounded-xl border border-border bg-card shadow-card overflow-x-auto">
          <table className="w-full text-sm min-w-[900px]">
            <thead className="bg-muted text-muted-foreground text-left">
              <tr>
                <th className="px-3 py-3 font-semibold">App ID</th>
                <th className="px-3 py-3 font-semibold">Service</th>
                <th className="px-3 py-3 font-semibold">Applicant</th>
                <th className="px-3 py-3 font-semibold">Contact</th>
                <th className="px-3 py-3 font-semibold">Docs</th>
                <th className="px-3 py-3 font-semibold">Submitted</th>
                <th className="px-3 py-3 font-semibold">Status</th>
                <th className="px-3 py-3 font-semibold w-10"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} className="border-t border-border align-top">
                  <td className="px-3 py-3 font-mono text-xs">{r.appId}</td>
                  <td className="px-3 py-3 font-semibold text-ink">{r.service}</td>
                  <td className="px-3 py-3">{r.fullName}</td>
                  <td className="px-3 py-3 text-xs">
                    <div>{r.phone}</div>
                    <div className="text-muted-foreground">{r.email}</div>
                  </td>
                  <td className="px-3 py-3">
                    <button onClick={() => setView(r)}
                      className="inline-flex items-center gap-1 rounded-md border border-border bg-muted px-2 py-1 text-xs font-semibold hover:bg-saffron hover:text-white hover:border-saffron">
                      <Eye className="h-3 w-3" /> {r.docs?.length ?? r.documents?.length ?? 0}
                    </button>
                  </td>
                  <td className="px-3 py-3 text-xs text-muted-foreground">{r.submittedAt}</td>
                  <td className="px-3 py-3">
                    <select value={r.status} onChange={(e) => updateStatus(r, e.target.value as AppRow["status"])}
                      className={`rounded-md border border-border px-2 py-1 text-xs font-semibold ${
                        r.status === "Approved" ? "text-emerald-700 bg-emerald-50" :
                        r.status === "Rejected" ? "text-rose-700 bg-rose-50" :
                        r.status === "Processing" ? "text-amber-700 bg-amber-50" :
                        "text-ink bg-muted"
                      }`}>
                      {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="px-3 py-3">
                    <button onClick={() => removeRow(r)} className="text-rose-600 hover:bg-rose-50 rounded p-1.5">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {!filtered.length && (
                <tr>
                  <td colSpan={8} className="px-3 py-12 text-center text-muted-foreground">
                    {loading ? "Loading…" : "No applications yet."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {view && <DocsModal row={view} onClose={() => setView(null)} />}
    </>
  );
};

/* ============== DOCUMENTS MODAL ============== */
const DocsModal = ({ row, onClose }: { row: AppRow; onClose: () => void }) => (
  <div className="fixed inset-0 z-[100] bg-black/60 grid place-items-center p-4" onClick={onClose}>
    <div className="bg-card rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div>
          <h3 className="font-bold text-ink">Documents — {row.fullName}</h3>
          <p className="text-xs text-muted-foreground">{row.appId} · {row.service}</p>
        </div>
        <button onClick={onClose} className="rounded-full hover:bg-muted p-2"><X className="h-5 w-5" /></button>
      </div>
      <div className="p-5 overflow-y-auto">
        <div className="mb-4 rounded-lg border border-border bg-muted/40 p-3 text-xs text-muted-foreground">
          {row.docs?.length
            ? "Uploaded documents are shown below. Images open directly in this admin panel."
            : "No live document links found. If this is an old entry, ask user to submit again after this fix."}
        </div>
        {row.docs && row.docs.length ? (
          <div className="grid sm:grid-cols-2 gap-4">
            {row.docs.map((d: any, i: number) => {
              const isImg = d.type?.startsWith("image/") || d.url?.startsWith("data:image/");
              const isPdf = d.type === "application/pdf" || d.url?.startsWith("data:application/pdf");
              return (
                <div key={i} className="rounded-xl border border-border overflow-hidden bg-muted/30">
                  <div className="aspect-[4/3] bg-muted grid place-items-center overflow-hidden">
                    {isImg ? (
                      <img src={d.url} alt={d.label} className="w-full h-full object-contain" loading="lazy" />
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <FileText className="h-10 w-10" />
                        <span className="text-xs">{isPdf ? "PDF document" : "Document"}</span>
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <div className="text-xs font-bold uppercase tracking-wider text-saffron">{d.label}</div>
                    <div className="text-sm font-semibold text-ink truncate">{d.name}</div>
                    <div className="flex gap-2 mt-2">
                      <a href={d.url} target="_blank" rel="noreferrer" className="flex-1 inline-flex items-center justify-center gap-1 rounded-md bg-deep-green text-white text-xs font-semibold py-2 hover:opacity-90">
                        <Eye className="h-3 w-3" /> View
                      </a>
                      <a href={d.url} download={d.name} className="flex-1 inline-flex items-center justify-center gap-1 rounded-md border border-border text-xs font-semibold py-2 hover:bg-muted">
                        <Download className="h-3 w-3" /> Download
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : row.documents && row.documents.length ? (
          <ul className="space-y-2 text-sm">
            {row.documents.map((d: string, i: number) => <li key={i} className="rounded-md border border-border p-3 bg-muted/30">{d}</li>)}
            <p className="text-xs text-muted-foreground mt-3">⚠️ Legacy entries — file previews not available.</p>
          </ul>
        ) : (
          <p className="text-center text-muted-foreground py-12">No documents uploaded.</p>
        )}
      </div>
    </div>
  </div>
);

/* ============== SERVICES TAB ============== */
const ServicesTab = () => {
  const [rows, setRows] = useState<SvcRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const empty: Omit<SvcRow, "id"> = {
    name: "", cat: "recruitment", org: "", date: "", apps: "—", fee: "₹250",
    imageUrl: "", description: "",
  };
  const [form, setForm] = useState<Omit<SvcRow, "id">>(empty);
  const [imgFile, setImgFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try { setRows(await listServices()); }
    catch (e: any) { toast({ title: "Failed to load", description: e?.message, variant: "destructive" }); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const resetForm = () => {
    setForm(empty); setImgFile(null); setEditingId(null); setAdding(false);
  };

  const startEdit = (r: SvcRow) => {
    setEditingId(r.id!);
    setAdding(true);
    setImgFile(null);
    setForm({
      name: r.name, cat: r.cat, org: r.org, date: r.date, apps: r.apps,
      fee: r.fee, imageUrl: r.imageUrl, description: r.description || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const submit = async () => {
    if (!form.name.trim() || !form.org.trim()) {
      toast({ title: "Name and organization are required", variant: "destructive" }); return;
    }
    if (!editingId && !imgFile && !form.imageUrl) {
      toast({ title: "Please upload an image", variant: "destructive" }); return;
    }
    setSaving(true);
    try {
      let imageUrl = form.imageUrl;
      if (imgFile) imageUrl = await uploadServiceImage(imgFile);

      if (editingId) {
        const patch = { ...form, imageUrl };
        await updateService(editingId, patch);
        setRows((rs) => rs.map((r) => (r.id === editingId ? { ...r, ...patch } : r)));
        toast({ title: "Service updated", description: form.name });
      } else {
        const newId = await createService({ ...form, imageUrl });
        setRows((rs) => [{ id: newId, ...form, imageUrl }, ...rs]);
        toast({ title: "Service added", description: form.name });
      }
      resetForm();
    } catch (e: any) {
      toast({ title: "Failed", description: e?.message, variant: "destructive" });
    } finally { setSaving(false); }
  };

  const remove = async (r: SvcRow) => {
    if (!r.id || !confirm(`Delete service "${r.name}"?`)) return;
    try {
      await deleteService(r.id);
      setRows((rs) => rs.filter((x) => x.id !== r.id));
      if (editingId === r.id) resetForm();
      toast({ title: "Deleted" });
    } catch (e: any) { toast({ title: "Delete failed", description: e?.message, variant: "destructive" }); }
  };

  const previewImg = imgFile ? URL.createObjectURL(imgFile) : form.imageUrl;

  return (
    <>
      <section className="container py-6 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-ink">Manage Services</h2>
          <p className="text-xs text-muted-foreground">Add or edit service forms — changes appear instantly on the Services page.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={load} disabled={loading} className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-3 py-2 text-sm font-semibold hover:bg-muted disabled:opacity-60">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />} Refresh
          </button>
          <button onClick={() => { if (adding) resetForm(); else { setEditingId(null); setForm(empty); setImgFile(null); setAdding(true); } }}
            className="inline-flex items-center gap-1 rounded-md bg-saffron text-white px-3 py-2 text-sm font-semibold hover:opacity-90">
            <Plus className="h-4 w-4" /> {adding ? "Cancel" : "Add Service"}
          </button>
        </div>
      </section>

      {adding && (
        <section className="container pb-4">
          <div className="rounded-2xl border border-border bg-card shadow-card p-5 grid md:grid-cols-2 gap-4">
            <div className="md:col-span-2 flex items-center justify-between">
              <h3 className="font-bold text-ink">{editingId ? "Edit Service" : "New Service"}</h3>
              {editingId && <span className="text-[11px] text-muted-foreground font-mono">ID: {editingId.slice(0, 8)}…</span>}
            </div>
            <FormField label="Service Name *">
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="ipt" placeholder="e.g. SSC CGL 2026" />
            </FormField>
            <FormField label="Organization *">
              <input value={form.org} onChange={(e) => setForm({ ...form, org: e.target.value })} className="ipt" placeholder="e.g. SSC" />
            </FormField>
            <FormField label="Category">
              <select value={form.cat} onChange={(e) => setForm({ ...form, cat: e.target.value as any })} className="ipt">
                <option value="recruitment">Recruitment</option>
                <option value="admission">Admission</option>
                <option value="certificate">Certificate</option>
                <option value="identity">Identity</option>
                <option value="scholarship">Scholarship</option>
              </select>
            </FormField>
            <FormField label="Last Date">
              <input value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="ipt" placeholder="e.g. Dec 30, 2025" />
            </FormField>
            <FormField label="Applications">
              <input value={form.apps} onChange={(e) => setForm({ ...form, apps: e.target.value })} className="ipt" placeholder="e.g. 25,000" />
            </FormField>
            <FormField label="Fee">
              <input value={form.fee} onChange={(e) => setForm({ ...form, fee: e.target.value })} className="ipt" placeholder="e.g. ₹250" />
            </FormField>
            <div className="md:col-span-2">
              <FormField label="Description">
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="ipt min-h-[80px]" placeholder="Short description shown on the service page" />
              </FormField>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm block">
                <span className="text-ink font-medium">Service Image {editingId ? "(leave empty to keep current)" : "*"}</span>
                <div className="mt-2 flex items-center gap-3 flex-wrap">
                  <label className="cursor-pointer inline-flex items-center gap-1 rounded-md bg-deep-green text-white px-3 py-2 text-xs font-bold hover:opacity-90">
                    <Upload className="h-3.5 w-3.5" /> {editingId ? "Replace image" : "Choose image"}
                    <input type="file" accept="image/*" className="hidden"
                      onChange={(e) => setImgFile(e.target.files?.[0] || null)} />
                  </label>
                  {previewImg ? (
                    <div className="flex items-center gap-2 text-xs">
                      <img src={previewImg} alt="" className="h-12 w-12 rounded-md object-cover border border-border" />
                      <span className="text-muted-foreground truncate max-w-[200px]">
                        {imgFile ? imgFile.name : "Current image"}
                      </span>
                      {imgFile && (
                        <button type="button" onClick={() => setImgFile(null)}
                          className="text-rose-600 hover:underline">Clear</button>
                      )}
                    </div>
                  ) : <span className="text-xs text-muted-foreground">JPG/PNG/WebP recommended</span>}
                </div>
              </label>
            </div>
            <div className="md:col-span-2 flex justify-end gap-2">
              <button onClick={resetForm} disabled={saving}
                className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-4 py-2.5 text-sm font-semibold hover:bg-muted">
                Cancel
              </button>
              <button onClick={submit} disabled={saving}
                className="inline-flex items-center gap-2 rounded-md bg-deep-green text-white font-semibold px-5 py-2.5 hover:opacity-90 disabled:opacity-60">
                {saving ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving…</>
                  : editingId ? <><Pencil className="h-4 w-4" /> Save Changes</>
                  : <><Plus className="h-4 w-4" /> Add Service</>}
              </button>
            </div>
          </div>
        </section>
      )}

      <section className="container pb-10">
        {!rows.length && !loading ? (
          <div className="rounded-xl border border-dashed border-border bg-card p-12 text-center">
            <ImageIcon className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <h3 className="font-semibold text-ink">No custom services yet</h3>
            <p className="text-sm text-muted-foreground">Click <b>Add Service</b> to create one. Built-in services keep showing on the Services page.</p>
          </div>
        ) : (
          <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {rows.map((r) => (
              <div key={r.id} className="rounded-xl overflow-hidden border border-border bg-card shadow-card group">
                <div className="aspect-[4/3] bg-muted overflow-hidden">
                  <img src={r.imageUrl} alt={r.name} className="w-full h-full object-cover group-hover:scale-105 transition" />
                </div>
                <div className="p-3">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-saffron">{r.org}</div>
                  <h4 className="font-bold text-sm text-ink leading-snug line-clamp-2 mt-0.5">{r.name}</h4>
                  <div className="flex items-center justify-between mt-2 text-[11px] text-muted-foreground">
                    <span>{r.cat}</span><span>{r.fee}</span>
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <button onClick={() => startEdit(r)}
                      className="inline-flex items-center justify-center gap-1 rounded-md border border-border bg-muted text-ink text-xs font-semibold py-1.5 hover:bg-saffron hover:text-white hover:border-saffron">
                      <Pencil className="h-3 w-3" /> Edit
                    </button>
                    <button onClick={() => remove(r)}
                      className="inline-flex items-center justify-center gap-1 rounded-md border border-rose-200 bg-rose-50 text-rose-700 text-xs font-semibold py-1.5 hover:bg-rose-100">
                      <Trash2 className="h-3 w-3" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
};

const FormField = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <label className="text-sm block">
    <span className="text-ink font-medium">{label}</span>
    <div className="mt-1">{children}</div>
  </label>
);

const Stat = ({ icon: Icon, label, value, color }: any) => (
  <div className="rounded-xl border border-border bg-card p-4 shadow-card">
    <div className={`h-9 w-9 rounded-lg grid place-items-center ${color}`}><Icon className="h-5 w-5" /></div>
    <div className="mt-2 text-2xl font-extrabold text-ink">{value}</div>
    <div className="text-xs text-muted-foreground">{label}</div>
  </div>
);

export default Admin;
