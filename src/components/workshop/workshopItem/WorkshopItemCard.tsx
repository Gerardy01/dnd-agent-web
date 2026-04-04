import { Divider, Dropdown, Tag, Typography } from "antd";
import { SafetyOutlined, EllipsisOutlined } from "@ant-design/icons";

// assets
import { ScaleIcon, CoinsIcon, noItemImage } from "@/assets";

// hooks
import useWorkshopItemCard from "@/hooks/workshop/workshopItem/useWorkshopItemCard";
import { useTranslation } from "react-i18next";

// interfaces
import type { WorkshopItemReturn } from "@/models/itemInterfaces";
interface Props {
    item: WorkshopItemReturn;
    uponDelete: (workshopItemId: number) => void;
    onClick?: () => void;
    onEditClick?: () => void;
}

const { Title, Paragraph, Text } = Typography;


export default function WorkshopItemCard({ item, uponDelete, onClick, onEditClick }: Props) {

    const {
        items,
        isHovered,
        isMenuHovered,
        handleHover,
        handleMenuHover,
        getRarityColor,
        getCurrencyColor,
    } = useWorkshopItemCard(item.workshopItemId, uponDelete, onEditClick);

    const { t } = useTranslation();

    return (
        <div
            style={{
                ...styles.container,
                boxShadow: isHovered ? '0 0 0px 2px orange' : 'none',
            }}
            onMouseEnter={() => handleHover(true)}
            onMouseLeave={() => handleHover(false)}
            onClick={onClick}
        >
            <div style={styles.imageContainer}>
                <img
                    src={item.image ? item.image : noItemImage}
                    alt={item.name}
                    style={{
                        ...styles.image,
                        transform: isHovered ? 'scale(1.07)' : 'scale(1)',
                        transition: 'transform 0.3s ease',
                    }}
                />
                <div style={{ ...styles.rarityBadge, backgroundColor: getRarityColor(item.rarity) }}>
                    {`${t(`items.${item.rarity}`)}`.toUpperCase()}
                </div>
                <Dropdown menu={{ items }} placement="bottom" trigger={['click']}>
                    <button
                        style={{
                            ...styles.menuButton,
                            opacity: isHovered ? (isMenuHovered ? 0.8 : 1) : 0,
                            transition: 'opacity 0.2s ease',
                        }}
                        onMouseEnter={() => handleMenuHover(true)}
                        onMouseLeave={() => handleMenuHover(false)}
                    >
                        <EllipsisOutlined style={{ fontSize: '0.8rem', color: 'white' }} />
                    </button>
                </Dropdown>
            </div>

            <div style={styles.content}>
                <div style={styles.tagRow}>
                    {item.equipSlot && (
                        <Tag
                            color="orange"
                            variant="outlined"
                            style={styles.pill}

                        >
                            {t(`items.${item.equipSlot}`)}
                        </Tag>
                    )}

                    {item.armorProperties && (
                        <Tag
                            color="orange"
                            variant="outlined"
                            style={styles.pill}
                        >
                            <SafetyOutlined style={{ marginRight: 6, opacity: 0.8 }} />
                            {item.armorProperties.baseAc}
                        </Tag>
                    )}

                    {item.weaponProperties && (
                        <>
                            {item.weaponProperties.damageRoll.length > 0 && (
                                <Tag
                                    color="orange"
                                    variant="outlined"
                                    style={styles.pill}
                                >
                                    {item.weaponProperties.damageRoll[0].count}d{item.weaponProperties.damageRoll[0].dice}{item.weaponProperties.damageRoll[0].bonus ? `+${item.weaponProperties.damageRoll[0].bonus}` : ''} {t(`effects.${item.weaponProperties.damageRoll[0].damageType}`)}
                                </Tag>
                            )}
                        </>
                    )}
                </div>

                <Title level={4} style={styles.title}>{item.name}</Title>

                <Paragraph
                    ellipsis={{ rows: 2 }}
                    style={styles.description}
                    italic
                >
                    "{item.description}"
                </Paragraph>

                <Divider style={{ margin: '0px' }} />

                <div style={styles.footer}>
                    <Text style={styles.weight}>
                        <ScaleIcon />
                        {Number(item.weight).toFixed(1)} {t('effects.lbs')}
                    </Text>
                    {item.cost > 0 && (
                        <Text style={styles.cost}>
                            <CoinsIcon style={{ color: getCurrencyColor(item.currencyUnit), marginRight: '5px' }} />
                            {item.cost} {item.currencyUnit && item.currencyUnit.length > 0 ? t(`items.${item.currencyUnit}`) : ''}
                        </Text>
                    )}
                </div>
            </div>
        </div>
    );
}



const styles: { [key: string]: React.CSSProperties } = {
    container: {
        width: '100%',
        height: '100%',
        backgroundColor: '#F5F1E7',
        borderRadius: '8px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid #C2BAA6',
        cursor: 'pointer',
        transition: 'box-shadow 0.3s ease',
    },
    imageContainer: {
        width: '100%',
        aspectRatio: '1/1',
        position: 'relative',
        backgroundColor: 'white',
    },
    image: {
        width: '100%',
        height: '100%',
        objectFit: 'cover'
    },
    rarityBadge: {
        position: 'absolute',
        top: '12px',
        left: '12px',
        padding: '3px 12px',
        borderRadius: '16px',
        color: 'white',
        fontWeight: 'bold',
        fontSize: '10px',
        textTransform: 'capitalize'
    },
    menuButton: {
        position: 'absolute',
        top: '12px',
        right: '12px',
        width: '1.5rem',
        aspectRatio: '1/1',
        borderRadius: '50%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        border: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        padding: 0,
    },
    content: {
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        flex: 1
    },
    tagRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: '16px',
        minHeight: '1.8rem'
    },
    pill: {
        display: 'flex',
        alignItems: 'center',
        padding: '0px 12px',
        borderRadius: '20px',
        fontSize: '10px',
        fontWeight: 'bold'
    },
    title: {
        margin: '0 0 8px 0',
        lineHeight: 1.3
    },
    description: {
        fontSize: '15px',
        marginBottom: '20px',
        flex: 1,
    },
    footer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: '0.8rem'
    },
    weight: {
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center'
    },
    cost: {
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center'
    }
};