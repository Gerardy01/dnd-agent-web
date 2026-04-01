import { useRef, useState } from "react";

// hooks
import useStaticModal from "../useStaticModal";

// api
import { fileApi } from "@/api";



export default function useImageForm(
    onFileChange: (fileUrl: string) => void,
    onRemoveImage: () => void
) {

    const { serverErrorModal } = useStaticModal();

    const fileInputRef = useRef<HTMLInputElement>(null);

    const [loading, setLoading] = useState<boolean>(false);


    const handleFileChange = async (file: File) => {
        if (!file) return;

        setLoading(true);

        try {
            const [err, res] = await fileApi.getUploadPresignedUrl({
                fileType: file.type,
            });

            if (err) {
                if (fileInputRef.current) fileInputRef.current.value = '';
                serverErrorModal();
                return;
            }

            console.log(res.key)

            const [err2] = await fileApi.uploadFile(res.url, file);

            if (err2) {
                if (fileInputRef.current) fileInputRef.current.value = '';
                serverErrorModal();
                return;
            }

            onFileChange(URL.createObjectURL(file));

        } finally {
            setLoading(false);
        }
    };

    const handleRemoveImage = () => {
        onRemoveImage();
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return {
        fileInputRef,
        loading,
        handleFileChange,
        handleRemoveImage,
    }
}