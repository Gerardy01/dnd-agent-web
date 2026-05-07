import { useEffect, useState } from "react";
import { Form, type FormProps } from "antd";

// stores
import useReferenceStore from "@/stores/useReferenceStore";

// hooks
import { useTranslation } from "react-i18next";

// interfaces
import type { Monster, MonsterAction } from "@/models/monsterInterfaces";

interface EditMonsterFormValues {
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
    actions: MonsterAction[];
}

interface SelectionValue {
    selection: string;
    value: number;
}

export default function useEditMonster(
    onClose: () => void,
    onEditSubmit: (data: Monster) => Promise<void>,
    getData: () => Promise<Monster | null>
) {

    const { t } = useTranslation();
    const { monsterOptions, effectOptions } = useReferenceStore();

    const [editMonsterForm] = Form.useForm();

    const [monster, setMonster] = useState<Monster | null>(null);

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

    useEffect(() => {
        getMonsterData();
    }, []);

    useEffect(() => {
        if (!monster) return;

        editMonsterForm.setFieldsValue({
            name: monster.name,
            alignment: monster.alignment,
            size: monster.size,
            type: monster.type,
            description: monster.description,
            appearance: monster.appearance,
            languages: monster.languages,
            minHp: monster.stats.minHp,
            maxHp: monster.stats.maxHp,
            ac: monster.stats.ac,
            cr: monster.stats.cr,
            str: monster.stats.str,
            dex: monster.stats.dex,
            con: monster.stats.con,
            int: monster.stats.int,
            wis: monster.stats.wis,
            cha: monster.stats.cha,
            immunities: monster.additionalProperties?.immunities || [],
            resistances: monster.additionalProperties?.resistances || [],
            vulnerabilities: monster.additionalProperties?.vulnerabilities || [],
            conditionImmunities: monster.additionalProperties?.conditionImmunities || [],
            actions: monster.actions || [{ name: "", description: "" }],
        });

        setImageUrl(monster.image || "");

        if (monster.speed) {
            const speedKeys = Object.keys(monster.speed) as (keyof typeof monster.speed)[];
            const speeds: SelectionValue[] = [];
            speedKeys.forEach(k => {
                if (monster.speed[k] !== undefined && monster.speed[k] > 0) {
                    speeds.push({ selection: k, value: monster.speed[k] });
                }
            });
            setSpeedValue(speeds);
        } else {
            setSpeedValue([]);
        }

        if (monster.senses) {
            const sensesKeys = Object.keys(monster.senses) as (keyof typeof monster.senses)[];
            const senses: SelectionValue[] = [];
            sensesKeys.forEach(k => {
                if (monster.senses[k] !== undefined && monster.senses[k] > 0) {
                    senses.push({ selection: k, value: monster.senses[k] });
                }
            });
            setSensesValue(senses);
        } else {
            setSensesValue([]);
        }

        if (monster.actions && monster.actions.length > 0) {
            setActionsValue(monster.actions);
        } else {
            setActionsValue([{ name: "", description: "" }]);
        }

    }, [monster, editMonsterForm]);

    const getMonsterData = async () => {
        const data = await getData();
        setMonster(data);
    };

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
        const newAction = { name: "", description: "" };
        setActionsValue((prev) => [...prev, newAction]);
        const currentActions = editMonsterForm.getFieldValue('actions') || [];
        editMonsterForm.setFieldsValue({ actions: [...currentActions, newAction] });
    };

    const handleUpdateActionName = (index: number, name: string) => {
        setActionsValue((prev) =>
            prev.map((a, i) => (i === index ? { ...a, name } : a))
        );
        const currentActions = editMonsterForm.getFieldValue('actions') || [];
        if (currentActions[index]) {
            currentActions[index].name = name;
            editMonsterForm.setFieldsValue({ actions: [...currentActions] });
        }
    };

    const handleUpdateActionDescription = (index: number, description: string) => {
        setActionsValue((prev) =>
            prev.map((a, i) => (i === index ? { ...a, description } : a))
        );
        const currentActions = editMonsterForm.getFieldValue('actions') || [];
        if (currentActions[index]) {
            currentActions[index].description = description;
            editMonsterForm.setFieldsValue({ actions: [...currentActions] });
        }
    };

    const handleDeleteAction = (index: number) => {
        setActionsValue((prev) => {
            const newActions = prev.filter((_, i) => i !== index);
            editMonsterForm.setFieldsValue({ actions: newActions });
            return newActions;
        });
    };

    const submitEditMonster: FormProps<EditMonsterFormValues>['onFinish'] = async (values) => {
        if (!monster) return;

        // Automatically filter out actions that have no name AND no description
        const filteredActions = actionsValue.filter(action => action.name.trim() !== "" || action.description.trim() !== "");

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

        const submitData: Monster = {
            ...monster,
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
                ...monster.stats,
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
            actions: filteredActions.length > 0 ? filteredActions : [{ name: "", description: "" }], // Still send at least one, backend will validate if they require it
        };

        setSubmitLoad(true);

        try {
            await onEditSubmit(submitData);
            handleCloseModal();
        } finally {
            setSubmitLoad(false);
        }
    };

    const handleCloseModal = () => {
        onClose();
    };

    return {
        monster,
        editMonsterForm,
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
        submitEditMonster,
        handleCloseModal,
    }
}
