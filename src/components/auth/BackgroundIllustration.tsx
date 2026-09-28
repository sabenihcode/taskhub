import Image from "next/image";

interface BackgroundIllustrationProps {
  src?: string;
}

export function BackgroundIllustration({
  src = "/login-bg.png",
}: BackgroundIllustrationProps) {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
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
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/10 via-transparent to-slate-900/40" />
    </div>
  );
}
