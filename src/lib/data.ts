// Supabase data layer — drop-in replacement for the old @/lib/firebase module.
import { supabase } from "@/integrations/supabase/client";

/* ===== Types ===== */
export type AppDoc = { label: string; name: string; url: string; type: string };

export type AppRow = {
  id?: string;
  appId: string;
  service: string;
  fullName: string;
  phone: string;
  email: string;
  status: "Submitted" | "Processing" | "Approved" | "Rejected";
  submittedAt: string;
  docs?: AppDoc[];
  documents?: string[];
  user_id?: string | null;
};

export type SvcRow = {
  id?: string;
  name: string;
  cat: "recruitment" | "admission" | "certificate" | "identity" | "scholarship";
  org: string;
  date: string;
  apps: string;
  fee: string;
  imageUrl: string;
  description?: string;
};

/* ===== Helpers ===== */
function rowToApp(r: any): AppRow {
  return {
    id: r.id,
    appId: r.app_id,
    service: r.service,
    fullName: r.full_name,
    phone: r.phone,
    email: r.email,
    status: r.status,
    submittedAt: r.submitted_at,
    docs: r.docs ?? [],
    documents: r.documents ?? [],
    user_id: r.user_id ?? null,
  };
}

function appToRow(data: Omit<AppRow, "id">) {
  return {
    app_id: data.appId,
    service: data.service,
    full_name: data.fullName,
    phone: data.phone,
    email: data.email,
    status: data.status,
    submitted_at: data.submittedAt,
    docs: data.docs ?? [],
    documents: data.documents ?? [],
    user_id: data.user_id ?? (typeof window !== "undefined" ? null : null),
  };
}

/* ===== Applications ===== */
export async function createApplication(data: Omit<AppRow, "id">): Promise<string> {
  const { data: user } = await supabase.auth.getUser();
  const payload = { ...appToRow(data), user_id: user.user?.id ?? null };
  const { data: row, error } = await supabase
    .from("applications")
    .insert(payload)
    .select("id")
    .single();
  if (error) throw error;
  return row.id as string;
}

export async function listApplications(): Promise<AppRow[]> {
  const { data, error } = await supabase
    .from("applications")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data || []).map(rowToApp);
}

export async function listMyApplications(): Promise<AppRow[]> {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) return [];
  const { data, error } = await supabase
    .from("applications")
    .select("*")
    .eq("user_id", user.user.id)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data || []).map(rowToApp);
}

export async function updateApplicationStatus(id: string, status: AppRow["status"]) {
  const { error } = await supabase.from("applications").update({ status }).eq("id", id);
  if (error) throw error;
}

export async function updateApplicationDocs(id: string, docs: AppDoc[]) {
  const { error } = await supabase.from("applications").update({ docs }).eq("id", id);
  if (error) throw error;
}

export async function deleteApplication(id: string) {
  const { error } = await supabase.from("applications").delete().eq("id", id);
  if (error) throw error;
}

/* ===== Storage uploads ===== */
const DOCS_BUCKET = "application-docs";
const SERVICES_BUCKET = "service-images";

export async function uploadDocFile(appId: string, key: string, file: File): Promise<AppDoc> {
  const safe = file.name.replace(/[^\w.\-]+/g, "_");
  const path = `${appId}/${key}-${Date.now()}-${safe}`;
  try {
    const { error } = await supabase.storage
      .from(DOCS_BUCKET)
      .upload(path, file, { contentType: file.type, upsert: false });
    if (error) throw error;
    const { data } = supabase.storage.from(DOCS_BUCKET).getPublicUrl(path);
    return { label: key, name: file.name, url: data.publicUrl, type: file.type };
  } catch (err) {
    // Fallback: inline data-URL so preview still works even if bucket missing
    if (file.type.startsWith("image/")) {
      const url = await compressToDataUrl(file, 1100, 0.72, 160_000);
      return { label: key, name: file.name, url, type: "image/jpeg" };
    }
    if (file.type === "application/pdf" && file.size <= 450_000) {
      const url = await fileToDataUrl(file);
      return { label: key, name: file.name, url, type: file.type };
    }
    throw err;
  }
}

