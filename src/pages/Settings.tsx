import { Menu, Typography } from "antd";

// components
import Wrapper from "@/components/global/Wrapper";
import Profile from "@/components/settings/Profile";
import Preferences from "@/components/settings/Preferences";
import Account from "@/components/settings/Account";

// utils
import { SettingsMenuEnum } from "@/utils/enums";

// hooks
import useSettings from "@/hooks/settings/useSettings";
import { useTranslation } from "react-i18next";

const { Title } = Typography;

export default function Settings() {

    const {
        items,
        selectedKey,
    } = useSettings();

    const { t } = useTranslation();

    return (
        <Wrapper width={76}>
            <div style={styles.contianer}>
                <div style={styles.sidebar}>
                    <div style={styles.sidebarHeader}>
                        <Title level={3} style={styles.title}>{t("settings.title")}</Title>
                        <Menu
                            items={items}
                            mode="inline"
                            selectedKeys={[selectedKey]}
                            inlineCollapsed={false}
                            style={{
                                backgroundColor: '#EAE3D2',
                                border: 'none',
                            }}
                        />
                    </div>
                </div>
                <div style={styles.content}>
                    {selectedKey === SettingsMenuEnum.PROFILE && <Profile />}
                    {selectedKey === SettingsMenuEnum.PREFERENCES && <Preferences />}
                    {selectedKey === SettingsMenuEnum.ACCOUNT && <Account />}
                </div>
            </div>
        </Wrapper>
    )
}

const styles: { [key: string]: React.CSSProperties } = {
    contianer: {
        width: '100%',
        display: 'flex',
        padding: '1rem 2rem',
    },
    sidebar: {
        width: '230px',
        paddingTop: '4rem'
    },
    title: {
        marginBottom: '2rem',
    },
    content: {
        padding: '0px 2rem',
        flex: 1,
    }
}