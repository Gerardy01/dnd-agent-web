import { useState } from "react";
import { Form, type FormProps } from "antd";

// stores
import useReferenceStore from "@/stores/useReferenceStore";

// hooks
import { useTranslation } from "react-i18next";

// interfaces
import type { CreateMonsterDTO, MonsterAction } from "@/models/monsterInterfaces";

interface CreateMonsterFormValues {
    name: string;
    alignment: string;
    size: string;
    type: string;
    description: string;
    appearance: string;
    languages: string;
    minHp: number;
    maxHp: number;
    ac: number;
    cr: number;
    str: number;
    dex: number;
    con: number;
    int: number;
    wis: number;
    cha: number;
    immunities: string[];
    resistances: string[];
    vulnerabilities: string[];
    conditionImmunities: string[];
}

interface SelectionValue {
    selection: string;
    value: number;
}

export default function useCreateMonster(
    onClose: () => void,
    onCreateSubmit: (data: CreateMonsterDTO) => Promise<void>
) {

    const { t } = useTranslation();
    const { monsterOptions, effectOptions } = useReferenceStore();

    const [createMonsterForm] = Form.useForm();

    const [submitLoad, setSubmitLoad] = useState<boolean>(false);
    const [imageUrl, setImageUrl] = useState<string>("");

    const [speedValue, setSpeedValue] = useState<SelectionValue[]>([]);
    const [sensesValue, setSensesValue] = useState<SelectionValue[]>([]);
    const [actionsValue, setActionsValue] = useState<MonsterAction[]>([{ name: "", description: "" }]);

    const sizeSelection = monsterOptions.monsterSize.map((size) => ({
        label: t(`monsters.${size}`),
        value: size,
    }));

    const typeSelection = monsterOptions.monsterType.map((type) => ({
        label: t(`monsters.${type}`),
        value: type,
    }));

    const alignmentSelection = monsterOptions.alignment.map((alignment) => ({
        label: t(`monsters.${alignment}`),
        value: alignment,
    }));

    const movementSelection = monsterOptions.movementSelection.map((movement) => ({
        label: t(`monsters.${movement}`),
        value: movement,
    }));

    const sensesSelection = monsterOptions.sensesSelection.map((sense) => ({
        label: t(`monsters.${sense}`),
        value: sense,
    }));

    const damageTypeSelection = effectOptions.damageTypes.map((damageType) => ({
        label: t(`effects.${damageType}`),
        value: damageType,
    }));

    const conditionSelection = effectOptions.immunities.map((condition) => ({
        label: t(`effects.${condition}`),
        value: condition,
    }));

    const handleFileChange = (imageUrl: string) => {
        setImageUrl(imageUrl);
    };

    const handleAddSpeed = () => {
        setSpeedValue((prev) => [...prev, { selection: "", value: 0 }]);
    };

    const handleUpdateSpeedStat = (index: number, selection: string) => {
        setSpeedValue((prev) =>
            prev.map((s, i) => (i === index ? { ...s, selection } : s))
        );
    };

    const handleUpdateSpeedValue = (index: number, value: number) => {
        setSpeedValue((prev) =>
            prev.map((s, i) => (i === index ? { ...s, value } : s))
        );
    };

    const handleDeleteSpeed = (index: number) => {
        setSpeedValue((prev) => prev.filter((_, i) => i !== index));
    };

    const handleAddSenses = () => {
        setSensesValue((prev) => [...prev, { selection: "", value: 0 }]);
    };

    const handleUpdateSensesStat = (index: number, selection: string) => {
        setSensesValue((prev) =>
            prev.map((s, i) => (i === index ? { ...s, selection } : s))
        );
    };

    const handleUpdateSensesValue = (index: number, value: number) => {
        setSensesValue((prev) =>
            prev.map((s, i) => (i === index ? { ...s, value } : s))
        );
    };

    const handleDeleteSenses = (index: number) => {
        setSensesValue((prev) => prev.filter((_, i) => i !== index));
    };

    const handleAddAction = () => {
        setActionsValue((prev) => [...prev, { name: "", description: "" }]);
    };

    const handleUpdateActionName = (index: number, name: string) => {
        setActionsValue((prev) =>
            prev.map((a, i) => (i === index ? { ...a, name } : a))
        );
    };

    const handleUpdateActionDescription = (index: number, description: string) => {
        setActionsValue((prev) =>
            prev.map((a, i) => (i === index ? { ...a, description } : a))
        );
    };

    const handleDeleteAction = (index: number) => {
        setActionsValue((prev) => prev.filter((_, i) => i !== index));
    };

    const submitCreateMonster: FormProps<CreateMonsterFormValues>['onFinish'] = async (values) => {

        const transformedSpeed = {
            walk: 0, burrow: 0, climb: 0, fly: 0, swim: 0
        };
        speedValue.forEach((s) => {
            if (s.selection && s.selection in transformedSpeed) {
                transformedSpeed[s.selection as keyof typeof transformedSpeed] = s.value;
            }
        });

        const transformedSenses = {
            blindsight: 0, darkvision: 0, tremorsense: 0, truesight: 0
        };
        sensesValue.forEach((s) => {
            if (s.selection && s.selection in transformedSenses) {
                transformedSenses[s.selection as keyof typeof transformedSenses] = s.value;
            }
        });

        const submitData: CreateMonsterDTO = {
            image: imageUrl,
            name: values.name,
            alignment: values.alignment,
            size: values.size,
            type: values.type,
            description: values.description,
            appearance: values.appearance,
            languages: values.languages,
            speed: transformedSpeed,
            senses: transformedSenses,
            stats: {
                minHp: values.minHp,
                maxHp: values.maxHp,
                ac: values.ac,
                cr: values.cr,
                str: values.str,
                dex: values.dex,
                con: values.con,
                int: values.int,
                wis: values.wis,
                cha: values.cha,
            },
            additionalProperties: {
                immunities: values.immunities || [],
                resistances: values.resistances || [],
                vulnerabilities: values.vulnerabilities || [],
                conditionImmunities: values.conditionImmunities || [],
            },
            actions: actionsValue,
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
        createMonsterForm.resetFields();
        setImageUrl("");
        setSpeedValue([]);
        setSensesValue([]);
        setActionsValue([{ name: "", description: "" }]);
    };

    const handleCloseModal = () => {
        restartForm();
        onClose();
    };

    return {
        createMonsterForm,
        sizeSelection,
        typeSelection,
        alignmentSelection,
        movementSelection,
        sensesSelection,
        damageTypeSelection,
        conditionSelection,
        speedValue,
        sensesValue,
        actionsValue,
        submitLoad,
        handleFileChange,
        handleAddSpeed,
        handleUpdateSpeedStat,
        handleUpdateSpeedValue,
        handleDeleteSpeed,
        handleAddSenses,
        handleUpdateSensesStat,
        handleUpdateSensesValue,
        handleDeleteSenses,
        handleAddAction,
        handleUpdateActionName,
        handleUpdateActionDescription,
        handleDeleteAction,
        submitCreateMonster,
        handleCloseModal,
    }
}
