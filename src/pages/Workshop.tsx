import { Typography, Menu } from "antd";

// utils
import { WorkshopMenuEnum } from "@/utils/enums";

// hooks
import useWorkshop from "@/hooks/workshop/useWorkshop";
import { useTranslation } from "react-i18next";

// components
import Wrapper from "@/components/global/Wrapper";
import WorkshopItem from "@/components/workshop/workshopItem/WorkshopItem";
import WorkshopFeat from "@/components/workshop/workshopFeat/WorkshopFeat";

const { Title, Text } = Typography;



export default function Workshop() {

    const {
        menuItems,
        selectedMenu,
    } = useWorkshop();

    const { t } = useTranslation();

    return (
        <Wrapper>
            <div style={styles.container}>
                <Title style={{ marginBottom: '1rem' }}>{t('workshop.title')}</Title>
                <Text>{t('workshop.description')}</Text>

                <Menu
                    mode="horizontal"
                    selectedKeys={[selectedMenu]}
                    items={menuItems.map(menu => {
                        return {
                            label: menu.label,
                            key: menu.key,
                            icon: menu.icon,
                            onClick: menu.onClick,
                            style: { ...styles.menuItem }
                        }
                    })}
                    style={styles.menu}
                />

                {
                    selectedMenu === WorkshopMenuEnum.ITEMS && (
                        <WorkshopItem />
                    )
                }

                {
                    selectedMenu === WorkshopMenuEnum.FEATS && (
                        <WorkshopFeat />
                    )
                }

            </div>
        </Wrapper>
    );
}

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        width: '100%',
        padding: '1rem',
    },
    menu: {
        width: '100%',
        backgroundColor: '#EAE3D2',
        marginTop: '4rem',
        display: 'flex',
        justifyContent: 'space-between',
    },
    menuItem: {
        width: '11%',
        textAlign: 'center',
        padding: '0px',
        fontSize: '1.1rem',
    }
};