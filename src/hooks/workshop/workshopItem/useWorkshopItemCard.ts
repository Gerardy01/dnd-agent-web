import { useState } from "react";

// utils
import { RarityEnum } from "@/utils/enums";


export default function useWorkshopItemCard() {

    const [isHovered, setIsHovered] = useState<boolean>(false);
    const [isMenuHovered, setIsMenuHovered] = useState(false);

    const handleHover = (value: boolean) => {
        setIsHovered(value);
    }

    const handleMenuHover = (value: boolean) => {
        setIsMenuHovered(value);
    }

    const getRarityColor = (rarity: string) => {
        switch (rarity.toLowerCase()) {
            case RarityEnum.COMMON: return '#7f8c8d';
            case RarityEnum.UNCOMMON: return '#27ae60';
            case RarityEnum.RARE: return '#562973';
            case RarityEnum.VERY_RARE: return '#d35400';
            case RarityEnum.LEGENDARY: return '#f39c12';
            case RarityEnum.ARTIFACT: return '#e74c3c';
            default: return '#562973';
        }
    }

    const getCurrencyColor = (currency: string) => {
        switch (currency.toLowerCase()) {
            case 'copper': return '#B77729';
            case 'silver': return '#A5A9B4';
            case 'electrum': return '#59A5A9';
            case 'gold': return '#D4AF37';
            case 'platinum': return '#BCC6CC';
            default: return '#D4AF37';
        }
    }

    return {
        isHovered,
        isMenuHovered,
        handleHover,
        handleMenuHover,
        getRarityColor,
        getCurrencyColor,
    }
}