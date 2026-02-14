const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "demo";

function buildUrl(
  publicId: string,
  resourceType: "image" | "video",
  transformations: string[] = []
): string {
  const transforms = transformations.length
    ? transformations.join("/") + "/"
    : "";
  return `https://res.cloudinary.com/${CLOUD_NAME}/${resourceType}/upload/${transforms}${publicId}`;
}

export function cloudinaryImage(
  publicId: string,
  options: { width?: number; height?: number; quality?: string } = {}
): string {
  const transforms: string[] = ["f_auto"];
  if (options.quality) transforms.push(`q_${options.quality}`);
  else transforms.push("q_auto");
  if (options.width) transforms.push(`w_${options.width}`);
  if (options.height) transforms.push(`h_${options.height}`);
  return buildUrl(publicId, "image", [transforms.join(",")]);
}

export function cloudinaryVideo(
  publicId: string,
  options: { width?: number; quality?: string } = {}
): string {
  const transforms: string[] = ["f_auto"];
  if (options.quality) transforms.push(`q_${options.quality}`);
  else transforms.push("q_auto");
  if (options.width) transforms.push(`w_${options.width}`);
  return buildUrl(publicId, "video", [transforms.join(",")]);
}

export function cloudinaryVideoPoster(publicId: string): string {
  return buildUrl(publicId, "video", ["so_0", "f_auto", "q_auto"]);
}
