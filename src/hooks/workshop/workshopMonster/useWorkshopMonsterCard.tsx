import { useState } from "react";
import type { MenuProps } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

// api
import { workshopMonsterApi } from "@/api";

// hooks
import { useTranslation } from "react-i18next";
import useStaticModal from "@/hooks/global/useStaticModal";

// interfaces
import type { WorkshopMonsterReturn } from "@/models/monsterInterfaces";

export default function useWorkshopMonsterCard(
    monster: WorkshopMonsterReturn,
    uponDelete: (workshopMonsterId: number) => void,
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
                    content: t('monsters.deleteConfirmDesc'),
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
        const [err] = await workshopMonsterApi.deleteMonster(monster.workshopMonsterId);

        if (err) {
            serverErrorModal();
            return;
        }

        uponDelete(monster.workshopMonsterId);
    }

    return {
        items,
        isHovered,
        isMenuHovered,
        handleHover,
        handleMenuHover,
    }
}
