
import { Button, Modal, Typography } from "antd";
import { EditOutlined, InfoCircleOutlined } from "@ant-design/icons";

// hooks
import useFactionDisplayModal from "@/hooks/faction/useFactionDisplayModal";
import { useTranslation } from "react-i18next";

// components
import DisplayModalSkeleton from "@/components/global/common/DisplayModalSkeleton";
import DisplaySectionHeader from "../global/common/DisplaySectionHeader";

// assets
import { noItemImage } from "@/assets";

// interfaces
import type { Faction } from "@/models/factionInterfaces";
interface Props {
    open: boolean;
    onClose: () => void;
    onEdit?: () => void;
    getFaction: () => Promise<Faction | null>;
}

const { Text, Title } = Typography;

export default function FactionDisplayModal({ open, onClose, onEdit, getFaction }: Props) {

    const {
        faction
    } = useFactionDisplayModal(getFaction);

    const { t } = useTranslation();

    return (
        <Modal
            open={open}
            footer={null}
            destroyOnHidden
            onCancel={onClose}
            width={'70rem'}
            centered
            style={{ margin: '2rem 0px' }}
            styles={{
                container: {
                    padding: '0px',
                    backgroundColor: '#f5f2ea',
                    overflow: 'hidden'
                },
                body: {
                    overflow: 'hidden',
                    height: '40rem',
                    maxHeight: 'calc(100vh - 8rem)',
                }
            }}
        >
            {faction ? (
                <div style={{ display: 'flex', height: '100%' }}>
                    <div style={styles.leftSideContent}>
                        <div style={styles.imagePreviewContainer}>
                            {faction.image ? (
                                <img src={faction.image} alt="Faction" style={styles.imagePreview} />
                            ) : (
                                <img src={noItemImage} alt="Faction" style={styles.imagePreview} />
                            )}
                        </div>
                        <div style={styles.factionDetails}>
                            <div style={styles.factionDetailsChild}>
                                <Text style={{ width: '30%', textTransform: 'uppercase' }}>{t('factions.color')}</Text>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <div style={{
                                        width: '1.5rem',
                                        height: '1.5rem',
                                        backgroundColor: faction.color,
                                        borderRadius: '4px',
                                        border: '1px solid #C2BAA6'
                                    }} />
                                    <Text strong>{faction.color.toUpperCase()}</Text>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style={styles.rightSideContent}>
                        <div style={styles.rightSideTitleContainer}>
                            <Title level={1} style={styles.rightSideTitle}>{faction.name}</Title>
                        </div>

                        <DisplaySectionHeader icon={<InfoCircleOutlined />} title={`${t('factions.description')}`.toUpperCase()} />
                        <div style={styles.descriptionText}>
                            {faction.description.split('\n').map((line, idx) => (
                                <p key={idx} style={{ margin: line.trim() ? '0 0 1rem 0' : '0' }}>{line}</p>
                            ))}
                        </div>

                        <div style={styles.editButtonContainer}>
                            <Button
                                icon={<EditOutlined />}
                                onClick={onEdit}
                                style={styles.editButton}
                            >
                                {t('global.edit')}
                            </Button>
                        </div>
                    </div>
                </div>
            ) : (
                <DisplayModalSkeleton />
            )}
        </Modal>
    )
}


const styles: { [key: string]: React.CSSProperties } = {
    leftSideContent: {
        width: '35%',
        height: '100%',
        minWidth: '24rem',
        overflowY: 'auto',
        scrollbarWidth: 'none',
        padding: '1.5rem',
    },
    rightSideContent: {
        flex: 1,
        overflowY: 'auto',
        scrollbarWidth: 'none',
        padding: '2rem',
        backgroundColor: '#FEFDFA',
        borderLeft: '1px solid #C2BAA6',
        display: 'flex',
        flexDirection: 'column',
    },
    editButtonContainer: {
        position: 'sticky',
        bottom: 0,
        marginTop: 'auto',
        paddingTop: '1rem',
        display: 'flex',
        justifyContent: 'flex-end',
    },
    editButton: {
        backgroundColor: '#d35400',
        borderColor: '#d35400',
        color: 'white',
        fontWeight: 'bold',
        padding: '1.2rem 1.8rem',
        borderRadius: '8px',
        opacity: '0.8',
        cursor: 'pointer',
    },
    imagePreviewContainer: {
        width: '100%',
        aspectRatio: '1 / 1',
        borderColor: '#f1efe5',
        borderWidth: '1.5px',
        borderStyle: 'solid',
        borderRadius: '8px',
        padding: '0',
        overflow: 'hidden',
        marginTop: '1rem',
        backgroundColor: 'white',
    },
    imagePreview: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        display: 'block',
    },
    factionDetails: {
        marginTop: '2rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.8rem',
    },
    factionDetailsChild: {
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid #e0dcd2ff',
        padding: '0.5rem 0px'
    },
    rightSideTitleContainer: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        marginBottom: '1.8rem'
    },
    rightSideTitle: {
        margin: 0,
        fontFamily: 'Georgia, serif',
        color: '#4a463d',
        fontWeight: 'normal'
    },
    descriptionText: {
        marginTop: '1rem',
        fontSize: '1rem',
        lineHeight: '1.6',
        color: '#4a463d'
    },
}
