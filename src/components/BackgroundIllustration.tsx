import Image from "next/image";

interface BackgroundIllustrationProps {
  className?: string;
  src?: string;
}

export function BackgroundIllustration({
  className = "",
  src = "/images/login-bg.png",
}: BackgroundIllustrationProps) {
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {/* Gambar full-cover */}
      <Image
        src={src}
        alt="Login background"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
        quality={85}
      />

      {/* Overlay agar teks form tetap mudah dibaca */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/30 via-slate-900/10 to-slate-900/60 pointer-events-none" />
    </div>
  );
}
