
function MachinerySummary({ children, className = '', ...props }) {
  return (
    <div className={`${className}`} {...props}>
      {children ?? 'Machinery Summary'}
    </div>
  );
}

export default MachinerySummary;
