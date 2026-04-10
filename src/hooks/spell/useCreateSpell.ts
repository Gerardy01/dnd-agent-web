import { useState, useEffect } from "react";
import { Form, type FormProps } from "antd";

import { DamageTypeEnum } from "@/utils/enums";
import { DICE_SELECTION } from "@/constants/selections";
import useReferenceStore from "@/stores/useReferenceStore";
import { useTranslation } from "react-i18next";

import type { CreateSpellDTO, DamageRoll } from "@/models/spellInterfaces";

interface CreateSpellFormValues {
    name: string;
    description: string;
    level: number;
    range?: number;
    school: string;
    savingThrowStat?: string;
}

export default function useCreateSpell(
    onClose: () => void,
    onCreateSubmit: (data: CreateSpellDTO) => Promise<void>
) {

    const { t } = useTranslation();
    const { effectOptions, spellOptions } = useReferenceStore();

    const [createSpellForm] = Form.useForm();
    const [submitLoad, setSubmitLoad] = useState<boolean>(false);
    const [imageUrl, setImageUrl] = useState<string>("");

    const [isAttack, setIsAttack] = useState<boolean>(false);
    const [requiresRangedAttack, setRequiresRangedAttack] = useState<boolean>(false);
    const [damageRollValue, setDamageRollValue] = useState<DamageRoll[]>([]);
    const [damageRollErrMsg, setDamageRollErrMsg] = useState<string>('');

    const [isSave, setIsSave] = useState<boolean>(false);
    const [successDamageAdj, setSuccessDamageAdj] = useState<number>(50);
    const [failDamageAdj, setFailDamageAdj] = useState<number>(100);

    const spellLevelSelection = [
        { label: t('spells.cantrip'), value: 0 },
        ...Array.from({ length: 9 }, (_, i) => ({
            label: `${t('spells.levelPrefix')}${i + 1}`,
            value: i + 1,
        }))
    ];

    const spellSchoolSelection = [
        { label: t('spells.none'), value: '' },
        ...spellOptions.spellSchools.map((school) => ({
            label: school.charAt(0).toUpperCase() + school.slice(1),
            value: school,
        }))
    ];

    const savingThrowStatSelection = spellOptions.savingThrowStats.map((stat) => ({
        label: t(`items.${stat}Short`),
        value: stat,
    }));

    const damageTypeSelection = effectOptions.damageTypes.map((damageType) => ({
        label: t(`effects.${damageType}`),
        value: damageType,
    }));

    const diceSelection = DICE_SELECTION.map((dice) => ({
        label: dice,
        value: dice,
    }));

    useEffect(() => {
        if (isAttack) return;
        setDamageRollValue([]);
        setDamageRollErrMsg('');
        setRequiresRangedAttack(false);
    }, [isAttack]);

    useEffect(() => {
        if (!isSave) {
            createSpellForm.setFieldValue('savingThrowStat', undefined);
            setSuccessDamageAdj(50);
            setFailDamageAdj(100);
        }
    }, [isSave]);

    const handleFileChange = (url: string) => {
        setImageUrl(url);
    };

    const handleAddDamageRoll = () => {
        setDamageRollValue((prev) => [...prev, { count: 1, dice: 6, bonus: 0, damageType: DamageTypeEnum.ACID }]);
        setDamageRollErrMsg("");
    };

    const handleUpdateDamageRollCount = (index: number, count: number) => {
        setDamageRollValue((prev) =>
            prev.map((r, i) => (i === index ? { ...r, count } : r))
        );
    };

    const handleUpdateDamageRollDice = (index: number, dice: number) => {
        setDamageRollValue((prev) =>
            prev.map((r, i) => (i === index ? { ...r, dice } : r))
        );
    };

    const handleUpdateDamageRollBonus = (index: number, bonus: number) => {
        setDamageRollValue((prev) =>
            prev.map((r, i) => (i === index ? { ...r, bonus } : r))
        );
    };

    const handleUpdateDamageRollType = (index: number, damageType: string) => {
        setDamageRollValue((prev) =>
            prev.map((r, i) => (i === index ? { ...r, damageType } : r))
        );
    };

    const handleDeleteDamageRoll = (index: number) => {
        setDamageRollValue((prev) => prev.filter((_, i) => i !== index));
    };

    const submitCreateSpell: FormProps<CreateSpellFormValues>['onFinish'] = async (values) => {
        if (isAttack && damageRollValue.length === 0) {
            setDamageRollErrMsg(t('spells.damageRollErrMsg'));
            return;
        }

        const attackProperties = isAttack ? {
            requiresRangedAttackRoll: requiresRangedAttack,
            damageRoll: damageRollValue,
        } : null;

        const spellSaveProperties = isSave && values.savingThrowStat ? {
            stat: values.savingThrowStat,
            onSuccessDamagePercentage: successDamageAdj,
            onFailDamagePercentage: failDamageAdj,
        } : null;

        const submitData: CreateSpellDTO = {
            image: imageUrl,
            name: values.name,
            description: values.description,
            level: values.level,
            range: values.range ?? 0,
            school: values.school,
            attackProperties,
            spellSaveProperties,
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
        createSpellForm.resetFields();
        setImageUrl("");
        setIsAttack(false);
        setRequiresRangedAttack(false);
        setDamageRollValue([]);
        setDamageRollErrMsg("");
        setIsSave(false);
        setSuccessDamageAdj(50);
        setFailDamageAdj(100);
    };

    const handleCloseModal = () => {
        restartForm();
        onClose();
    };

    return {
        createSpellForm,
        submitLoad,
        isAttack,
        setIsAttack,
        requiresRangedAttack,
        setRequiresRangedAttack,
        damageRollValue,
        damageRollErrMsg,
        isSave,
        setIsSave,
        successDamageAdj,
        setSuccessDamageAdj,
        failDamageAdj,
        setFailDamageAdj,
        spellLevelSelection,
        spellSchoolSelection,
        savingThrowStatSelection,
        damageTypeSelection,
        diceSelection,
        handleFileChange,
        handleAddDamageRoll,
        handleUpdateDamageRollCount,
        handleUpdateDamageRollDice,
        handleUpdateDamageRollBonus,
        handleUpdateDamageRollType,
        handleDeleteDamageRoll,
        submitCreateSpell,
        handleCloseModal,
    }
}