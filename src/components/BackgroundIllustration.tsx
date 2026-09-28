import Image from "next/image";

interface BackgroundIllustrationProps {
  className?: string;
  src?: string;
}

export function BackgroundIllustration({
  className = "",
  src = "/login-bg.png",
}: BackgroundIllustrationProps) {
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      <Image
        src={src}
        alt="Login background"
        fill
        priority
        sizes="(min-width: 1024px) 50vw, 100vw"
        className="object-cover object-center"
        quality={85}
      />
      {/* Overlay agar teks/konten di atas gambar terbaca jelas */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/20 via-transparent to-slate-900/40 pointer-events-none" />
    </div>
  );
}
