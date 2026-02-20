export default function Card({ children, className }) {
  return (
    <div
      className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-lg ${className}`}
    >
      {children}
    </div>
  );
}
