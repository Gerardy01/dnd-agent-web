import { Divider, Dropdown, Tag, Typography } from "antd";
import { EllipsisOutlined } from "@ant-design/icons";

// assets
import { SparklesIcon, noItemImage } from "@/assets";

// hooks
import useWorkshopClassCard from "@/hooks/workshop/workshopClass/useWorkshopClassCard";

// interfaces
import type { WorkshopClassReturn } from "@/models/classInterfaces";
interface Props {
    item: WorkshopClassReturn;
    uponDelete: (workshopClassId: number) => void;
    onClick?: () => void;
    onEditClick?: () => void;
}

const { Title, Paragraph, Text } = Typography;


export default function WorkshopClassCard({ item, uponDelete, onClick, onEditClick }: Props) {

    const {
        items,
        isHovered,
        isMenuHovered,
        handleHover,
        handleMenuHover,
    } = useWorkshopClassCard(item.workshopClassId, uponDelete, onEditClick);

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
                    {item.spellcastingProperties && (
                        <Tag
                            color="purple"
                            variant="outlined"
                            style={styles.pill}

                        >
                            <SparklesIcon style={{ marginRight: 6, opacity: 0.8 }} />
                            Spellcaster
                        </Tag>
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
                        Hit Die
                    </Text>
                    <Text style={styles.cost}>
                        {item.hitDie}
                    </Text>
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
        fontWeight: 'bold',
        textTransform: 'uppercase'
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
