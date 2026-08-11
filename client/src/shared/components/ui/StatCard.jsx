
function StatCard({ children, className = '', ...props }) {
  return (
    <div className={`${className}`} {...props}>
      {children ?? 'Stat Card'}
    </div>
  );
}

export default StatCard;
