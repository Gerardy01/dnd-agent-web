import { useState } from "react";

// utils
import { WorkshopMenuEnum } from "@/utils/enums";

// assets
import {
    WorldsIcon,
    CharactersIcon,
    RacesIcon,
    ClassesIcon,
    FactionsIcon,
    MonstersIcon,
    ItemsIcon,
    SpellsIcon,
    FeatsIcon
} from "@/assets";

// hooks
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";

// interfaces
interface WorkshopMenuItem {
    label: string;
    key: string;
    icon?: React.ReactNode;
    onClick?: () => void;
}



export default function useWorkshop() {

    const { t } = useTranslation();

    const [searchParams, setSearchParams] = useSearchParams();

    const [selectedMenu, setSelectedMenu] = useState<string>(searchParams.get("tab") || WorkshopMenuEnum.WORLDS);

    const menuItems: WorkshopMenuItem[] = [
        {
            label: t('workshop.worlds'),
            key: WorkshopMenuEnum.WORLDS,
            icon: <WorldsIcon />,
            onClick: () => handleChangetab(WorkshopMenuEnum.WORLDS),
        },
        {
            label: t('workshop.characters'),
            key: WorkshopMenuEnum.CHARACTERS,
            icon: <CharactersIcon />,
            onClick: () => handleChangetab(WorkshopMenuEnum.CHARACTERS),
        },
        {
            label: t('workshop.races'),
            key: WorkshopMenuEnum.RACES,
            icon: <RacesIcon />,
            onClick: () => handleChangetab(WorkshopMenuEnum.RACES),
        },
        {
            label: t('workshop.classes'),
            key: WorkshopMenuEnum.CLASSES,
            icon: <ClassesIcon />,
            onClick: () => handleChangetab(WorkshopMenuEnum.CLASSES),
        },
        {
            label: t('workshop.factions'),
            key: WorkshopMenuEnum.FACTIONS,
            icon: <FactionsIcon />,
            onClick: () => handleChangetab(WorkshopMenuEnum.FACTIONS),
        },
        {
            label: t('workshop.monsters'),
            key: WorkshopMenuEnum.MONSTERS,
            icon: <MonstersIcon />,
            onClick: () => handleChangetab(WorkshopMenuEnum.MONSTERS),
        },
        {
            label: t('workshop.items'),
            key: WorkshopMenuEnum.ITEMS,
            icon: <ItemsIcon />,
            onClick: () => handleChangetab(WorkshopMenuEnum.ITEMS),
        },
        {
            label: t('workshop.spells'),
            key: WorkshopMenuEnum.SPELLS,
            icon: <SpellsIcon />,
            onClick: () => handleChangetab(WorkshopMenuEnum.SPELLS),
        },
        {
            label: t('workshop.feats'),
            key: WorkshopMenuEnum.FEATS,
            icon: <FeatsIcon />,
            onClick: () => handleChangetab(WorkshopMenuEnum.FEATS),
        },
    ]

    const handleChangetab = (key: string) => {
        setSearchParams({ tab: key });
        setSelectedMenu(key);
    }

    return {
        menuItems,
        selectedMenu,
    };
}