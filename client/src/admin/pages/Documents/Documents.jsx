import { useCallback, useEffect, useState } from 'react';
import PageContainer from '../../../shared/components/ui/PageContainer';
import FileUpload from '../../../shared/components/forms/FileUpload';
import DocumentList from '../../../shared/components/ui/DocumentList';
import Loading from '../../../shared/components/common/Loading';
import EmptyState from '../../../shared/components/common/EmptyState';
import api from '../../../shared/services/api';
import extractList from '../../../shared/utils/api';

/**
 * Uploads go through multipart/form-data to the server, which is the
 * sole authority on: allow-listed MIME types + magic-number
 * verification (never trust the browser-reported type), randomized
 * storage filenames, storage outside any public directory, size limits,
 * and antivirus scanning before a document is considered usable.
 * FileUpload's client-side checks are UX only.
 */
function Documents() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploadError, setUploadError] = useState('');
  const [uploading, setUploading] = useState(false);

  const fetchDocuments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get('/admin/documents');
      setDocuments(extractList(data));
    } catch (err) {
      setError(err.message || 'Unable to load documents.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Intentional: fetch on mount; fetchDocuments guards its own
    // loading/error state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchDocuments();
  }, [fetchDocuments]);

  const handleFileSelect = async (file) => {
    setUploadError('');
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      await api.post('/admin/documents', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      await fetchDocuments();
    } catch (err) {
      setUploadError(err.message || 'Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <PageContainer title="Documents">
      <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4">
        <FileUpload onFileSelect={handleFileSelect} />
        {uploading && <p className="mt-2 text-sm text-gray-500">Uploading...</p>}
        {uploadError && <p className="mt-2 text-sm text-red-600">{uploadError}</p>}
      </div>

      {loading && <Loading label="Loading documents..." />}
      {error && <p className="text-sm text-red-600">{error}</p>}
      {!loading && !error && documents.length === 0 && <EmptyState title="No documents uploaded yet" />}
      {!loading && !error && documents.length > 0 && <DocumentList documents={documents} />}
    </PageContainer>
  );
}

export default Documents;
