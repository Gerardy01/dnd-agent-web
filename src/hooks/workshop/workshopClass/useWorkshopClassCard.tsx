import { useState } from "react";
import type { MenuProps } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

export default function useWorkshopClassCard(
    classId: number,
    uponDelete: (classId: number) => void,
    onEditClick?: () => void
) {
    const { t } = useTranslation();

    const [isHovered, setIsHovered] = useState<boolean>(false);
    const [isMenuHovered, setIsMenuHovered] = useState<boolean>(false);

    const items: MenuProps['items'] = [
        {
            key: 'edit',
            label: (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <EditOutlined style={{ marginRight: 8 }} />
                    {t('global.edit')}
                </div>
            ),
            onClick: (e) => {
                e.domEvent.stopPropagation();
                if (onEditClick) onEditClick();
            },
        },
        {
            key: 'delete',
            label: (
                <div style={{ display: 'flex', alignItems: 'center', color: '#ff4d4f' }}>
                    <DeleteOutlined style={{ marginRight: 8 }} />
                    {t('global.delete')}
                </div>
            ),
            onClick: (e) => {
                e.domEvent.stopPropagation();
                // TODO: Add delete logic later
                console.log("Delete class", classId);
                uponDelete(classId);
            },
        },
    ];

    const handleHover = (value: boolean) => {
        setIsHovered(value);
    }

    const handleMenuHover = (value: boolean) => {
        setIsMenuHovered(value);
    }

    return {
        items,
        isHovered,
        isMenuHovered,
        handleHover,
        handleMenuHover,
    }
}
