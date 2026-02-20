export default function Button({ children, className }) {
  return (
    <button
      className={`px-4 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 transition-all duration-300 shadow-[0_0_15px_rgba(124,58,237,0.4)] ${className}`}
    >
      {children}
    </button>
  );
}
