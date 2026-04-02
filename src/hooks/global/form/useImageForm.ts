import { useRef, useState, useImperativeHandle } from "react";

// hooks
import useStaticModal from "@/hooks/global/useStaticModal";
import useNotification from "@/hooks/global/useNotification";
import { useTranslation } from "react-i18next";

// api
import { fileApi } from "@/api";

// interfaces
import type { ImageFormRef } from "@/models/fileInterface";


export default function useImageForm(
    onFileChange: (fileUrl: string) => void,
    resetRef?: React.RefObject<ImageFormRef | null>
) {

    const { serverErrorModal, errorModal } = useStaticModal();
    const { warningNotification } = useNotification();

    const { t } = useTranslation();

    const fileInputRef = useRef<HTMLInputElement>(null);

    const [loading, setLoading] = useState<boolean>(false);

    const [imageUrl, setImageUrl] = useState<string>("");

    useImperativeHandle(resetRef, () => ({
        reset: handleReset,
    }));

    const handleFileChange = async (file: File) => {
        if (!file) return;

        setLoading(true);

        try {
            const [err, res] = await fileApi.getUploadPresignedUrl({
                fileType: file.type,
                fileSize: file.size,
            });

            if (err) {
                if (err.status === 400) {
                    const error = err.response.data.schemaErrors ? err.response.data.schemaErrors[0] : undefined;
                    if (!error) return;
                    errorModal(undefined, `${error.field} is ${error.message}`);
                    return;
                }

                if (err.status === 403) {
                    warningNotification("", t(`error.file.${err.response.data.userMessage}`));
                    return;
                }

                if (fileInputRef.current) fileInputRef.current.value = '';
                serverErrorModal();
                return;
            }

            const [err2] = await fileApi.uploadFile(res.url, file);

            if (err2) {
                if (fileInputRef.current) fileInputRef.current.value = '';
                serverErrorModal();
                return;
            }

            const url = URL.createObjectURL(file);
            setImageUrl(url);
            onFileChange(res.key);

        } finally {
            setLoading(false);
        }
    };

    const handleRemoveImage = () => {
        setImageUrl("");
        onFileChange("");
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleReset = () => {
        setImageUrl("");
        if (fileInputRef.current) fileInputRef.current.value = '';
    }

    return {
        fileInputRef,
        loading,
        imageUrl,
        handleFileChange,
        handleRemoveImage,
    }
}