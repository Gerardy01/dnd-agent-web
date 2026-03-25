import { useState } from "react";

// utils
import { RarityEnum } from "@/utils/enums";


export default function useWorkshopItemCard() {

    const [isHovered, setIsHovered] = useState<boolean>(false);

    const handleHover = (value: boolean) => {
        setIsHovered(value);
    }

    const getRarityColor = (rarity: string) => {
        switch (rarity.toLowerCase()) {
            case RarityEnum.COMMON: return '#7f8c8d';
            case RarityEnum.UNCOMMON: return '#27ae60';
            case RarityEnum.RARE: return '#562973';
            case RarityEnum.VERY_RARE: return '#d35400';
            case RarityEnum.LEGENDARY: return '#f39c12';
            default: return '#562973';
        }
    }

    return {
        isHovered,
        handleHover,
        getRarityColor,
    }
}