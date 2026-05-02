import { Modal, Typography, Tag, Button } from "antd";
import { InfoCircleOutlined, EditOutlined, ThunderboltOutlined, CodeSandboxOutlined } from "@ant-design/icons";

// utils
import { getCRColor } from "@/utils/utility";

// components
import DisplayModalSkeleton from "@/components/global/common/DisplayModalSkeleton";
import DisplaySectionHeader from "@/components/global/common/DisplaySectionHeader";

// assets
import { noItemImage } from "@/assets";

// hooks
import { useTranslation } from "react-i18next";
import useMonsterDisplayModal from "@/hooks/monster/useMonsterDisplayModal";

// interfaces
import type { Monster } from "@/models/monsterInterfaces";

interface Props {
    open: boolean;
    onClose: () => void;
    onEdit?: () => void;
    getMonster: () => Promise<Monster | null>;
}

const { Text, Title } = Typography;


export default function MonsterDisplayModal({ open, onClose, onEdit, getMonster }: Props) {

    const {
        monster
    } = useMonsterDisplayModal(getMonster);

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
            {monster ? (
                <div style={{ display: 'flex', height: '100%' }}>
                    <div style={styles.leftSideContent}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ ...styles.typeBadge, backgroundColor: getCRColor(monster.stats.cr) }}>
                                <Text style={{ color: 'white' }}>{`CR ${monster.stats.cr}`}</Text>
                            </div>
                            <Text italic style={{ fontSize: '1rem' }}>
                                {`${t(`monsters.${monster.size}`)} ${t(`monsters.${monster.type}`)}`}
                            </Text>
                        </div>
                        <div style={styles.imagePreviewContainer}>
                            {monster.image ? (
                                <img src={monster.image} alt="Monster" style={styles.imagePreview} />
                            ) : (
                                <img src={noItemImage} alt="Monster" style={styles.imagePreview} />
                            )}
                        </div>
                        <div style={styles.itemDetails}>
                            <div style={styles.itemDetailsChild}>
                                <Text style={{ width: '40%', textTransform: 'uppercase' }}>{t('monsters.alignment')}</Text>
                                <Text strong style={{ textAlign: 'right' }}>{t(`monsters.${monster.alignment}`)}</Text>
                            </div>
                            {monster.languages && (
                                <div style={styles.itemDetailsChild}>
                                    <Text style={{ width: '40%', textTransform: 'uppercase' }}>{t('monsters.languages')}</Text>
                                    <Text strong style={{ textAlign: 'right' }}>{monster.languages}</Text>
                                </div>
                            )}
                        </div>

                    </div>
                    <div style={styles.rightSideContent}>
                        <div style={styles.rightSideTitleContainer}>
                            <Title level={1} style={styles.rightSideTitle}>{monster.name}</Title>
                        </div>

                        {/* COMBAT STATISTICS moved below appearance */}

                        <DisplaySectionHeader icon={<InfoCircleOutlined />} title={`${t('monsters.description')}`.toUpperCase()} />
                        <div style={styles.descriptionText}>
                            {monster.description.split('\n').map((line, idx) => (
                                <p key={idx} style={{ margin: line.trim() ? '0 0 1rem 0' : '0' }}>{line}</p>
                            ))}
                        </div>

                        <DisplaySectionHeader icon={<CodeSandboxOutlined />} title={`${t('monsters.appearance')}`.toUpperCase()} />
                        <div style={styles.descriptionText}>
                            {monster.appearance.split('\n').map((line, idx) => (
                                <p key={idx} style={{ margin: line.trim() ? '0 0 1rem 0' : '0' }}>{line}</p>
                            ))}
                        </div>

                        {/* Combat Statistics */}
                        <DisplaySectionHeader icon={<ThunderboltOutlined />} title="COMBAT STATISTICS" />
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem', marginBottom: '1rem' }}>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <div style={{ ...styles.abilityScoreCard, flex: 1 }}>
                                    <Text style={styles.abilityScoreLabel}>{t('monsters.ac')}</Text>
                                    <Text style={styles.abilityScoreValue}>{monster.stats.ac}</Text>
                                </div>
                                <div style={{ ...styles.abilityScoreCard, flex: 1 }}>
                                    <Text style={styles.abilityScoreLabel}>{t('monsters.hpRange')}</Text>
                                    <Text style={styles.abilityScoreValue}>
                                        {monster.stats.minHp || 0} - {monster.stats.maxHp || 0}
                                        <Text style={{ fontSize: '0.9rem', color: '#8c8069', marginLeft: '0.5rem', fontWeight: 'normal' }}>
                                            (Avg: {Math.floor(((monster.stats.minHp || 0) + (monster.stats.maxHp || 0)) / 2)})
                                        </Text>
                                    </Text>
                                </div>
                            </div>
                            <div style={styles.abilityScoresContainer}>
                                {['str', 'dex', 'con', 'int', 'wis', 'cha'].map((stat) => (
                                    <div key={stat} style={styles.abilityScoreCard}>
                                        <Text style={styles.abilityScoreLabel}>{stat.toUpperCase()}</Text>
                                        <Text style={styles.abilityScoreValue}>
                                            {monster.stats[stat as keyof typeof monster.stats]}
                                        </Text>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Attributes and Immunities */}
                        {(
                            (monster.speed && Object.keys(monster.speed).some(k => monster.speed[k as keyof typeof monster.speed] > 0)) ||
                            (monster.senses && Object.keys(monster.senses).some(k => monster.senses[k as keyof typeof monster.senses] > 0)) ||
                            (monster.additionalProperties && (
                                (monster.additionalProperties.immunities && monster.additionalProperties.immunities.length > 0) ||
                                (monster.additionalProperties.resistances && monster.additionalProperties.resistances.length > 0) ||
                                (monster.additionalProperties.vulnerabilities && monster.additionalProperties.vulnerabilities.length > 0) ||
                                (monster.additionalProperties.conditionImmunities && monster.additionalProperties.conditionImmunities.length > 0)
                            ))
                        ) && (
                                <>
                                    <DisplaySectionHeader icon={<ThunderboltOutlined />} title={`${t('items.attributesAndImmunities')}`.toUpperCase()} />
                                    <div style={styles.attributesContainer}>
                                        {/* Speed */}
                                        {monster.speed && Object.keys(monster.speed).some(k => monster.speed[k as keyof typeof monster.speed] > 0) && (
                                            <div style={styles.profileBox}>
                                                <Text style={styles.propertyLabel}>{`${t('monsters.speed')}`.toUpperCase()}</Text>
                                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                                                    {Object.entries(monster.speed).filter(([_, v]) => v > 0).map(([key, value]) => (
                                                        <div key={key} style={styles.profileItem}>
                                                            <Text style={styles.profileValue}>{value} ft.</Text>
                                                            <div style={styles.profileDivider}></div>
                                                            <Text style={styles.profileType}>{String(t(`monsters.${key}`)).toUpperCase()}</Text>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        {/* Senses */}
                                        {monster.senses && Object.keys(monster.senses).some(k => monster.senses[k as keyof typeof monster.senses] > 0) && (
                                            <div style={styles.profileBox}>
                                                <Text style={styles.propertyLabel}>{`${t('monsters.senses')}`.toUpperCase()}</Text>
                                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                                                    {Object.entries(monster.senses).filter(([_, v]) => v > 0).map(([key, value]) => (
                                                        <div key={key} style={styles.profileItem}>
                                                            <Text style={styles.profileValue}>{value} ft.</Text>
                                                            <div style={styles.profileDivider}></div>
                                                            <Text style={styles.profileType}>{String(t(`monsters.${key}`)).toUpperCase()}</Text>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {monster.additionalProperties && (
                                            <>
                                                {monster.additionalProperties.immunities && monster.additionalProperties.immunities.length > 0 && (
                                                    <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                                                        <Text style={styles.attributeLabel}>{`${t('items.immunity')}`.toUpperCase()}:</Text>
                                                        <div style={{ flex: 1, display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                                            {monster.additionalProperties.immunities.map(imm => (
                                                                <Tag key={imm} color="#e8e4d9" style={styles.attributeTag}>{t(`effects.${imm}`)}</Tag>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                                {monster.additionalProperties.resistances && monster.additionalProperties.resistances.length > 0 && (
                                                    <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                                                        <Text style={styles.attributeLabel}>{`${t('items.resistance')}`.toUpperCase()}:</Text>
                                                        <div style={{ flex: 1, display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                                            {monster.additionalProperties.resistances.map(res => (
                                                                <Tag key={res} color="#e8e4d9" style={styles.attributeTag}>{t(`effects.${res}`)}</Tag>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                                {monster.additionalProperties.vulnerabilities && monster.additionalProperties.vulnerabilities.length > 0 && (
                                                    <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                                                        <Text style={styles.attributeLabel}>{`${t('items.vulnerability')}`.toUpperCase()}:</Text>
                                                        <div style={{ flex: 1, display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                                            {monster.additionalProperties.vulnerabilities.map(vul => (
                                                                <Tag key={vul} color="#e8e4d9" style={styles.attributeTag}>{t(`effects.${vul}`)}</Tag>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                                {monster.additionalProperties.conditionImmunities && monster.additionalProperties.conditionImmunities.length > 0 && (
                                                    <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                                                        <Text style={styles.attributeLabel}>{`${t('items.conditionImmunity')}`.toUpperCase()}:</Text>
                                                        <div style={{ flex: 1, display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                                            {monster.additionalProperties.conditionImmunities.map(cond => (
                                                                <Tag key={cond} color="#e8e4d9" style={styles.attributeTag}>{t(`effects.${cond}`)}</Tag>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </>
                            )}

                        {/* Actions */}
                        {monster.actions && monster.actions.length > 0 && (
                            <>
                                <DisplaySectionHeader icon={<ThunderboltOutlined />} title={`${t('monsters.actions')}`.toUpperCase()} />
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                                    {monster.actions.map((action, idx) => (
                                        <div key={idx} style={styles.actionCard}>
                                            <Text style={styles.actionName}>{action.name}. </Text>
                                            <Text style={styles.actionDescription}>{action.description}</Text>
                                        </div>
                                    ))}
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
    crBadge: {
        display: 'inline-block',
        padding: '3px 12px',
        borderRadius: '16px',
        color: 'white',
        fontWeight: 'bold',
        fontSize: '12px',
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
    typeBadge: {
        display: 'inline-block',
        padding: '3px 12px',
        borderRadius: '16px',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        color: 'white',
        fontWeight: 'bold',
        fontSize: '10px',
        textTransform: 'capitalize'
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
        alignItems: 'flex-start',
        borderBottom: '1px solid #e0dcd2ff',
        padding: '0.5rem 0px'
    },
    rightSideTitleContainer: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        marginBottom: '1rem'
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
        color: '#4a463d',
        marginBottom: '1.5rem',
    },
    abilityScoresContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        gap: '0.5rem',
        marginBottom: '2rem',
        flexWrap: 'wrap',
    },
    abilityScoreCard: {
        flex: '1',
        minWidth: '60px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        border: '1px solid #d3c9b3',
        borderRadius: '8px',
        padding: '0.5rem',
        backgroundColor: '#fcfbf9'
    },
    abilityScoreLabel: {
        fontSize: '0.9rem',
        fontWeight: 'bold',
        color: '#8c8069',
        letterSpacing: '1px'
    },
    abilityScoreValue: {
        fontSize: '1.4rem',
        fontWeight: 'bold',
        color: '#4a463d',
        fontFamily: 'Georgia, serif',
        display: 'flex',
        alignItems: 'center',
    },
    attributesContainer: {
        marginTop: '1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        marginBottom: '2rem',
    },
    attributeLabel: {
        fontSize: '0.8rem',
        fontWeight: 'bold',
        color: '#8c8069',
        letterSpacing: '1px',
        width: '160px',
    },
    attributeTag: {
        color: '#4a463d',
        border: '1px solid #d3c9b3',
        fontSize: '0.85rem',
        padding: '2px 8px'
    },
    actionCard: {
        borderBottom: '1px solid #e0dcd2ff',
        paddingBottom: '0.8rem',
    },
    actionName: {
        fontWeight: 'bold',
        fontSize: '1rem',
        color: '#4a463d',
        fontStyle: 'italic',
    },
    actionDescription: {
        fontSize: '1rem',
        lineHeight: '1.6',
        color: '#4a463d',
    },
    propertyLabel: {
        fontSize: '0.85rem',
        fontWeight: 'bold',
        letterSpacing: '1px',
        color: '#8c8069',
        display: 'block'
    },
    profileBox: {
        border: '1px solid #d3c9b3',
        borderRadius: '8px',
        padding: '1.2rem',
        backgroundColor: '#fcfbf9',
        marginBottom: '0.5rem'
    },
    profileItem: {
        border: '1px solid #d3c9b3',
        borderRadius: '4px',
        padding: '0.5rem 1rem',
        display: 'inline-flex',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        marginTop: '0.5rem'
    },
    profileValue: {
        fontFamily: 'Georgia, serif',
        fontSize: '1.2rem',
        fontWeight: 'bold',
        color: '#d35400',
        marginRight: '0.8rem'
    },
    profileDivider: {
        width: '1px',
        height: '1.5rem',
        backgroundColor: '#d3c9b3',
        marginRight: '0.8rem'
    },
    profileType: {
        fontSize: '0.7rem',
        fontWeight: 'bold',
        color: '#8c8069',
        letterSpacing: '1px'
    }
}
