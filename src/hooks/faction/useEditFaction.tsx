import { useEffect, useState } from "react";
import { Form, type FormProps } from "antd";

// interfaces
import type { Faction } from "@/models/factionInterfaces";

interface EditFactionFormValues {
    name: string;
    description: string;
    color: string;
}

export default function useEditFaction(
    onClose: () => void,
    onEditSubmit: (faction: Faction, prevData: Faction) => Promise<void>,
    getData: () => Promise<Faction | null>
) {

    const [editFactionForm] = Form.useForm<EditFactionFormValues>();

    const [faction, setFaction] = useState<Faction | null>(null);
    const [submitLoad, setSubmitLoad] = useState<boolean>(false);
    const [imageUrl, setImageUrl] = useState<string>("");

    useEffect(() => {
        getFactionData();
    }, []);

    useEffect(() => {
        if (!faction) return;

        editFactionForm.setFieldsValue({
            name: faction.name,
            description: faction.description,
            color: faction.color || '#000000',
        });

        setImageUrl(faction.image || "");
    }, [faction, editFactionForm]);

    const getFactionData = async () => {
        const data = await getData();
        setFaction(data);
    };

    const handleFileChange = (url: string) => {
        setImageUrl(url);
    };

    const handleColorChange = (color: any) => {
        const hex = typeof color === 'string' ? color : color.toHexString();
        editFactionForm.setFieldsValue({ color: hex });
    };

    const submitEditFaction: FormProps<EditFactionFormValues>["onFinish"] = async (values) => {
        if (!faction) return;

        const submitData: Faction = {
            ...faction,
            image: imageUrl,
            name: values.name,
            description: values.description,
            color: values.color,
        };

        setSubmitLoad(true);
        try {
            await onEditSubmit(submitData, faction);
            handleCloseModal();
        } finally {
            setSubmitLoad(false);
        }
    };

    const handleCloseModal = () => {
        onClose();
    };

    return {
        faction,
        editFactionForm,
        submitLoad,
        handleFileChange,
        handleColorChange,
        submitEditFaction,
        handleCloseModal,
    };
}
