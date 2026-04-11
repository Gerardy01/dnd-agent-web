import { Modal, Typography, Button } from "antd";
import { InfoCircleOutlined, SafetyOutlined, EditOutlined } from "@ant-design/icons";

// components
import DisplayModalSkeleton from "@/components/global/common/DisplayModalSkeleton";
import DisplaySectionHeader from "@/components/global/common/DisplaySectionHeader";

// assets
import { noItemImage, SwordIcon } from "@/assets";

// hooks
import { useTranslation } from "react-i18next";
import useSpellDisplayModal from "@/hooks/spell/useSpellDisplayModal";

// interfaces
import type { WorkshopSpellReturn } from "@/models/spellInterfaces";
interface Props {
    open: boolean;
    onClose: () => void;
    onEdit?: () => void;
    getSpell: () => Promise<WorkshopSpellReturn | null>;
}

const { Text, Title } = Typography;



export default function SpellDisplayModal({ open, onClose, onEdit, getSpell }: Props) {

    const {
        spell
    } = useSpellDisplayModal(getSpell);

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
                    height: 'calc(100vh - 8rem)',
                }
            }}
        >
            {spell ? (
                <div style={{ display: 'flex', height: '100%' }}>
                    <div style={styles.leftSideContent}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={styles.levelBadge}>
                                {spell.level === 0 ? `${t('spells.cantrip')}`.toUpperCase() : `${`${t('spells.levelPrefix')}`.toUpperCase()}${spell.level}`}
                            </div>
                        </div>
                        <div style={styles.imagePreviewContainer}>
                            {spell.image ? (
                                <img src={spell.image} alt="Spell" style={styles.imagePreview} />
                            ) : (
                                <img src={noItemImage} alt="Spell" style={styles.imagePreview} />
                            )}
                        </div>
                        <div style={styles.itemDetails}>
                            {spell.school && (
                                <div style={styles.itemDetailsChild}>
                                    <Text style={{ width: '30%', textTransform: 'uppercase' }}>{t('spells.school')}</Text>
                                    <Text strong style={{ textAlign: 'right', textTransform: 'capitalize' }}>{spell.school}</Text>
                                </div>
                            )}
                            <div style={styles.itemDetailsChild}>
                                <Text style={{ width: '30%', textTransform: 'uppercase' }}>{t('spells.range')}</Text>
                                <Text strong style={{ textAlign: 'right' }}>{spell.range > 0 ? `${spell.range} ft` : 'Self'}</Text>
                            </div>
                        </div>
                    </div>
                    <div style={styles.rightSideContent}>
                        <div style={styles.rightSideTitleContainer}>
                            <Title level={1} style={styles.rightSideTitle}>{spell.name}</Title>
                        </div>

                        <DisplaySectionHeader icon={<InfoCircleOutlined />} title={`${t('items.description')}`.toUpperCase()} />
                        <div style={styles.descriptionText}>
                            {spell.description.split('\n').map((line, idx) => (
                                <p key={idx} style={{ margin: line.trim() ? '0 0 1rem 0' : '0' }}>{line}</p>
                            ))}
                        </div>

                        {spell.attackProperties && (
                            <>
                                <DisplaySectionHeader icon={<SwordIcon />} title={`${t('spells.spellProperties')}`.toUpperCase()} />
                                <div style={styles.weaponPropertiesBox}>
                                    <Text style={styles.propertyLabel}>{`${t('items.damageProfile')}`.toUpperCase()}</Text>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '0.5rem' }}>
                                        {spell.attackProperties.damageRoll.map((dr, index) => (
                                            <div key={index} style={styles.damageRollItem}>
                                                <Text style={styles.damageRollValue}>
                                                    {dr.count}d{dr.dice}{dr.bonus ? `+${dr.bonus}` : ''}
                                                </Text>
                                                <div style={styles.damageRollDivider}></div>
                                                <Text style={styles.damageRollType}>
                                                    {String(t(`effects.${dr.damageType}`)).toUpperCase()}
                                                </Text>
                                            </div>
                                        ))}
                                    </div>

                                </div>
                                {spell.attackProperties.requiresRangedAttackRoll && (
                                    <div style={styles.weaponPropCard}>
                                        <Text strong style={styles.weaponPropName}>{t('spells.requiresRangedAttack')}</Text>
                                        <Text style={styles.weaponPropDesc}>{t('spells.requiresRangedAttackDesc')}</Text>
                                    </div>
                                )}
                            </>
                        )}

                        {spell.spellSaveProperties && (
                            <>
                                <DisplaySectionHeader icon={<SafetyOutlined />} title={`${t('spells.requiresSpellSave')}`.toUpperCase()} />
                                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                                    <div style={styles.propertyBox}>
                                        <Text style={styles.propertyLabel}>{`${t('spells.savingThrowStat')}`.toUpperCase()}</Text><br />
                                        <Text style={styles.propertyValue}>{t(`items.${spell.spellSaveProperties.stat}Short`)}</Text>
                                    </div>
                                    <div style={styles.propertyBox}>
                                        <Text style={styles.propertyLabel}>{`${t('spells.successDamageAdj')}`.toUpperCase()}</Text><br />
                                        <Text style={styles.propertyValue}>{spell.spellSaveProperties.onSuccessDamagePercentage}%</Text>
                                    </div>
                                    <div style={styles.propertyBox}>
                                        <Text style={styles.propertyLabel}>{`${t('spells.failDamageAdj')}`.toUpperCase()}</Text><br />
                                        <Text style={styles.propertyValue}>{spell.spellSaveProperties.onFailDamagePercentage}%</Text>
                                    </div>
                                </div>
                            </>
                        )}


                        <div style={styles.editButtonContainer}>
                            <Button
                                icon={<EditOutlined />}
                                onClick={() => {
                                    onClose();
                                    onEdit?.();
                                }}
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
    );
}

