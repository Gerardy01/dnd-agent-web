import { useState } from "react";
import type { MenuProps } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

// api
import { workshopFeatApi } from "@/api";

// hooks
import { useTranslation } from "react-i18next";
import useStaticModal from "@/hooks/global/useStaticModal";

// interfaces
import type { WorkshopFeatReturn } from "@/models/featInterfaces";

export default function useWorkshopFeatCard(
    feat: WorkshopFeatReturn,
    uponDelete: (workshopFeatId: number) => void,
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
            onClick: (info) => {
                info.domEvent.stopPropagation();
                onEditClick?.();
            }
        },
        {
            key: '2',
            label: t('global.delete'),
            icon: <DeleteOutlined />,
            onClick: (info) => {
                info.domEvent.stopPropagation();
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

    const onDelete = async () => {
        const [err] = await workshopFeatApi.deleteFeat(feat.workshopFeatId);

        if (err) {
            serverErrorModal();
            return;
        }

        uponDelete(feat.workshopFeatId);
    }

    return {
        items,
        isHovered,
        isMenuHovered,
        handleHover,
        handleMenuHover,
    }
}