import { Form, type ColorPickerProps, type FormInstance } from "antd";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

// hooks
import useImageForm from "@/hooks/global/form/useImageForm";
import useReferenceStore from "@/stores/useReferenceStore";

// interfaces
import type { ClassResourceDTO, MaxKnown, ResourceRecoveryProps } from "@/models/classInterfaces";

type Color = Parameters<NonNullable<ColorPickerProps['onChange']>>[0];

interface ResourceFormValues {
    name: string;
    description: string;
    color: string;
    image: string | null;
    shortRest: ResourceRecoveryProps;
    longRest: ResourceRecoveryProps;
}

interface UseClassResourceFormProps {
    initialValues?: ClassResourceDTO;
    onSave: (resource: ClassResourceDTO, imageUrl: string) => void;
    imageUrlEdit?: string;
}

export interface UseClassResourceFormReturn {
    form: FormInstance<ResourceFormValues>;
    colorValue: string;
    maxPerLevel: MaxKnown[];
    scrollRef: React.RefObject<HTMLDivElement>;
    maxTotal: number;
    imageUrl: string;
    loading: boolean;
    fileInputRef: React.RefObject<HTMLInputElement>;
    recoveryTypeSelection: { label: string; value: string }[];
    handleColorChange: (color: Color | string) => void;
    handleMaxChange: (index: number, amount: number) => void;
    handleMaxTotalChange: (newTotal: number) => void;
    handleFileChange: (file: File) => void;
    handleRemoveImage: () => void;
    onFinish: (values: ResourceFormValues) => void;
}

export default function useClassResourceForm({ initialValues, onSave, imageUrlEdit }: UseClassResourceFormProps) {
    const { t } = useTranslation();
    const [form] = Form.useForm<ResourceFormValues>();
    const { classOptions } = useReferenceStore();

    const {
        fileInputRef,
        imageUrl,
        loading,
        handleFileChange,
        handleRemoveImage,
    } = useImageForm((key) => form.setFieldsValue({ image: key }), imageUrlEdit || initialValues?.image);

    const colorValue = Form.useWatch('color', form);
    const defaultMaxPerLevel = [2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 6, 6, 6, 6];
    const [maxPerLevel, setMaxPerLevel] = useState<MaxKnown[]>(initialValues?.maxPerLevel || defaultMaxPerLevel.map((amount, i) => ({ level: i + 1, amount })));
    const scrollRef = useRef<HTMLDivElement>(null);

    const handleColorChange = (color: Color | string): void => {
        const hex = typeof color === 'string' ? color : color.toHexString();
        form.setFieldsValue({ color: hex });
    };

    const handleMaxChange = (index: number, amount: number): void => {
        setMaxPerLevel((prev) => {
            const newState = [...prev];
            newState[index] = { ...newState[index], amount };
            return newState;
        });
    }

    const recoveryTypeSelection = classOptions.resourceRecoveryType.map((type) => ({ label: t(`classes.${type}`), value: type }));

    const [maxTotal, setMaxTotal] = useState<number>(maxPerLevel.length);

    const handleMaxTotalChange = (newTotal: number): void => {
        setMaxTotal(newTotal);
        setMaxPerLevel((prev) => {
            if (newTotal > prev.length) {
                return [...prev, ...[...Array(newTotal - prev.length)].map((_, i) => ({ level: prev.length + i + 1, amount: 0 }))];
            } else {
                return prev.slice(0, newTotal);
            }
        });
    }

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({
                left: scrollRef.current.scrollWidth,
                behavior: 'smooth'
            });
        }
    }, [maxTotal]);

    const onFinish = (values: ResourceFormValues): void => {
        onSave({
            ...values,
            image: values.image || "",
            maxPerLevel: maxPerLevel,
            resourceRecovery: {
                shortRest: values.shortRest,
                longRest: values.longRest
            }
        }, imageUrl);
    }

    return {
        form,
        colorValue,
        maxPerLevel,
        scrollRef,
        maxTotal,
        imageUrl,
        loading,
        fileInputRef,
        recoveryTypeSelection,
        handleColorChange,
        handleMaxChange,
        handleMaxTotalChange,
        handleFileChange,
        handleRemoveImage,
        onFinish,
    };
}
