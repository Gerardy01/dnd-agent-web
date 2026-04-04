import { useState } from "react";
import type { MenuProps } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

// api
import { workshopItemApi } from "@/api";

// hooks
import { useTranslation } from "react-i18next";
import useStaticModal from "@/hooks/global/useStaticModal";

// utils
import { RarityEnum } from "@/utils/enums";


export default function useWorkshopItemCard(
    itemId: number,
    uponDelete: (workshopItemId: number) => void,
    onEditClick?: () => void,
) {

    const { t } = useTranslation();

    const { confirmationModal, serverErrorModal } = useStaticModal();

    const [isHovered, setIsHovered] = useState<boolean>(false);
    const [isMenuHovered, setIsMenuHovered] = useState(false);

    const items: MenuProps['items'] = [
        {
            key: '1',
            label: t('global.edit'),
            icon: <EditOutlined />,
            onClick: () => {
                onEditClick?.();
            }
        },
        {
            key: '2',
            label: t('global.delete'),
            icon: <DeleteOutlined />,
            onClick: () => {
                confirmationModal({
                    title: t('global.delete'),
                    content: t('items.deleteConfirmDesc'),
                    centered: true,
                    onOkWithPromise: onDelete,
                })
            }
        }
    ];

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

    const onDelete = async () => {
        const [err] = await workshopItemApi.deleteItem(itemId);

        if (err) {
            serverErrorModal();
            return;
        }

        uponDelete(itemId);
    }

    return {
        items,
        isHovered,
        isMenuHovered,
        handleHover,
        handleMenuHover,
        getRarityColor,
        getCurrencyColor,
    }
}