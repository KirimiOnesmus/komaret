
function QuotationSummary({ children, className = '', ...props }) {
  return (
    <div className={`${className}`} {...props}>
      {children ?? 'Quotation Summary'}
    </div>
  );
}

export default QuotationSummary;
