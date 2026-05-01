import { Modal, Typography, Tag, Button } from "antd";
import { InfoCircleOutlined, EditOutlined, ThunderboltOutlined, CodeSandboxOutlined } from "@ant-design/icons";

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

    const getCRColor = (cr: number) => {
        if (cr === 0) return '#bdc3c7';
        if (cr <= 4) return '#2ecc71';
        if (cr <= 10) return '#f1c40f';
        if (cr <= 16) return '#e67e22';
        return '#e74c3c';
    }

    const calculateModifier = (score: number) => {
        const mod = Math.floor((score - 10) / 2);
        return mod >= 0 ? `+${mod}` : `${mod}`;
    };

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
                            <div style={{ ...styles.crBadge, backgroundColor: getCRColor(monster.stats.cr) }}>
                                CR {monster.stats.cr}
                            </div>
                            <Text italic style={{ color: '#8c8069' }}>
                                {`${t(`monsters.${monster.size}`)} ${t(`monsters.${monster.type}`)}, ${t(`monsters.${monster.alignment}`)}`}
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
                                <Text style={{ width: '40%', textTransform: 'uppercase' }}>{t('monsters.ac')}</Text>
                                <Text strong style={{ textAlign: 'right' }}>{monster.stats.ac}</Text>
                            </div>
                            <div style={styles.itemDetailsChild}>
                                <Text style={{ width: '40%', textTransform: 'uppercase' }}>{t('monsters.hp')}</Text>
                                <Text strong style={{ textAlign: 'right' }}>
                                    {monster.stats.minHp} - {monster.stats.maxHp}
                                </Text>
                            </div>

                            {monster.speed && Object.keys(monster.speed).length > 0 && (
                                <div style={styles.itemDetailsChild}>
                                    <Text style={{ width: '40%', textTransform: 'uppercase' }}>{t('monsters.speed')}</Text>
                                    <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column' }}>
                                        {Object.entries(monster.speed).map(([key, value]) => (
                                            <Text strong key={key}>{value} ft. ({t(`monsters.${key}`)})</Text>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {monster.senses && Object.keys(monster.senses).length > 0 && (
                                <div style={styles.itemDetailsChild}>
                                    <Text style={{ width: '40%', textTransform: 'uppercase' }}>{t('monsters.senses')}</Text>
                                    <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column' }}>
                                        {Object.entries(monster.senses).map(([key, value]) => (
                                            <Text strong key={key}>{value} ft. ({t(`monsters.${key}`)})</Text>
                                        ))}
                                    </div>
                                </div>
                            )}

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

                        {/* Ability Scores */}
                        <div style={styles.abilityScoresContainer}>
                            {['str', 'dex', 'con', 'int', 'wis', 'cha'].map((stat) => (
                                <div key={stat} style={styles.abilityScoreCard}>
                                    <Text style={styles.abilityScoreLabel}>{stat.toUpperCase()}</Text>
                                    <Text style={styles.abilityScoreValue}>
                                        {monster.stats[stat as keyof typeof monster.stats]}
                                        <Text style={{ color: '#8c8069', fontSize: '1rem', marginLeft: '0.3rem' }}>
                                            ({calculateModifier(monster.stats[stat as keyof typeof monster.stats])})
                                        </Text>
                                    </Text>
                                </div>
                            ))}
                        </div>

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

                        {/* Additional Properties */}
                        {monster.additionalProperties && (
                            (monster.additionalProperties.immunities && monster.additionalProperties.immunities.length > 0) ||
                            (monster.additionalProperties.resistances && monster.additionalProperties.resistances.length > 0) ||
                            (monster.additionalProperties.vulnerabilities && monster.additionalProperties.vulnerabilities.length > 0) ||
                            (monster.additionalProperties.conditionImmunities && monster.additionalProperties.conditionImmunities.length > 0)
                        ) && (
                                <>
                                    <DisplaySectionHeader icon={<ThunderboltOutlined />} title={`${t('items.attributesAndImmunities')}`.toUpperCase()} />
                                    <div style={styles.attributesContainer}>
                                        {monster.additionalProperties.immunities && monster.additionalProperties.immunities.length > 0 && (
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <Text style={styles.attributeLabel}>{`${t('items.immunity')}`.toUpperCase()}:</Text>
                                                <div style={{ flex: 1, display: 'flex', gap: '0.5rem' }}>
                                                    {monster.additionalProperties.immunities.map(imm => (
                                                        <Tag key={imm} color="#e8e4d9" style={styles.attributeTag}>{t(`effects.${imm}`)}</Tag>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        {monster.additionalProperties.resistances && monster.additionalProperties.resistances.length > 0 && (
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <Text style={styles.attributeLabel}>{`${t('items.resistance')}`.toUpperCase()}:</Text>
                                                <div style={{ flex: 1, display: 'flex', gap: '0.5rem' }}>
                                                    {monster.additionalProperties.resistances.map(res => (
                                                        <Tag key={res} color="#e8e4d9" style={styles.attributeTag}>{t(`effects.${res}`)}</Tag>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        {monster.additionalProperties.vulnerabilities && monster.additionalProperties.vulnerabilities.length > 0 && (
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <Text style={styles.attributeLabel}>{`${t('items.vulnerability')}`.toUpperCase()}:</Text>
                                                <div style={{ flex: 1, display: 'flex', gap: '0.5rem' }}>
                                                    {monster.additionalProperties.vulnerabilities.map(vul => (
                                                        <Tag key={vul} color="#e8e4d9" style={styles.attributeTag}>{t(`effects.${vul}`)}</Tag>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        {monster.additionalProperties.conditionImmunities && monster.additionalProperties.conditionImmunities.length > 0 && (
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <Text style={styles.attributeLabel}>{`${t('items.conditionImmunity')}`.toUpperCase()}:</Text>
                                                <div style={{ flex: 1, display: 'flex', gap: '0.5rem' }}>
                                                    {monster.additionalProperties.conditionImmunities.map(cond => (
                                                        <Tag key={cond} color="#e8e4d9" style={styles.attributeTag}>{t(`effects.${cond}`)}</Tag>
                                                    ))}
                                                </div>
                                            </div>
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
    }
}
