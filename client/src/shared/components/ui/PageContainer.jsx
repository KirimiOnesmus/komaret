function PageContainer({
  title,
  description,
  actions,
  breadcrumbs,
  children,
  className = '',
}) {
  return (
    <div
      className={`mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 ${className}`}
    >
      {(breadcrumbs || title || description || actions) && (
        <header className="mb-6">
          {breadcrumbs && (
            <div className="mb-3">
              {breadcrumbs}
            </div>
          )}

          {(title || actions) && (
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                {title && (
                  <h1 className="text-xl font-semibold tracking-tight text-gray-900 sm:text-2xl">
                    {title}
                  </h1>
                )}

                {description && (
                  <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
                    {description}
                  </p>
                )}
              </div>

              {actions && (
                <div className="flex shrink-0 flex-wrap items-center gap-2">
                  {actions}
                </div>
              )}
            </div>
          )}
        </header>
      )}

      {children}
    </div>
  );
}

export default PageContainer;