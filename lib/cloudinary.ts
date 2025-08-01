// Cloudinary helper functions
const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME

if (!CLOUD_NAME) {
  console.warn("NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is not set in environment variables")
}

export const getCloudinaryUrl = (type: "image" | "video", publicId: string, transformations = "q_auto,f_auto") => {
  if (!CLOUD_NAME) {
    console.error("Cloudinary cloud name not configured")
    return `/placeholder.svg?height=400&width=400&text=Cloudinary+Not+Configured`
  }

  // Use the public ID directly as it appears in your Cloudinary dashboard
  return `https://res.cloudinary.com/${CLOUD_NAME}/${type}/upload/${transformations}/${publicId}`
}

// Specific helpers for common use cases
export const getImageUrl = (publicId: string) => getCloudinaryUrl("image", publicId)
export const getVideoUrl = (publicId: string) => getCloudinaryUrl("video", publicId)

// For responsive images
export const getResponsiveImageUrl = (publicId: string, width?: number) => {
  const transforms = width ? `q_auto,f_auto,w_${width},c_scale` : "q_auto,f_auto,w_auto,c_scale"
  return getCloudinaryUrl("image", publicId, transforms)
}