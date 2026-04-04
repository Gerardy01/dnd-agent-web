import { Modal, Typography, Divider, Tag, Button } from "antd";
import { InfoCircleOutlined, CodeSandboxOutlined, SafetyOutlined, ThunderboltOutlined, EditOutlined } from "@ant-design/icons";

// utils
import { getRarityColor, numberFormat } from "@/utils/utility";
import { ItemTypeEnum, WeaponToggleEnum, ItemBonusStatEnum } from "@/utils/enums";

// assets
import { MagicalIcon, noItemImage, SwordIcon } from "@/assets";

// hooks
import { useTranslation } from "react-i18next";

// interfaces
import type { Item } from "@/models/itemInterfaces";
interface Props {
    open: boolean;
    onClose: () => void;
    onEdit?: () => void;
    item: Item;
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


export default function ItemDisplayModal({ open, onClose, onEdit, item }: Props) {

    const { t } = useTranslation();

    return (
        <Modal
            open={open}
            footer={null}
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
            <div style={{ display: 'flex', height: '100%' }}>
                <div style={styles.leftSideContent}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ ...styles.rarityBadge, backgroundColor: getRarityColor(item.rarity) }}>
                            {`${t(`items.${item.rarity}`)}`.toUpperCase()}
                        </div>
                        {item.isMagicItem && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <MagicalIcon style={{ fontSize: '1.5rem', color: 'd35400' }} />
                                <Text italic>{t('items.magicalItem')}</Text>
                            </div>
                        )}
                    </div>
                    <div style={styles.imagePreviewContainer}>
                        {item.image ? (
                            <img src={item.image} alt="Item" style={styles.imagePreview} />
                        ) : (
                            <img src={noItemImage} alt="Item" style={styles.imagePreview} />
                        )}
                    </div>
                    <div style={styles.itemDetails}>
                        <div style={styles.itemDetailsChild}>
                            <Text style={{ width: '30%', textTransform: 'uppercase' }}>{t('items.type')}</Text>
                            <Text strong style={{ textAlign: 'right' }}>{t(`items.${item.type}`)}</Text>
                        </div>
                        <div style={styles.itemDetailsChild}>
                            <Text style={{ width: '30%', textTransform: 'uppercase' }}>{t('items.category')}</Text>
                            <Text strong style={{ textAlign: 'right' }}>{t(`items.${item.category}`)}</Text>
                        </div>
                        <div style={styles.itemDetailsChild}>
                            <Text style={{ width: '30%', textTransform: 'uppercase' }}>{t('items.weight')}</Text>
                            <Text strong style={{ textAlign: 'right' }}>{item.weight} {t('items.lbs')}</Text>
                        </div>
                        <div style={styles.itemDetailsChild}>
                            <Text style={{ width: '30%', textTransform: 'uppercase' }}>{t('items.cost')}</Text>
                            <Text strong style={{ textAlign: 'right' }}>{numberFormat(item.cost)} {t(`items.${item.currencyUnit}`)}</Text>
                        </div>
                        {item.equipSlot && (
                            <div style={styles.itemDetailsChild}>
                                <Text style={{ width: '30%', textTransform: 'uppercase' }}>{t('items.equipSlot')}</Text>
                                <Text strong style={{ textAlign: 'right' }}>{t(`items.${item.equipSlot}`)}</Text>
                            </div>
                        )}
                    </div>

                    {(() => {
                        const statKeys = Object.values(ItemBonusStatEnum);
                        const hasFlatBonus = item.flatBonus && statKeys.some(k => (item.flatBonus![k] ?? 0) !== 0);
                        const hasOverrideBonus = item.overrideBonus && statKeys.some(k => (item.overrideBonus![k] ?? 0) !== 0);
                        const hasModifierBonus = item.modifierBonus && item.modifierBonus.length > 0;
                        if (!hasFlatBonus && !hasOverrideBonus && !hasModifierBonus) return null;
                        return (
                            <div style={{ marginTop: '1.5rem' }}>
                                <div style={styles.bonusSectionHeader}>
                                    <span style={{ fontSize: '1rem', display: 'flex', color: '#8c8069' }}>⊕</span>
                                    <Text strong style={styles.bonusSectionTitle}>STAT BONUSES</Text>
                                </div>
                                {hasFlatBonus && (
                                    <>
                                        <Text style={styles.bonusTypeLabel}>{t('items.flatBonus')}</Text>
                                        <div style={styles.bonusGrid}>
                                            {statKeys.filter(k => (item.flatBonus![k] ?? 0) !== 0).map(k => (
                                                <div key={k} style={styles.bonusStatCard}>
                                                    <Text style={styles.bonusStatLabel}>{String(t(`items.${k}Short`)).toUpperCase()}</Text>
                                                    <Text style={(item.flatBonus![k] ?? 0) >= 0 ? styles.bonusStatValuePos : styles.bonusStatValueNeg}>
                                                        {(item.flatBonus![k] ?? 0) >= 0 ? '+' : ''}{item.flatBonus![k]}
                                                    </Text>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}
                                {hasOverrideBonus && (
                                    <>
                                        <Text style={{ ...styles.bonusTypeLabel, marginTop: hasFlatBonus ? '1rem' : 0 }}>{t('items.overrideBonus')}</Text>
                                        <div style={styles.bonusGrid}>
                                            {statKeys.filter(k => (item.overrideBonus![k] ?? 0) !== 0).map(k => (
                                                <div key={k} style={styles.bonusStatCard}>
                                                    <Text style={styles.bonusStatLabel}>{String(t(`items.${k}Short`)).toUpperCase()}</Text>
                                                    <Text style={styles.bonusStatValuePos}>{item.overrideBonus![k]}</Text>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}
                                {hasModifierBonus && (
                                    <>
                                        <Text style={{ ...styles.bonusTypeLabel, marginTop: (hasFlatBonus || hasOverrideBonus) ? '1rem' : 0 }}>{t('items.modifierBonus')}</Text>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
                                            {item.modifierBonus!.map((mb, idx) => (
                                                <div key={idx} style={styles.modifierBonusRow}>
                                                    <Text style={{ fontSize: '0.85rem', color: '#4a463d' }}>
                                                        Add <Text strong style={{ color: '#d35400' }}>{String(t(`items.${mb.from}`))}</Text> modifier to <Text strong style={{ color: '#d35400' }}>{String(t(`items.${mb.to}`))}</Text> up to <Text strong style={{ color: '#d35400' }}>{mb.value}</Text>
                                                    </Text>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        );
                    })()}
                </div>
                <div style={styles.rightSideContent}>
                    <div style={styles.rightSideTitleContainer}>
                        <Title level={1} style={styles.rightSideTitle}>{item.name}</Title>
                    </div>

                    <SectionHeader icon={<InfoCircleOutlined />} title="DESCRIPTION" />
                    <div style={styles.descriptionText}>
                        {item.description.split('\n').map((line, idx) => (
                            <p key={idx} style={{ margin: line.trim() ? '0 0 1rem 0' : '0' }}>{line}</p>
                        ))}
                    </div>

                    <SectionHeader icon={<CodeSandboxOutlined />} title="APPEARANCE" />
                    <div style={styles.descriptionText}>
                        {item.appearance.split('\n').map((line, idx) => (
                            <p key={idx} style={{ margin: line.trim() ? '0 0 1rem 0' : '0' }}>{line}</p>
                        ))}
                    </div>

                    {item.type === ItemTypeEnum.ARMOR && item.armorProperties && (
                        <>
                            <SectionHeader icon={<SafetyOutlined />} title="ARMOR PROPERTIES" />
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                                <div style={styles.propertyBox}>
                                    <Text style={styles.propertyLabel}>BASE ARMOR CLASS</Text><br />
                                    <Text style={styles.propertyValue}>{item.armorProperties.baseAc}</Text>
                                </div>
                                {item.armorProperties.strengthReq > 0 && (
                                    <div style={styles.propertyBox}>
                                        <Text style={styles.propertyLabel}>STRENGTH REQUIREMENT</Text><br />
                                        <Text style={styles.propertyValue}>{item.armorProperties.strengthReq > 0 ? item.armorProperties.strengthReq : '-'}</Text>
                                    </div>
                                )}
                                {item.armorProperties.flatAcBonus > 0 && (
                                    <div style={styles.propertyBox}>
                                        <Text style={styles.propertyLabel}>FLAT AC BONUS</Text><br />
                                        <Text style={styles.propertyValue}>+{item.armorProperties.flatAcBonus}</Text>
                                    </div>
                                )}
                                {item.armorProperties.maxModifier > 0 && (
                                    <div style={styles.propertyBox}>
                                        <Text style={styles.propertyLabel}>MAX MODIFIER</Text><br />
                                        <Text style={styles.propertyValue}>{item.armorProperties.maxModifier}</Text>
                                    </div>
                                )}
                            </div>
                            {(item.armorProperties.modifier.dexMod || item.armorProperties.modifier.conMod || item.armorProperties.modifier.wisMod || item.armorProperties.other?.stealthDisadvantage) && (
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1rem' }}>
                                    {item.armorProperties.modifier.dexMod && (
                                        <Tag color="#e8e4d9" style={styles.stealthTag}>+ Dex Modifier</Tag>
                                    )}
                                    {item.armorProperties.modifier.conMod && (
                                        <Tag color="#e8e4d9" style={styles.stealthTag}>+ Con Modifier</Tag>
                                    )}
                                    {item.armorProperties.modifier.wisMod && (
                                        <Tag color="#e8e4d9" style={styles.stealthTag}>+ Wis Modifier</Tag>
                                    )}
                                    {item.armorProperties.other?.stealthDisadvantage && (
                                        <Tag color="#f5e6e0" style={{ ...styles.stealthTag, color: '#c0392b', borderColor: '#e8b4a8' }}>Stealth Disadvantage</Tag>
                                    )}
                                </div>
                            )}
                        </>
                    )}

                    {item.type === ItemTypeEnum.WEAPON && item.weaponProperties && (
                        <>
                            <SectionHeader icon={<SwordIcon />} title="WEAPON PROPERTIES" />
                            <div style={styles.weaponPropertiesBox}>
                                <Text style={styles.propertyLabel}>DAMAGE PROFILE</Text>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                                    {item.weaponProperties.damageRoll.map((dr, index) => (
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

                            {(() => {
                                const wp = item.weaponProperties;
                                const boolProps: { key: string; label: string; desc: string }[] = [
                                    { key: WeaponToggleEnum.LIGHT, label: t('items.light'), desc: t('items.lightDescription') },
                                    { key: WeaponToggleEnum.HEAVY, label: t('items.heavy'), desc: t('items.heavyDescription') },
                                    { key: WeaponToggleEnum.FINESSE, label: t('items.finesse'), desc: t('items.finesseDescription') },
                                    { key: WeaponToggleEnum.THROWN, label: t('items.thrown'), desc: t('items.thrownDescription') },
                                    { key: WeaponToggleEnum.TWO_HANDED, label: t('items.twoHanded'), desc: t('items.twoHandedDescription') },
                                    { key: WeaponToggleEnum.AMMUNITION, label: t('items.ammunition'), desc: t('items.ammunitionDescription') },
                                    { key: WeaponToggleEnum.LOADING, label: t('items.loading'), desc: t('items.loadingDescription') },
                                    { key: WeaponToggleEnum.REACH, label: t('items.reach'), desc: t('items.reachDescription') },
                                ];
                                const activeProps = boolProps.filter(p => wp[p.key as keyof typeof wp] === true);
                                const hasRange = !!wp.range;
                                const hasVersatile = !!wp.versatileDamageRoll;
                                if (!activeProps.length && !hasRange && !hasVersatile) return null;
                                return (
                                    <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                        {activeProps.map(p => (
                                            <div key={p.key} style={styles.weaponPropCard}>
                                                <Text strong style={styles.weaponPropName}>{p.label}</Text>
                                                <Text style={styles.weaponPropDesc}>{p.desc}</Text>
                                            </div>
                                        ))}
                                        {hasRange && wp.range && (
                                            <div style={styles.weaponPropCard}>
                                                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem' }}>
                                                    <Text strong style={styles.weaponPropName}>{t('items.range')}</Text>
                                                    <Text style={styles.rangeValue}>{wp.range.normal} ft{wp.range.long ? ` / ${wp.range.long} ft` : ''}</Text>
                                                </div>
                                                <Text style={styles.weaponPropDesc}>{t('items.rangeDescription')}</Text>
                                            </div>
                                        )}
                                        {hasVersatile && wp.versatileDamageRoll && (
                                            <div style={styles.weaponPropCard}>
                                                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem' }}>
                                                    <Text strong style={styles.weaponPropName}>{t('items.versatile')}</Text>
                                                    <Text style={styles.rangeValue}>
                                                        {wp.versatileDamageRoll.count}d{wp.versatileDamageRoll.dice}{wp.versatileDamageRoll.bonus ? `+${wp.versatileDamageRoll.bonus}` : ''}
                                                    </Text>
                                                </div>
                                                <Text style={styles.weaponPropDesc}>{t('items.versatileDescription')}</Text>
                                            </div>
                                        )}
                                    </div>
                                );
                            })()}
                        </>
                    )}

                    {item.additionalProperties && (item.additionalProperties.immunities.length > 0 || item.additionalProperties.resistances.length > 0 || item.additionalProperties.vulnerabilities.length > 0 || item.additionalProperties.conditionImmunities.length > 0) && (
                        <>
                            <SectionHeader icon={<ThunderboltOutlined />} title="ATTRIBUTES & IMMUNITIES" />
                            <div style={styles.attributesContainer}>
                                {item.additionalProperties.immunities.length > 0 && (
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <Text style={styles.attributeLabel}>IMMUNITY:</Text>
                                        <div style={{ flex: 1, display: 'flex', gap: '0.5rem' }}>
                                            {item.additionalProperties.immunities.map(imm => (
                                                <Tag key={imm} color="#e8e4d9" style={styles.attributeTag}>{t(`effects.${imm}`)}</Tag>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {item.additionalProperties.resistances.length > 0 && (
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <Text style={styles.attributeLabel}>RESISTANCE:</Text>
                                        <div style={{ flex: 1, display: 'flex', gap: '0.5rem' }}>
                                            {item.additionalProperties.resistances.map(res => (
                                                <Tag key={res} color="#e8e4d9" style={styles.attributeTag}>{t(`effects.${res}`)}</Tag>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {item.additionalProperties.vulnerabilities.length > 0 && (
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <Text style={styles.attributeLabel}>VULNERABILITY:</Text>
                                        <div style={{ flex: 1, display: 'flex', gap: '0.5rem' }}>
                                            {item.additionalProperties.vulnerabilities.map(vul => (
                                                <Tag key={vul} color="#e8e4d9" style={styles.attributeTag}>{t(`effects.${vul}`)}</Tag>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {item.additionalProperties.conditionImmunities.length > 0 && (
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <Text style={styles.attributeLabel}>CONDITION IMMUNITY:</Text>
                                        <div style={{ flex: 1, display: 'flex', gap: '0.5rem' }}>
                                            {item.additionalProperties.conditionImmunities.map(cond => (
                                                <Tag key={cond} color="#e8e4d9" style={styles.attributeTag}>{t(`effects.${cond}`)}</Tag>
                                            ))}
                                        </div>
                                    </div>
                                )}
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
    rarityBadge: {
        display: 'inline-block',
        padding: '3px 12px',
        borderRadius: '16px',
        color: 'white',
        fontWeight: 'bold',
        fontSize: '10px',
        textTransform: 'capitalize'
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
    propertyBox: {
        width: '48%',
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
        fontSize: '2rem',
        fontWeight: 'bold',
        color: '#4a463d'
    },
    stealthTag: {
        color: '#4a463d',
        border: '1px solid #d3c9b3',
        fontSize: '0.85rem',
        padding: '4px 8px'
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
        marginTop: '1rem'
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
    attributesContainer: {
        marginTop: '1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
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
    weaponPropCard: {
        border: '1px solid #d3c9b3',
        borderRadius: '6px',
        padding: '0.8rem 1rem',
        backgroundColor: '#fcfbf9'
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
    rangeValue: {
        fontSize: '1rem',
        fontWeight: 'bold',
        color: '#d35400',
        fontFamily: 'Georgia, serif'
    },
    bonusSectionHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        marginBottom: '0.75rem'
    },
    bonusSectionTitle: {
        fontSize: '0.85rem',
        letterSpacing: '1.5px',
        color: '#8c8069',
        fontFamily: 'Georgia, serif'
    },
    bonusTypeLabel: {
        display: 'block',
        fontSize: '0.75rem',
        color: '#b0a892',
        letterSpacing: '0.5px',
        marginBottom: '0.5rem',
        textTransform: 'uppercase'
    },
    bonusGrid: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.5rem',
    },
    bonusStatCard: {
        width: '31.5%',
        border: '1px solid #d3c9b3',
        borderRadius: '6px',
        padding: '0.5rem 0.75rem',
        backgroundColor: '#fcfbf9',
        minWidth: '70px',
        textAlign: 'center'
    },
    bonusStatLabel: {
        display: 'block',
        fontSize: '0.7rem',
        fontWeight: 'bold',
        color: '#8c8069',
        letterSpacing: '1px'
    },
    bonusStatValuePos: {
        display: 'block',
        fontSize: '1.1rem',
        fontWeight: 'bold',
        color: '#d35400',
        fontFamily: 'Georgia, serif'
    },
    bonusStatValueNeg: {
        display: 'block',
        fontSize: '1.1rem',
        fontWeight: 'bold',
        color: '#c0392b',
        fontFamily: 'Georgia, serif'
    },
    modifierBonusRow: {
        border: '1px solid #d3c9b3',
        borderRadius: '6px',
        padding: '0.5rem 0.75rem',
        backgroundColor: '#fcfbf9'
    }
}