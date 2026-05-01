
import { Dropdown, Typography } from "antd";
import { EllipsisOutlined } from "@ant-design/icons";

// assets
import { noItemImage } from "@/assets";

// hooks
import useWorkshopFactionCard from "@/hooks/workshop/workshopFaction/useWorkshopFactionCard";

// interfaces
import type { WorkshopFactionReturn } from "@/models/factionInterfaces";

interface Props {
    faction: WorkshopFactionReturn;
    uponDelete: (workshopFactionId: number) => void;
    onClick?: () => void;
    onEditClick?: () => void;
}

const { Title, Paragraph } = Typography;

export default function WorkshopFactionCard({ faction, uponDelete, onClick, onEditClick }: Props) {

    const {
        items,
        isHovered,
        isMenuHovered,
        handleHover,
        handleMenuHover,
    } = useWorkshopFactionCard(faction, uponDelete, onEditClick);

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
                    src={faction.image ? faction.image : noItemImage}
                    alt={faction.name}
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
                <Title level={4} style={styles.title}>{faction.name}</Title>

                <Paragraph
                    ellipsis={{ rows: 2 }}
                    style={styles.description}
                    italic
                >
                    "{faction.description}"
                </Paragraph>

                <div style={{
                    height: '4px',
                    width: '100%',
                    backgroundColor: faction.color || '#000000',
                    borderRadius: '2px',
                    marginTop: 'auto'
                }} />
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
    title: {
        margin: '0 0 8px 0',
        lineHeight: 1.3
    },
    description: {
        fontSize: '15px',
        marginBottom: '12px',
        flex: 1,
    },
}
