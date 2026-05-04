
import { useState } from "react";
import { Form, type FormProps, type ColorPickerProps } from "antd";

type Color = Parameters<NonNullable<ColorPickerProps['onChange']>>[0];

// interfaces
import type { CreateFactionDTO } from "@/models/factionInterfaces";

interface CreateFactionFormValues {
    name: string;
    description: string;
    color: string;
}

export default function useCreateFaction(
    onClose: () => void,
    onCreateSubmit: (data: CreateFactionDTO) => Promise<void>
) {

    const [createFactionForm] = Form.useForm<CreateFactionFormValues>();

    const [submitLoad, setSubmitLoad] = useState<boolean>(false);
    const [imageUrl, setImageUrl] = useState<string>("");

    const handleFileChange = (url: string) => {
        setImageUrl(url);
    };

    const submitCreateFaction: FormProps<CreateFactionFormValues>["onFinish"] = async (values) => {
        const submitData: CreateFactionDTO = {
            image: imageUrl,
            name: values.name,
            description: values.description,
            color: values.color,
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
        createFactionForm.resetFields();
        setImageUrl("");
    };

    const handleCloseModal = () => {
        restartForm();
        onClose();
    };

    const handleColorChange = (color: Color | string) => {
        const hex = typeof color === 'string' ? color : color.toHexString();
        createFactionForm.setFieldsValue({ color: hex });
    };

    return {
        createFactionForm,
        submitLoad,
        handleFileChange,
        submitCreateFaction,
        handleCloseModal,
        handleColorChange,
    };
}
