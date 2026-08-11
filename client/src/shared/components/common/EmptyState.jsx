function EmptyState({ title = 'Nothing here yet', message, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-gray-300 p-10 text-center">
      <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
      {message && <p className="text-sm text-gray-500">{message}</p>}
      {action}
    </div>
  );
}

export default EmptyState;
