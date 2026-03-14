import { type MenuProps } from "antd"
import { LogoutOutlined, SettingOutlined } from "@ant-design/icons"

// hooks
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import useStaticModal from "./useStaticModal";

// stores
import useAccountStore from "@/stores/useAccountStore"



export default function useHeader() {

    const { t } = useTranslation();
    const navigate = useNavigate();

    const { confirmationModal } = useStaticModal();

    const { username } = useAccountStore();

    const items: MenuProps['items'] = [
        {
            key: '1',
            type: 'group',
            label: t("global.account"),
            children: [
                {
                    key: '1-1',
                    label: t("global.settings"),
                    icon: <SettingOutlined />,
                    onClick: () => navigate("/settings")
                },
            ]
        },
        {
            type: 'divider',
        },
        {
            key: '2',
            label: t("global.logout"),
            icon: <LogoutOutlined />,
            danger: true,
            onClick: () => confirmationModal({
                title: t("global.logout"),
                content: t("global.logoutConfirm"),
                centered: true,
                onOk: submitLogout
            })
        },
    ]

    const submitLogout = () => {
        navigate("/login");
    }

    return {
        items,
        username,
    }
}