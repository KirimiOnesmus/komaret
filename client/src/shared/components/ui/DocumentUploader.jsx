
function DocumentUploader({ children, className = '', ...props }) {
  return (
    <div className={`${className}`} {...props}>
      {children ?? 'Document Uploader'}
    </div>
  );
}

export default DocumentUploader;
