import { BookOutlined, HomeOutlined, SettingOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";

// hooks
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

// utils
import { SidebarMenuEnum } from "@/utils/enums";

// stores
import useSidebarStore from "@/stores/useSIdebarStore";
import { useEffect } from "react";
import Text from "antd/es/typography/Text";

// interfaces
type MenuItem = Required<MenuProps>['items'][number];


export default function useMainCommonWrap() {

    const { t } = useTranslation();
    const navigate = useNavigate();

    const { selectedSidebar, setSelectedSidebar } = useSidebarStore();

    const menuItems: MenuItem[] = [
        {
            key: SidebarMenuEnum.DASHBOARD,
            icon: <HomeOutlined />,
            label: t("global.home"),
            onClick: () => {
                navigate("/dashboard");
                setSelectedSidebar(SidebarMenuEnum.DASHBOARD);
            }
        },
        {
            key: SidebarMenuEnum.CAMPAIGNS,
            icon: <BookOutlined />,
            label: t('global.campaigns'),
            onClick: () => {
                navigate("/campaigns");
                setSelectedSidebar(SidebarMenuEnum.CAMPAIGNS);
            }
        },
        {
            key: SidebarMenuEnum.WORKSHOP,
            icon: <SettingOutlined />,
            label: t('global.workshop'),
            onClick: () => {
                navigate("/workshop");
                setSelectedSidebar(SidebarMenuEnum.WORKSHOP);
            }
        },
    ]

    useEffect(() => {
        selectedSidebarInit();
    }, []);

    const selectedSidebarInit = () => {
        const path = window.location.pathname;
        if (path === "/dashboard") {
            setSelectedSidebar(SidebarMenuEnum.DASHBOARD);
        }

        if (path === "/campaigns") {
            setSelectedSidebar(SidebarMenuEnum.CAMPAIGNS);
        }

        if (path === "/workshop") {
            setSelectedSidebar(SidebarMenuEnum.WORKSHOP);
        }
    }

    return {
        menuItems,
        selectedSidebar,
    }
}