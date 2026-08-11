import { formatDate, formatFileSize } from '../../utils/formatters';

function DocumentList({ documents = [] }) {
  if (documents.length === 0) return null;

  return (
    <ul className="divide-y divide-gray-100 rounded-lg border border-gray-200 bg-white">
      {documents.map((doc) => (
        <li key={doc.id} className="flex items-center justify-between px-4 py-3 text-sm">
          <div>
            <p className="font-medium text-gray-900">{doc.name}</p>
            <p className="text-gray-500">
              {formatFileSize(doc.sizeBytes)} &middot; {formatDate(doc.uploadedAt)}
            </p>
          </div>
          {doc.downloadUrl && (
            <a href={doc.downloadUrl} className="text-yellow-400 hover:underline">
              Download
            </a>
          )}
        </li>
      ))}
    </ul>
  );
}

export default DocumentList;
