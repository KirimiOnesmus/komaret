import { useRef, useState } from 'react';
import { FaUpload, FaTrash, FaImage } from 'react-icons/fa';
import { mediaUrl } from '../../../shared/utils/mediaUrl';


export default function ServiceImage({ serviceId, heroImage, onUpload, onRemove }) {
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const run = async (fn) => {
    setBusy(true);
    setError(null);
    try {
      await fn();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Something went wrong.');
    } finally {
      setBusy(false);
    }
  };

  const onPick = (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    run(() => onUpload(serviceId, file));
  };

  const handleRemove = () => {
    if (!window.confirm('Remove this image?')) return;
    run(() => onRemove(serviceId));
  };

  return (
    <div>
      <h2 className="text-sm font-bold text-[#071525]">Service image</h2>
      <p className="mt-0.5 text-xs text-gray-400">
        One image, shown on the public services page. PNG, JPEG or WebP.
      </p>

      {error && (
        <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}

      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="relative aspect-[16/9] w-full max-w-xs overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
          {heroImage ? (
            <img src={mediaUrl(heroImage)} alt="Service" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-1 text-gray-300">
              <FaImage className="text-2xl" />
              <span className="text-xs">No image yet</span>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <input ref={inputRef} type="file" accept="image/png,image/jpeg,image/webp" hidden onChange={onPick} />
          <button
            type="button"
            disabled={busy}
            onClick={() => inputRef.current?.click()}
            className="inline-flex items-center justify-center gap-2 rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-[#071525] hover:border-[#f5b400] hover:bg-[#f5b400]/5 disabled:opacity-50"
          >
            <FaUpload className="text-xs" /> {heroImage ? 'Replace image' : 'Upload image'}
          </button>
          {heroImage && (
            <button
              type="button"
              disabled={busy}
              onClick={handleRemove}
              className="inline-flex items-center justify-center gap-2 rounded-md border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
            >
              <FaTrash className="text-xs" /> Remove
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
