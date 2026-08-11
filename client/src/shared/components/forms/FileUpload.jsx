import { useRef, useState } from 'react';
const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'application/pdf'];
const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

function FileUpload({ onFileSelect, accept = ALLOWED_TYPES.join(','), maxSizeBytes = MAX_SIZE_BYTES }) {
  const inputRef = useRef(null);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const file = e.target.files?.[0];
    setError('');
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError('Unsupported file type.');
      return;
    }
    if (file.size > maxSizeBytes) {
      setError('File exceeds the maximum allowed size.');
      return;
    }
    onFileSelect?.(file);
  };

  return (
    <div className="flex flex-col gap-1">
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="text-sm"
      />
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  );
}

export default FileUpload;
