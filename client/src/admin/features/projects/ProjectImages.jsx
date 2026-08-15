import { useRef, useState } from 'react';
import { FaStar, FaRegStar, FaTrash, FaUpload, FaImage } from 'react-icons/fa';
import projectService from '../../../shared/services/projectService';
import { mediaUrl } from '../../../shared/utils/mediaUrl';

export default function ProjectImages({ projectId, images = [], onChanged }) {
  const coverInput = useRef(null);
  const galleryInput = useRef(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const cover = images.find((i) => i.isCover) || null;
  const gallery = images.filter((i) => !i.isCover);

  const run = async (fn) => {
    setBusy(true);
    setError(null);
    try {
      await fn();
      await onChanged?.();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Something went wrong.');
    } finally {
      setBusy(false);
    }
  };

  const onCoverPick = (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    const fd = new FormData();
    fd.append('image', file);
    run(() => projectService.uploadCover(projectId, fd));
  };

  const onGalleryPick = (e) => {
    const files = Array.from(e.target.files || []);
    e.target.value = '';
    if (!files.length) return;
    const fd = new FormData();
    files.forEach((f) => fd.append('images', f));
    run(() => projectService.uploadImages(projectId, fd));
  };

  const makeCover = (imageId) => run(() => projectService.updateImage(projectId, imageId, { isCover: true }));
  const remove = (imageId) => {
    if (!window.confirm('Remove this image?')) return;
    run(() => projectService.deleteImage(projectId, imageId));
  };

  return (
    <div>
      {error && (
        <p className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}

      <div className="grid gap-6 md:grid-cols-[220px,1fr]">
        {/* cover */}
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-gray-400">Cover image</p>
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
            {cover ? (
              <img src={mediaUrl(cover.path)} alt="Project cover" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-1 text-gray-300">
                <FaImage className="text-2xl" />
                <span className="text-xs">No cover yet</span>
              </div>
            )}
          </div>
          <input ref={coverInput} type="file" accept="image/png,image/jpeg,image/webp" hidden onChange={onCoverPick} />
          <button
            type="button"
            disabled={busy}
            onClick={() => coverInput.current?.click()}
            className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-[#071525] hover:border-[#f5b400] hover:bg-[#f5b400]/5 disabled:opacity-50"
          >
            <FaUpload className="text-xs" /> {cover ? 'Replace cover' : 'Upload cover'}
          </button>
        </div>

        {/* gallery */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
              Showcase gallery ({gallery.length})
            </p>
            <input
              ref={galleryInput}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              multiple
              hidden
              onChange={onGalleryPick}
            />
            <button
              type="button"
              disabled={busy}
              onClick={() => galleryInput.current?.click()}
              className="inline-flex items-center gap-2 rounded-md bg-[#071525] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#0d2036] disabled:opacity-50"
            >
              <FaUpload className="text-[10px]" /> Add images
            </button>
          </div>

          {gallery.length === 0 ? (
            <div className="flex aspect-[3/1] items-center justify-center rounded-xl border border-dashed border-gray-300 text-sm text-gray-400">
              No showcase images yet.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {gallery.map((img) => (
                <div key={img.id} className="group relative aspect-square overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                  <img src={mediaUrl(img.path)} alt={img.caption || img.filename} className="h-full w-full object-cover" />
                  <div className="absolute inset-0 flex items-end justify-between gap-1 bg-gradient-to-t from-black/60 to-transparent p-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                    <button
                      type="button"
                      title="Make cover"
                      disabled={busy}
                      onClick={() => makeCover(img.id)}
                      className="flex h-7 w-7 items-center justify-center rounded-md bg-white/90 text-[#071525] hover:bg-[#f5b400]"
                    >
                      {img.isCover ? <FaStar className="text-xs" /> : <FaRegStar className="text-xs" />}
                    </button>
                    <button
                      type="button"
                      title="Remove"
                      disabled={busy}
                      onClick={() => remove(img.id)}
                      className="flex h-7 w-7 items-center justify-center rounded-md bg-white/90 text-red-600 hover:bg-red-600 hover:text-white"
                    >
                      <FaTrash className="text-xs" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          <p className="mt-2 text-xs text-gray-400">
            PNG, JPEG or WebP. Hover an image to set it as the cover or remove it.
          </p>
        </div>
      </div>
    </div>
  );
}