import Image from "next/image";

interface LogoProps {
  /** Lebar tampilan dalam px. Tinggi mengikuti rasio asli. */
  width?: number | string;
  className?: string;
  priority?: boolean;
}

export function Logo({ width = 160, className = "", priority = false }: LogoProps) {
  return (
    <Image
      src="/logo.png"
      alt="Company logo"
      // width/height di sini hanya rasio. Ganti sesuai ukuran asli file logo kamu.
      width={400}
      height={120}
      priority={priority}
      style={{ width, height: "auto" }}
      className={className}
    />
  );
}