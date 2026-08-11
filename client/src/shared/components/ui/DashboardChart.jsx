
function DashboardChart({ children, className = '', ...props }) {
  return (
    <div className={`${className}`} {...props}>
      {children ?? 'Dashboard Chart'}
    </div>
  );
}

export default DashboardChart;
