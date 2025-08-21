import React, { useRef, useState } from 'react';
import axios from 'axios';

type Attachment = {
  id: string;
  file_name: string;
  file_path: string;
  mime: string;
  size: number;
  created_at?: string;
};

type Props = {
  bugId: string | number;
  initial?: Attachment[];
  onChanged?: (list: Attachment[]) => void;
};

export default function AttachmentUploader({ bugId, initial = [], onChanged }: Props) {
  const [items, setItems] = useState<Attachment[]>(initial);
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const refresh = async () => {
    const { data } = await axios.get(`/developer/bugs/${bugId}/attachments`);
    setItems(data.attachments || []);
    onChanged?.(data.attachments || []);
  };

  const onPick = async (files: FileList | null) => {
    if (!files || !files.length) return;
    setUploading(true);
    setErr(null);
    try {
      const fd = new FormData();
      Array.from(files).forEach(f => fd.append('files[]', f));
      await axios.post(`/developer/bugs/${bugId}/attachments`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      await refresh();
    } catch (e:any) {
      setErr(e?.response?.data?.message || 'Gagal mengunggah file.');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const remove = async (id: string) => {
    if (!confirm('Hapus lampiran ini?')) return;
    await axios.delete(`/developer/attachments/${id}`);
    await refresh();
  };

  const isImage = (mime: string) => /^image\//.test(mime);

  return (
    <div className="space-y-3">
      {err && <div className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{err}</div>}

      <div className="flex items-center gap-3">
        <input
          ref={inputRef}
          type="file"
          multiple
          accept=".png,.jpg,.jpeg,.webp,.gif,.mp4,.webm,.pdf,.txt,.log"
          onChange={e => onPick(e.target.files)}
          className="block w-full text-sm file:mr-3 file:rounded-md file:border-0 file:bg-indigo-600 file:px-4 file:py-2 file:text-white hover:file:bg-indigo-700"
        />
        {uploading && <span className="text-sm text-slate-500">Mengunggah…</span>}
      </div>

      <ul className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {items.map(att => (
          <li key={att.id} className="rounded border p-2">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="truncate text-sm font-medium">{att.file_name}</div>
                <div className="text-xs text-slate-500">{(att.size/1024).toFixed(1)} KB</div>
              </div>
              <button onClick={() => remove(att.id)} className="text-xs text-red-600 hover:underline">hapus</button>
            </div>
            <div className="mt-2">
              {isImage(att.mime) ? (
                <img
                  src={`/storage/${att.file_path}`}
                  alt={att.file_name}
                  className="h-28 w-full rounded object-cover"
                />
              ) : (
                <a
                  className="text-xs text-indigo-600 hover:underline"
                  href={`/storage/${att.file_path}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Lihat / Unduh
                </a>
              )}
            </div>
          </li>
        ))}
        {!items.length && <div className="col-span-full text-sm text-slate-500">Belum ada lampiran.</div>}
      </ul>
    </div>
  );
}
