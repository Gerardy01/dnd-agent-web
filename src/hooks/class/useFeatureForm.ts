import { Form } from "antd";

// interfaces
import type { Features } from "@/models/classInterfaces";

interface UseFeatureFormProps {
    onSave: (feature: Features) => void;
}

export default function useFeatureForm({ onSave }: UseFeatureFormProps) {
    const [form] = Form.useForm<Features>();

    const onFinish = (values: Features): void => {
        onSave(values);
    };

    return {
        form,
        onFinish,
    };
}
