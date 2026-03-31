import { useRef } from "react";



export default function useImageForm(
    onFileChange: (fileUrl: string) => void,
    onRemoveImage: () => void
) {

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (file: File) => {
        if (!file) return;
        // Temporarily preview with a local object URL
        // Replace setImageUrl call with the S3 URL returned from the API when wiring the real upload
        onFileChange(URL.createObjectURL(file));
    };

    const handleRemoveImage = () => {
        onRemoveImage();
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return {
        fileInputRef,
        handleFileChange,
        handleRemoveImage,
    }
}