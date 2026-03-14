import { BookOutlined, HomeOutlined, SettingOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";

// hooks
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";


type MenuItem = Required<MenuProps>['items'][number];

export default function useMainCommonWrap() {

    const { t } = useTranslation();
    const navigate = useNavigate();

    const menuItems: MenuItem[] = [
        {
            key: '1',
            icon: <HomeOutlined />,
            label: t('global.home'),
            onClick: () => navigate("/dashboard")
        },
        {
            key: '2',
            icon: <BookOutlined />,
            label: t('global.campaigns'),
            onClick: () => navigate("/campaigns")
        },
        {
            key: '3',
            icon: <SettingOutlined />,
            label: t('global.workshop'),
            onClick: () => navigate("/workshop")
        },
    ]

    return {
        menuItems,
    }
}