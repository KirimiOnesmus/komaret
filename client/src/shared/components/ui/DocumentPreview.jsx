
function DocumentPreview({ children, className = '', ...props }) {
  return (
    <div className={`${className}`} {...props}>
      {children ?? 'Document Preview'}
    </div>
  );
}

export default DocumentPreview;
