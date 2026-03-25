import { useState } from "react";
import { Divider, Tag, Typography } from "antd";
import { SafetyOutlined } from "@ant-design/icons";

// assets
import { ScaleIcon, CoinsIcon, noItemImage } from "@/assets";

// utils
import { RarityEnum } from "@/utils/enums";

// interfaces
import type { WorkshopItemReturn } from "@/models/itemInterfaces";
interface Props {
    item: WorkshopItemReturn;
}

const { Title, Paragraph, Text } = Typography;


export default function WorkshopItemCard({ item }: Props) {

    const [isHovered, setIsHovered] = useState(false);

    function getRarityColor(rarity: string) {
        switch (rarity.toLowerCase()) {
            case RarityEnum.COMMON: return '#7f8c8d';
            case RarityEnum.UNCOMMON: return '#27ae60';
            case RarityEnum.RARE: return '#562973';
            case RarityEnum.VERY_RARE: return '#d35400';
            case RarityEnum.LEGENDARY: return '#f39c12';
            default: return '#562973';
        }
    }

    return (
        <div
            style={{
                ...styles.container,
                boxShadow: isHovered ? '0 0 0px 2px orange' : 'none',
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
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
                    {item.rarity.toUpperCase()}
                </div>
            </div>

            <div style={styles.content}>
                <div style={styles.tagRow}>
                    {item.equipSlot && (
                        <Tag
                            color="orange"
                            variant="outlined"
                            style={styles.pill}

                        >
                            {item.equipSlot}
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
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {item.weaponProperties.damageRoll.map(item => (
                                <Tag
                                    color="orange"
                                    variant="outlined"
                                    style={styles.pill}
                                >
                                    {item.count}d{item.dice}{item.bonus ? `+${item.bonus}` : ''} {item.damageType}
                                </Tag>
                            ))}
                        </div>
                    )}
                </div>

                <Title level={4} style={styles.title}>{item.name}</Title>

                <Paragraph
                    ellipsis={{ rows: 4 }}
                    style={styles.description}
                    italic
                >
                    "{item.description}"
                </Paragraph>

                <Divider style={{ margin: '0px' }} />

                <div style={styles.footer}>
                    <Text style={styles.weight}>
                        <ScaleIcon />
                        {Number(item.weight).toFixed(1)} lb.
                    </Text>
                    <Text style={styles.cost}>
                        <CoinsIcon />
                        {item.cost} {item.currencyUnit && item.currencyUnit.length > 0 ? item.currencyUnit : ''}
                    </Text>
                </div>
            </div>
        </div>
    );
}



const styles: { [key: string]: React.CSSProperties } = {
    container: {
        width: '100%',
        maxWidth: '320px',
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
        height: '240px',
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
    content: {
        padding: '16px',
        minHeight: '15rem',
        display: 'flex',
        flexDirection: 'column',
        flex: 1
    },
    tagRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: '16px'
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