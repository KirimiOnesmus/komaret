
function ProjectSummary({ children, className = '', ...props }) {
  return (
    <div className={`${className}`} {...props}>
      {children ?? 'Project Summary'}
    </div>
  );
}

export default ProjectSummary;
