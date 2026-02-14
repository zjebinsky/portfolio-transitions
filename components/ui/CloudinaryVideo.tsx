"use client";

import { cloudinaryVideo, cloudinaryVideoPoster } from "@/lib/cloudinary";
import { useIntersectionVideo } from "@/hooks/useIntersectionVideo";

interface CloudinaryVideoProps {
  publicId: string;
  width?: number;
  className?: string;
}

export function CloudinaryVideo({
  publicId,
  width,
  className,
}: CloudinaryVideoProps) {
  const ref = useIntersectionVideo();

  return (
    <video
      ref={ref}
      src={cloudinaryVideo(publicId, { width })}
      poster={cloudinaryVideoPoster(publicId)}
      muted
      loop
      playsInline
      preload="none"
      className={className}
    />
  );
}
