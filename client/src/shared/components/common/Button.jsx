function Button({
  children,
  type = 'button',
  variant = 'primary',
  disabled = false,
  onClick,
  className = '',
  ...props
}) {
  const variants = {
    primary: 'bg-[#071525] text-white hover:bg-[#0d2036]',
    secondary: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant] ?? variants.primary} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;