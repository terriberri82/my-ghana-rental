export default function Button({
  children,
  variant = "primary",
  type = "button",
  loading = false,
  className = "",
  ...props
}) {
  const base =
    "inline-flex items-center justify-center px-5 py-2.5 rounded-md font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-bayou";

  const variants = {
    primary: "bg-bayou text-paper hover:bg-bayou-deep",
    gold: "bg-sun text-ebony hover:brightness-95",
    outline: "border border-bayou text-bayou hover:bg-bayou hover:text-paper",
    ghost: "text-bayou hover:bg-pearl",
    danger: "bg-[#A63A2E] text-white hover:brightness-95",
  };

  return (
    <button
      type={type}
      disabled={loading || props.disabled}
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    >
      {loading ? "Working…" : children}
    </button>
  );
}