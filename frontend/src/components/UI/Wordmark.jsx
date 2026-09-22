export default function Wordmark() {
  return (
    <div
      className="fixed top-5 left-5 md:top-7 md:left-8 z-40 flex items-center gap-3 select-none"
      data-testid="est-wordmark"
    >
      <div
        className="w-9 h-9 rounded-md flex items-center justify-center"
        style={{
          background: "linear-gradient(135deg, #20B9AE, #063F43)",
          boxShadow: "0 0 22px rgba(32, 185, 174, 0.5)",
        }}
      >
        <span className="est-heading text-lg text-[#F4F5ED]">E</span>
      </div>
      <div className="est-heading text-xl md:text-2xl text-[#F4F5ED] tracking-[0.35em]">
        EST<span className="text-[#20B9AE]">.</span>
      </div>
    </div>
  );
}
