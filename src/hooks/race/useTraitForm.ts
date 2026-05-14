import { Form } from "antd";

// interfaces
import type { Traits } from "@/models/raceInterfaces";

interface UseTraitFormProps {
    onSave: (trait: Traits) => void;
}

export default function useTraitForm({ onSave }: UseTraitFormProps) {
    const [form] = Form.useForm<Traits>();

    const onFinish = (values: Traits): void => {
        onSave(values);
    };

    return {
        form,
        onFinish,
    };
}