const styles: { [key: string]: React.CSSProperties } = {
    leftSideContent: {
        width: '35%',
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
    levelBadge: {
        display: 'inline-block',
        padding: '3px 12px',
        borderRadius: '16px',
        color: '#ffffff',
        backgroundColor: '#2c3e50',
        fontWeight: 'bold',
        fontSize: '10px',
        letterSpacing: '0.5px'
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
    itemDetails: {
        marginTop: '2rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.8rem',
    },
    itemDetailsChild: {
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
    propertyBox: {
        width: '30%',
        border: '1px solid #d3c9b3',
        borderRadius: '4px',
        padding: '1rem',
        backgroundColor: '#fcfbf9'
    },
    propertyLabel: {
        fontSize: '0.8rem',
        fontWeight: 'bold',
        color: '#8c8069',
        letterSpacing: '1px'
    },
    propertyValue: {
        fontFamily: 'Georgia, serif',
        fontSize: '1.6rem',
        fontWeight: 'bold',
        color: '#4a463d'
    },
    weaponPropertiesBox: {
        marginTop: '1rem',
        border: '1px solid #d3c9b3',
        borderRadius: '8px',
        padding: '1.2rem',
        backgroundColor: '#fcfbf9'
    },
    damageRollItem: {
        border: '1px solid #d3c9b3',
        borderRadius: '4px',
        padding: '0.5rem 1rem',
        display: 'inline-flex',
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
    damageRollValue: {
        fontFamily: 'Georgia, serif',
        fontSize: '1.2rem',
        fontWeight: 'bold',
        color: '#d35400',
        marginRight: '0.8rem'
    },
    damageRollDivider: {
        width: '1px',
        height: '1.5rem',
        backgroundColor: '#d3c9b3',
        marginRight: '0.8rem'
    },
    damageRollType: {
        fontSize: '0.7rem',
        fontWeight: 'bold',
        color: '#8c8069',
        letterSpacing: '1px'
    },
    weaponPropCard: {
        border: '1px solid #d3c9b3',
        borderRadius: '6px',
        padding: '0.8rem 1rem',
        backgroundColor: '#fcfbf9',
        marginTop: '1rem'
    },
    weaponPropName: {
        display: 'block',
        fontSize: '1rem',
        color: '#4a463d',
        marginBottom: '0.25rem'
    },
    weaponPropDesc: {
        fontSize: '0.9rem',
        color: '#8c8069',
        lineHeight: '1.5'
    },
}