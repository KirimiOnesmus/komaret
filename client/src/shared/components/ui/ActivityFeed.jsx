
function ActivityFeed({ children, className = '', ...props }) {
  return (
    <div className={`${className}`} {...props}>
      {children ?? 'Activity Feed'}
    </div>
  );
}

export default ActivityFeed;