/* ===== Image compression utils (browser only) ===== */
export async function compressImage(file: File, maxEdge = 1600, quality = 0.8): Promise<File> {
  if (typeof window === "undefined") return file;
  if (!file.type.startsWith("image/") || file.type === "image/gif") return file;
  try {
    const bmp = await createImageBitmap(file);
    const scale = Math.min(1, maxEdge / Math.max(bmp.width, bmp.height));
    const w = Math.round(bmp.width * scale);
    const h = Math.round(bmp.height * scale);
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(bmp, 0, 0, w, h);
    const blob: Blob | null = await new Promise((res) => canvas.toBlob(res, "image/jpeg", quality));
    if (!blob || blob.size >= file.size) return file;
    const newName = file.name.replace(/\.(png|jpe?g|webp|heic|heif)$/i, "") + ".jpg";
    return new File([blob], newName, { type: "image/jpeg" });
  } catch {
    return file;
  }
}

export async function compressToDataUrl(
  file: File,
  maxEdge = 900,
  quality = 0.78,
  maxLength = 700_000,
): Promise<string> {
  if (typeof window === "undefined") return "";
  const bmp = await createImageBitmap(file).catch(() => null);
  if (!bmp) return fileToDataUrl(file);
  let scale = Math.min(1, maxEdge / Math.max(bmp.width, bmp.height));
  let canvas = document.createElement("canvas");
  canvas.width = Math.round(bmp.width * scale);
  canvas.height = Math.round(bmp.height * scale);
  canvas.getContext("2d")!.drawImage(bmp, 0, 0, canvas.width, canvas.height);
  let q = quality;
  let url = canvas.toDataURL("image/jpeg", q);
  while (url.length > maxLength && q > 0.35) {
    q -= 0.1;
    url = canvas.toDataURL("image/jpeg", q);
  }
  while (url.length > maxLength && Math.max(canvas.width, canvas.height) > 520) {
    scale *= 0.82;
    canvas = document.createElement("canvas");
    canvas.width = Math.round(bmp.width * scale);
    canvas.height = Math.round(bmp.height * scale);
    canvas.getContext("2d")!.drawImage(bmp, 0, 0, canvas.width, canvas.height);
    url = canvas.toDataURL("image/jpeg", 0.45);
  }
  return url;
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise<string>((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result as string);
    r.onerror = () => rej(r.error);
    r.readAsDataURL(file);
  });
}

/* ===== Services (admin-managed) ===== */
export async function listServices(): Promise<SvcRow[]> {
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data || []).map((r: any) => ({
    id: r.id,
    name: r.name,
    cat: r.cat,
    org: r.org,
    date: r.date,
    apps: r.apps,
    fee: r.fee,
    imageUrl: r.image_url,
    description: r.description,
  }));
}

export async function createService(data: Omit<SvcRow, "id">): Promise<string> {
  const { data: row, error } = await supabase
    .from("services")
    .insert({
      name: data.name,
      cat: data.cat,
      org: data.org,
      date: data.date,
      apps: data.apps,
      fee: data.fee,
      image_url: data.imageUrl,
      description: data.description,
    })
    .select("id")
    .single();
  if (error) throw error;
  return row.id as string;
}

export async function updateService(id: string, data: Partial<SvcRow>) {
  const patch: any = {};
  if (data.name !== undefined) patch.name = data.name;
  if (data.cat !== undefined) patch.cat = data.cat;
  if (data.org !== undefined) patch.org = data.org;
  if (data.date !== undefined) patch.date = data.date;
  if (data.apps !== undefined) patch.apps = data.apps;
  if (data.fee !== undefined) patch.fee = data.fee;
  if (data.imageUrl !== undefined) patch.image_url = data.imageUrl;
  if (data.description !== undefined) patch.description = data.description;
  const { error } = await supabase.from("services").update(patch).eq("id", id);
  if (error) throw error;
}

export async function deleteService(id: string) {
  const { error } = await supabase.from("services").delete().eq("id", id);
  if (error) throw error;
}

export async function uploadServiceImage(file: File): Promise<string> {
  return compressToDataUrl(file, 900, 0.78);
}
