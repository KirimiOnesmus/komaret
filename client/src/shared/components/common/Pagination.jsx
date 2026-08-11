function Pagination({ page = 1, totalPages = 1, onPageChange }) {
  const canPrev = page > 1;
  const canNext = page < totalPages;

  return (
    <div className="flex items-center justify-between text-sm">
      <button
        type="button"
        disabled={!canPrev}
        onClick={() => onPageChange?.(page - 1)}
        className="rounded-md border px-3 py-1 disabled:opacity-40"
      >
        Previous
      </button>
      <span className="text-gray-600">
        Page {page} of {totalPages}
      </span>
      <button
        type="button"
        disabled={!canNext}
        onClick={() => onPageChange?.(page + 1)}
        className="rounded-md border px-3 py-1 disabled:opacity-40"
      >
        Next
      </button>
    </div>
  );
}

export default Pagination;
