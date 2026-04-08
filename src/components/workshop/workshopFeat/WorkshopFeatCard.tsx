import { Dropdown, Tag, Typography } from "antd";
import { EllipsisOutlined } from "@ant-design/icons";

// assets
import { noItemImage } from "@/assets";

// hooks
import useWorkshopFeatCard from "@/hooks/workshop/workshopFeat/useWorkshopFeatCard";
import { useTranslation } from "react-i18next";

// interfaces
import type { WorkshopFeatReturn } from "@/models/featInterfaces";
interface Props {
    feat: WorkshopFeatReturn;
    uponDelete: (workshopFeatId: number) => void;
    onClick?: () => void;
    onEditClick?: () => void;
}

const { Title, Paragraph } = Typography;


export default function WorkshopFeatCard({ feat, uponDelete, onClick, onEditClick }: Props) {

    const {
        items,
        isHovered,
        isMenuHovered,
        handleHover,
        handleMenuHover,
    } = useWorkshopFeatCard(feat, uponDelete, onEditClick);

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
                    src={feat.image ? feat.image : noItemImage}
                    alt={feat.name}
                    style={{
                        ...styles.image,
                        transform: isHovered ? 'scale(1.07)' : 'scale(1)',
                        transition: 'transform 0.3s ease',
                    }}
                />
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
                    {(feat.minLevel && feat.minLevel !== 0) ? (
                        <Tag
                            color="orange"
                            variant="outlined"
                            style={styles.pill}

                        >
                            {t('global.Lvl')} : {feat.minLevel}
                        </Tag>
                    ) : (
                        <div />
                    )}

                    {feat.category && (
                        <Tag
                            color="orange"
                            variant="outlined"
                            style={styles.pill}

                        >
                            {t(`feats.${feat.category}`)}
                        </Tag>
                    )}
                </div>

                <Title level={4} style={styles.title}>{feat.name}</Title>

                <Paragraph
                    ellipsis={{ rows: 2 }}
                    style={styles.description}
                    italic
                >
                    "{feat.description}"
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
}