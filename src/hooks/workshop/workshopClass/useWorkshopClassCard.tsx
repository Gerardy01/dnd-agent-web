import { useState } from "react";
import type { MenuProps } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

// api
import { workshopClassApi } from "@/api";

// hooks
import { useTranslation } from "react-i18next";
import useStaticModal from "@/hooks/global/useStaticModal";

export default function useWorkshopClassCard(
    classId: number,
    uponDelete: (classId: number) => void,
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
                    content: t('classes.deleteConfirmDesc'),
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
        const [err] = await workshopClassApi.deleteClass(classId);

        if (err) {
            serverErrorModal();
            return;
        }

        uponDelete(classId);
    }

    return {
        items,
        isHovered,
        isMenuHovered,
        handleHover,
        handleMenuHover,
    }
}
