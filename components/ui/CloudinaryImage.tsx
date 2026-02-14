import Image from "next/image";
import { cloudinaryImage } from "@/lib/cloudinary";

interface CloudinaryImageProps {
  publicId: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
}

export function CloudinaryImage({
  publicId,
  alt,
  width,
  height,
  className,
  priority,
}: CloudinaryImageProps) {
  return (
    <Image
      src={cloudinaryImage(publicId, { width })}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
    />
  );
}
