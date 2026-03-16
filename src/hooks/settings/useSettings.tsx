import { useState } from "react";
import type { MenuProps } from "antd";
import { BarsOutlined, SettingOutlined, UserOutlined } from "@ant-design/icons";

// utils
import { SettingsMenuEnum } from "@/utils/enums";

// hooks
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";

// interfaces
type MenuItem = Required<MenuProps>['items'][number];

export default function useSettings() {

    const { t } = useTranslation();

    const [searchParams, setSearchParams] = useSearchParams();

    const [selectedKey, setSelectedKey] = useState<string>(searchParams.get("tab") || SettingsMenuEnum.PROFILE);

    const items: MenuItem[] = [
        {
            key: SettingsMenuEnum.PROFILE,
            label: t("settings.profile"),
            icon: <UserOutlined />,
            onClick: () => handleChangeTab(SettingsMenuEnum.PROFILE)
        },
        {
            key: SettingsMenuEnum.PREFERENCES,
            label: t("settings.preferences"),
            icon: <BarsOutlined />,
            onClick: () => handleChangeTab(SettingsMenuEnum.PREFERENCES)
        },
        {
            key: SettingsMenuEnum.ACCOUNT,
            label: t("settings.account"),
            icon: <SettingOutlined />,
            onClick: () => handleChangeTab(SettingsMenuEnum.ACCOUNT)
        },
    ];

    const handleChangeTab = (key: string) => {
        setSearchParams({ tab: key });
        setSelectedKey(key);
    }

    return {
        items,
        selectedKey,
    }
}