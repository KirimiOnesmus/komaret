
function PageContainer({ title, actions, children, className = '' }) {
  return (
    <div className={`mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 ${className}`}>
      {(title || actions) && (
        <div className="mb-6 flex items-center justify-between">
          {title && <h1 className="text-xl font-semibold text-gray-900">{title}</h1>}
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      {children}
    </div>
  );
}

export default PageContainer;
