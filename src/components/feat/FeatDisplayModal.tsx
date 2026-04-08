import { Button, Divider, Modal, Typography } from "antd";
import { EditOutlined, InfoCircleOutlined, SnippetsOutlined } from "@ant-design/icons";

// hooks
import useFeatDisplayModal from "@/hooks/feat/useFeatDisplayModal";
import { useTranslation } from "react-i18next";

// components
import DisplayModalSkeleton from "@/components/global/common/DisplayModalSkeleton";

// assets
import { AwardIcon, noItemImage } from "@/assets";

// interfaces
import type { Feat } from "@/models/featInterfaces";
interface Props {
    open: boolean;
    onClose: () => void;
    onEdit?: () => void;
    getFeat: () => Promise<Feat | null>;
}

const { Text, Title } = Typography;


const SectionHeader = ({ icon, title }: { icon: React.ReactNode, title: string }) => (
    <div style={{ marginTop: '2rem' }}>
        <div style={styles.headerContent}>
            <span style={{ fontSize: '1.2rem', display: 'flex' }}>{icon}</span>
            <Text strong style={styles.headerTitle}>{title}</Text>
        </div>
        <Divider style={{ margin: 0, borderColor: '#d3c9b3' }} />
    </div>
);

export default function FeatDisplayModal({ open, onClose, onEdit, getFeat }: Props) {

    const {
        feat
    } = useFeatDisplayModal(getFeat);

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
            {feat ? (
                <div style={{ display: 'flex', height: '100%' }}>
                    <div style={styles.leftSideContent}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            {feat.category && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <AwardIcon style={{ fontSize: '1.2rem', color: '#d35400' }} />
                                    <Text strong style={{ fontSize: '1.2rem' }}>{t(`feats.${feat.category}`)}</Text>
                                </div>
                            )}
                        </div>
                        <div style={styles.imagePreviewContainer}>
                            {feat.image ? (
                                <img src={feat.image} alt="Item" style={styles.imagePreview} />
                            ) : (
                                <img src={noItemImage} alt="Item" style={styles.imagePreview} />
                            )}
                        </div>
                    </div>
                    <div style={styles.rightSideContent}>
                        <div style={styles.rightSideTitleContainer}>
                            <Title level={1} style={styles.rightSideTitle}>{feat.name}</Title>
                        </div>

                        <SectionHeader icon={<InfoCircleOutlined />} title={`${t('feats.description')}`.toUpperCase()} />
                        <div style={styles.descriptionText}>
                            {feat.description.split('\n').map((line, idx) => (
                                <p key={idx} style={{ margin: line.trim() ? '0 0 1rem 0' : '0' }}>{line}</p>
                            ))}
                        </div>

                        {feat.minLevel && (
                            <>
                                <SectionHeader icon={<SnippetsOutlined />} title={`${t('feats.prerequisites')}`.toUpperCase()} />
                                <div style={styles.prerequisitesContainer}>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <Text style={styles.prerequisiteLabel}>{`${t('feats.level')}`.toUpperCase()} :</Text>
                                        <Text strong>{feat.minLevel}</Text>
                                    </div>
                                </div>
                            </>
                        )}

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
    headerContent: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.6rem',
        color: '#8c8069',
        marginBottom: '0.5rem'
    },
    headerTitle: {
        fontSize: '0.9rem',
        letterSpacing: '1.5px',
        color: '#8c8069',
        fontFamily: 'Georgia, serif'
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
    prerequisitesContainer: {
        marginTop: '1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
    },
    prerequisiteLabel: {
        fontSize: '0.8rem',
        fontWeight: 'bold',
        color: '#8c8069',
        letterSpacing: '1px',
        width: '160px',
    },
}