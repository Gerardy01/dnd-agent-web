import { useState } from "react";
import type { MenuProps } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

// api
import { workshopRaceApi } from "@/api";

// hooks
import { useTranslation } from "react-i18next";
import useStaticModal from "@/hooks/global/useStaticModal";

export default function useWorkshopRaceCard(
    raceId: number,
    uponDelete: (raceId: number) => void,
    onEditClick?: () => void
) {
    const { t } = useTranslation();
    const { confirmationModal, serverErrorModal } = useStaticModal();

    const [isHovered, setIsHovered] = useState<boolean>(false);
    const [isMenuHovered, setIsMenuHovered] = useState<boolean>(false);

    const items: MenuProps['items'] = [
        {
            key: 'edit',
            label: t('global.edit'),
            icon: <EditOutlined />,
            onClick: (e) => {
                e.domEvent.stopPropagation();
                if (onEditClick) onEditClick();
            },
        },
        {
            key: 'delete',
            label: t('global.delete'),
            icon: <DeleteOutlined />,
            danger: true,
            onClick: (e) => {
                e.domEvent.stopPropagation();
                confirmationModal({
                    title: t('global.delete'),
                    content: "Are you sure you want to delete this race? This action cannot be undone.",
                    centered: true,
                    onOkWithPromise: onDelete,
                });
            },
        },
    ];

    const handleHover = (value: boolean) => {
        setIsHovered(value);
    }

    const handleMenuHover = (value: boolean) => {
        setIsMenuHovered(value);
    }

    const onDelete = async () => {
        const [err] = await workshopRaceApi.deleteRace(raceId);

        if (err) {
            serverErrorModal();
            return;
        }

        uponDelete(raceId);
    }

    return {
        items,
        isHovered,
        isMenuHovered,
        handleHover,
        handleMenuHover,
    }
}
