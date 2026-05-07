import { Dropdown, Tag, Typography } from "antd";
import { EllipsisOutlined, TrophyOutlined } from "@ant-design/icons";

// assets
import { noItemImage } from "@/assets";

// hooks
import useWorkshopMonsterCard from "@/hooks/workshop/workshopMonster/useWorkshopMonsterCard";
import { useTranslation } from "react-i18next";

// interfaces
import type { WorkshopMonsterReturn } from "@/models/monsterInterfaces";
interface Props {
    monster: WorkshopMonsterReturn;
    uponDelete: (workshopMonsterId: number) => void;
    onClick?: () => void;
    onEditClick?: () => void;
}

const { Title, Paragraph } = Typography;

export default function WorkshopMonsterCard({ monster, uponDelete, onClick, onEditClick }: Props) {

    const {
        items,
        isHovered,
        isMenuHovered,
        handleHover,
        handleMenuHover,
    } = useWorkshopMonsterCard(monster, uponDelete, onEditClick);

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
                    src={monster.image ? monster.image : noItemImage}
                    alt={monster.name}
                    style={{
                        ...styles.image,
                        transform: isHovered ? 'scale(1.07)' : 'scale(1)',
                        transition: 'transform 0.3s ease',
                    }}
                />
                <div style={styles.typeBadge}>
                    {`${t(`monsters.${monster.type}`)}`.toUpperCase()}
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
                        onClick={(e) => e.stopPropagation()}
                    >
                        <EllipsisOutlined style={{ fontSize: '0.8rem', color: 'white' }} />
                    </button>
                </Dropdown>
            </div>

            <div style={styles.content}>
                <div style={styles.tagRow}>
                    <Tag color="orange" variant="outlined" style={styles.pill}>
                        {t(`monsters.${monster.size}`)}
                    </Tag>
                    <Tag color="orange" variant="outlined" style={styles.pill}>
                        <TrophyOutlined style={{ marginRight: 6, opacity: 0.8 }} />
                        CR {monster.stats.cr}
                    </Tag>
                </div>

                <Title level={4} style={styles.title}>{monster.name}</Title>

                <Paragraph
                    ellipsis={{ rows: 2 }}
                    style={styles.description}
                    italic
                >
                    "{monster.description}"
                </Paragraph>

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
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        aspectRatio: '1/1',
        objectFit: 'cover'
    },
    typeBadge: {
        position: 'absolute',
        top: '12px',
        left: '12px',
        padding: '3px 12px',
        borderRadius: '16px',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
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
        fontSize: '14px',
        marginBottom: '16px',
        flex: 1,
    },
    footer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: '0.8rem'
    },
    footerText: {
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center',
        fontSize: '12px'
    }
};
