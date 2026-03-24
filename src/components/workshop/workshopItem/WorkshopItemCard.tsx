import { useState } from "react";
import { Tag, Typography } from "antd";
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
                    {item.rarity}
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
                        <div style={styles.pill}>
                            <SafetyOutlined style={{ marginRight: 6, opacity: 0.8 }} />
                            {item.armorProperties.baseAc}
                        </div>
                    )}
                </div>

                <Title level={4} style={styles.title}>{item.name}</Title>

                <Paragraph
                    ellipsis={{ rows: 2 }}
                    style={styles.description}>
                    {item.description}
                </Paragraph>

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
        height: '260px',
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
        fontSize: '12px',
        textTransform: 'capitalize'
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
        marginBottom: '16px'
    },
    pill: {
        display: 'flex',
        alignItems: 'center',
        padding: '4px 12px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: 'bold'
    },
    title: {
        margin: '0 0 8px 0',
        lineHeight: 1.3
    },
    description: {
        fontSize: '14px',
        marginBottom: '20px',
        flex: 1
    },
    footer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: '4px'
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