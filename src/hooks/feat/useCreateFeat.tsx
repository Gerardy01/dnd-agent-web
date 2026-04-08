import { useState } from "react";
import { Form, type FormProps } from "antd";

// stores
import useReferenceStore from "@/stores/useReferenceStore";

// hooks
import { useTranslation } from "react-i18next";

// interfaces
import type { CreateFeatDTO } from "@/models/featInterfaces";

interface CreateFeatFormValues {
    name: string;
    description: string;
    category: string;
    minLevel?: number | null;
}

export default function useCreateFeat(
    onClose: () => void,
    onCreateSubmit: (data: CreateFeatDTO) => Promise<void>
) {
    const { t } = useTranslation();
    const { featOptions } = useReferenceStore();

    const [createFeatForm] = Form.useForm<CreateFeatFormValues>();

    const [submitLoad, setSubmitLoad] = useState<boolean>(false);
    const [imageUrl, setImageUrl] = useState<string>("");

    const categorySelection = [{
        label: t('global.none'),
        value: '',
    },
    ...featOptions.featCategories.map((category) => ({
        label: t(`feats.${category}`),
        value: category,
    }))];

    const handleFileChange = (url: string) => {
        setImageUrl(url);
    };

    const submitCreateFeat: FormProps<CreateFeatFormValues>["onFinish"] = async (values) => {
        const submitData: CreateFeatDTO = {
            image: imageUrl,
            name: values.name,
            description: values.description,
            category: values.category,
            minLevel: values.minLevel ?? null,
        };

        setSubmitLoad(true);

        try {
            await onCreateSubmit(submitData);
            handleCloseModal();
        } finally {
            setSubmitLoad(false);
        }
    };

    const restartForm = () => {
        createFeatForm.resetFields();
        setImageUrl("");
    };

    const handleCloseModal = () => {
        restartForm();
        onClose();
    };

    return {
        createFeatForm,
        categorySelection,
        submitLoad,
        handleFileChange,
        submitCreateFeat,
        handleCloseModal,
    };
}
