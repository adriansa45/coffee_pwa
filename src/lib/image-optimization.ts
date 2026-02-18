/**
 * Optimizes an image file on the client side using the Canvas API.
 * Resizes the image if it exceeds the maximum dimensions and converts it to WebP format.
 */
export async function optimizeImage(
    file: File,
    maxWidth = 1024,
    maxHeight = 1024,
    quality = 0.8
): Promise<File> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;
            img.onload = () => {
                const canvas = document.createElement("canvas");
                let width = img.width;
                let height = img.height;

                // Calculate new dimensions while maintaining aspect ratio
                if (width > height) {
                    if (width > maxWidth) {
                        height *= maxWidth / width;
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width *= maxHeight / height;
                        height = maxHeight;
                    }
                }

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext("2d");
                if (!ctx) {
                    reject(new Error("Failed to get canvas context"));
                    return;
                }

                // Draw and resize the image
                ctx.drawImage(img, 0, 0, width, height);

                // Convert to WebP format
                canvas.toBlob(
                    (blob) => {
                        if (!blob) {
                            reject(new Error("Failed to convert image to blob"));
                            return;
                        }
                        // Create a new File object from the blob
                        const optimizedFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".webp", {
                            type: "image/webp",
                            lastModified: Date.now(),
                        });
                        resolve(optimizedFile);
                    },
                    "image/webP",
                    quality
                );
            };
            img.onerror = () => reject(new Error("Failed to load image"));
        };
        reader.onerror = () => reject(new Error("Failed to read file"));
    });
}
