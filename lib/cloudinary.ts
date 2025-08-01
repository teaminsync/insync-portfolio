// Enhanced Cloudinary helper functions with responsive sizing
const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME

if (!CLOUD_NAME) {
  console.warn("NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is not set in environment variables")
}

export const getCloudinaryUrl = (type: "image" | "video", publicId: string, transformations = "q_auto,f_auto") => {
  if (!CLOUD_NAME) {
    console.error("Cloudinary cloud name not configured")
    return `/placeholder.svg?height=400&width=400&text=Cloudinary+Not+Configured`
  }

  return `https://res.cloudinary.com/${CLOUD_NAME}/${type}/upload/${transformations}/${publicId}`
}

// Specific helpers for common use cases
export const getImageUrl = (publicId: string, width?: number, height?: number) => {
  let transforms = "q_auto,f_auto"

  if (width && height) {
    transforms += `,w_${width},h_${height},c_fill`
  } else if (width) {
    transforms += `,w_${width},c_scale`
  }

  return getCloudinaryUrl("image", publicId, transforms)
}

export const getVideoUrl = (publicId: string) => getCloudinaryUrl("video", publicId, "q_auto,f_auto")

// For responsive images with specific dimensions
export const getResponsiveImageUrl = (publicId: string, width: number, height?: number) => {
  const h = height ? `,h_${height}` : ""
  const transforms = `q_auto,f_auto,w_${width}${h},c_fill`
  return getCloudinaryUrl("image", publicId, transforms)
}

// For decorative elements - small sizes
export const getDecorativeImageUrl = (publicId: string, size = 144) => {
  return getImageUrl(publicId, size, size)
}
