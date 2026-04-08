import { useEffect, useState } from "react";
import { Form, type FormProps } from "antd";

// stores
import useReferenceStore from "@/stores/useReferenceStore";

// hooks
import { useTranslation } from "react-i18next";

// interfaces
import type { Feat } from "@/models/featInterfaces";

interface EditFeatFormValues {
    name: string;
    description: string;
    category: string;
    minLevel?: number | null;
}

export default function useEditFeat(
    onClose: () => void,
    onEditSubmit: (feat: Feat, prevData: Feat) => Promise<void>,
    getData: () => Promise<Feat | null>
) {
    const { t } = useTranslation();
    const { featOptions } = useReferenceStore();

    const [editFeatForm] = Form.useForm<EditFeatFormValues>();

    const [feat, setFeat] = useState<Feat | null>(null);
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

    useEffect(() => {
        getFeatData();
    }, []);

    useEffect(() => {
        if (!feat) return;

        editFeatForm.setFieldsValue({
            name: feat.name,
            description: feat.description,
            category: feat.category || '',
            minLevel: feat.minLevel ?? undefined,
        });

        setImageUrl(feat.image || "");
    }, [feat, editFeatForm]);

    const getFeatData = async () => {
        const data = await getData();
        setFeat(data);
    };

    const handleFileChange = (url: string) => {
        setImageUrl(url);
    };

    const submitEditFeat: FormProps<EditFeatFormValues>["onFinish"] = async (values) => {
        if (!feat) return;

        const submitData: Feat = {
            ...feat,
            image: imageUrl,
            name: values.name,
            description: values.description,
            category: values.category,
            minLevel: values.minLevel ?? null,
        };

        setSubmitLoad(true);
        try {
            await onEditSubmit(submitData, feat);
            handleCloseModal();
        } finally {
            setSubmitLoad(false);
        }
    };

    const handleCloseModal = () => {
        onClose();
    };

    return {
        feat,
        editFeatForm,
        categorySelection,
        submitLoad,
        handleFileChange,
        submitEditFeat,
        handleCloseModal,
    };
}