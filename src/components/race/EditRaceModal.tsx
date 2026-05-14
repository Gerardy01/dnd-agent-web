import { Button, Checkbox, Col, Divider, Form, Input, InputNumber, Modal, Row, Select, Switch, Tag, Typography } from "antd";
import { CloseOutlined, DeleteOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";

// hooks
import useEditRace from "@/hooks/race/useEditRace";
import { useTranslation } from "react-i18next";

// assets

// components
import ImageForm from "@/components/global/form/ImageForm";
import TraitForm from "@/components/race/TraitForm";
import EditModalSkeleton from "@/components/global/common/EditModalSkeleton";

// interfaces
import type { RaceWrite, WorkshopRaceDetailReturn } from "@/models/raceInterfaces";
import type { WorkshopSpellReturn } from "@/models/spellInterfaces";

const { Title, Text } = Typography;

interface Props {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: RaceWrite) => Promise<void>;
    getData: () => Promise<WorkshopRaceDetailReturn | null>;
    workshopSpells: WorkshopSpellReturn[];
}

export default function EditRaceModal({ open, onClose, onSubmit, getData, workshopSpells }: Props) {

    const {
        raceData,
        editRaceForm,
        submitLoad,
        isSpellcaster,
        spellcastingAbilitySelection,
        setIsSpellcaster,
        handleFileChange,
        submitEditRace,
        handleCloseModal,
        spellList,
        spellSearch,
        setSpellSearch,
        selectedSpellIds,
        handleToggleSpell,
        traits,
        featureTypeSelection,
        handleDeleteTrait,
        editingTraitIndex,
        handleStartAddTrait,
        handleStartEditTrait,
        handleCancelTrait,
        handleSaveTrait,
        traitErrMsg,
        spellErrMsg,
        hasProgression,
        setHasProgression,
    } = useEditRace(onClose, onSubmit, getData, workshopSpells);

    const { t } = useTranslation();

    return (
        <Modal
            open={open}
            footer={null}
            closable={false}
            destroyOnHidden={true}
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
                    overflow: 'auto',
                    height: 'calc(100vh - 4rem)',
                    scrollbarWidth: 'none'
                }
            }}
        >
            {!raceData ? (
                <EditModalSkeleton />
            ) : (
                <>
                    <div style={styles.header}>
                <div>
                    <Title level={2} style={{ margin: '0px' }}>Edit Race</Title>
                    <Text style={{ fontSize: '1rem' }}>Modify the details of your race</Text>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Button
                        style={{ padding: '1.2rem 1.5rem' }}
                        type="primary"
                        onClick={() => editRaceForm.submit()}
                        loading={submitLoad}
                    >
                        Save Changes
                    </Button>
                    <Divider vertical style={styles.titleDivider} />
                    <Button
                        icon={<CloseOutlined />}
                        style={{ padding: '1.2rem', borderRadius: '50%' }}
                        onClick={handleCloseModal}
                        disabled={submitLoad}
                        type="text"
                    />
                </div>
            </div>

            <div style={styles.content}>
                <div style={styles.imageFormContainer}>
                    <ImageForm
                        title="Race Image"
                        submitLoad={submitLoad}
                        onFileChange={handleFileChange}
                        initialImage={raceData?.image}
                    />
                </div>

                <div style={{ flex: '1' }}>
                    <Form
                        name="editRace"
                        layout="vertical"
                        form={editRaceForm}
                        style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
                        onFinish={submitEditRace}
                        scrollToFirstError={{ behavior: 'smooth', block: 'center' }}
                    >
                        <div style={styles.formContainer}>
                            <div style={styles.formHeader}>
                                <Title level={4} style={{ marginTop: 0, marginBottom: 0 }}>
                                    {t('classes.basicInformation')}
                                </Title>
                                <Text type="secondary">Provide the core details of your race</Text>
                            </div>
                            <div style={styles.formContent}>
                                <Form.Item
                                    name="name"
                                    label="Race Name"
                                    labelCol={{ style: { fontWeight: 'bold' } }}
                                    rules={[{ required: true, message: t('global.fieldRequired') }]}
                                >
                                    <Input placeholder="E.g., High Elf" size="large" maxLength={100} />
                                </Form.Item>
                                <Form.Item
                                    name="description"
                                    label={t('classes.description')}
                                    labelCol={{ style: { fontWeight: 'bold' } }}
                                    rules={[{ required: true, message: t('global.fieldRequired') }]}
                                >
                                    <Input.TextArea rows={5} placeholder={t('classes.descriptionPlaceholder')} maxLength={500} showCount />
                                </Form.Item>

                                <Form.Item
                                    name="language"
                                    label="Languages"
                                    labelCol={{ style: { fontWeight: 'bold' } }}
                                    required
                                >
                                    <Input.TextArea
                                        rows={3}
                                        placeholder="E.g., Common, Elvish"
                                        size="large"
                                        style={{ width: '100%' }}
                                        maxLength={200}
                                        showCount
                                    />
                                </Form.Item>

                                <Row style={styles.formRow}>
                                    <Col style={{ width: '48%' }}>
                                        <Form.Item
                                            name="speed"
                                            label="Speed (ft)"
                                            labelCol={{ style: { fontWeight: 'bold' } }}
                                            initialValue={30}
                                            required
                                        >
                                            <InputNumber
                                                placeholder="E.g., 30"
                                                size="large"
                                                min={0}
                                                style={{ width: '100%' }}
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <div style={styles.bonusCard}>
                                    <div style={styles.bonusCardHeader}>
                                        <div>
                                            <Text strong style={{ fontSize: '0.95rem', display: 'block' }}>{t('classes.isSpellcaster')}</Text>
                                            <Text type="secondary" style={{ fontSize: '0.82rem' }}>{t('classes.isSpellcasterDescription')}</Text>
                                        </div>
                                        <Switch
                                            checked={isSpellcaster}
                                            onChange={setIsSpellcaster}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {isSpellcaster && (
                            <div style={styles.formContainer}>
                                <div style={styles.formHeader}>
                                    <Title level={4} style={{ marginTop: 0, marginBottom: 0 }}>
                                        {t('classes.spellcastingProperties')}
                                    </Title>
                                    <Text type="secondary">{t('classes.spellcastingPropertiesDescription')}</Text>
                                </div>
                                <div style={styles.formContent}>
                                    <Row style={styles.formRow}>
                                        <Col style={{ width: '48%' }}>
                                            <Form.Item
                                                name="spellcastingAbility"
                                                label={t('classes.spellcastingAbility')}
                                                labelCol={{ style: { fontWeight: 'bold' } }}
                                                rules={[{ required: true, message: t('global.fieldRequired') }]}
                                            >
                                                <Select
                                                    placeholder={t('classes.spellcastingAbilityPlaceholder')}
                                                    size="large"
                                                    options={spellcastingAbilitySelection}
                                                    showSearch
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>

                                    <div style={styles.bonusCard}>
                                        <div style={styles.bonusCardHeader}>
                                            <div>
                                                <Text strong style={{ fontSize: '0.95rem', display: 'block' }}>Racial Spells</Text>
                                                <Text type="secondary" style={{ fontSize: '0.8rem' }}>
                                                    {selectedSpellIds.length} selected
                                                </Text>
                                            </div>
                                        </div>
                                        <div style={styles.bonusCardContent}>
                                            <Form.Item
                                                help={spellErrMsg}
                                                validateStatus={spellErrMsg ? 'error' : ''}
                                                style={{ marginBottom: 0 }}
                                            >
                                                <Input
                                                    placeholder={t('classes.spellSearchPlaceholder')}
                                                    size="large"
                                                    prefix={<SearchOutlined />}
                                                    value={spellSearch}
                                                    onChange={(e) => setSpellSearch(e.target.value)}
                                                    style={{ marginBottom: '0.75rem' }}
                                                />
                                                <div style={styles.spellList}>
                                                    {spellList.length === 0 ? (
                                                        <Text type="secondary" style={{ textAlign: 'center', display: 'block', padding: '1rem' }}>
                                                            No spells found
                                                        </Text>
                                                    ) : (
                                                        spellList.map((group) => (
                                                            <div key={group.level} style={styles.spellGroup}>
                                                                <div style={styles.spellGroupHeader}>
                                                                    <div style={styles.spellGroupBadge}>
                                                                        <Text strong style={{ color: '#fff', fontSize: '0.75rem', lineHeight: 1 }}>
                                                                            {group.level === 0 ? 'C' : group.level}
                                                                        </Text>
                                                                    </div>
                                                                    <Text strong style={{ fontSize: '0.9rem' }}>
                                                                        {group.level === 0 ? 'Cantrips' : `Level ${group.level} Spells`}
                                                                    </Text>
                                                                    <Text type="secondary" style={{ marginLeft: 'auto', fontSize: '0.82rem' }}>
                                                                        {group.spells.length}
                                                                    </Text>
                                                                </div>
                                                                <div style={styles.spellGrid}>
                                                                    {group.spells.map((spell) => {
                                                                        const isSelected = selectedSpellIds.includes(spell.workshopSpellId);
                                                                        return (
                                                                            <div
                                                                                key={spell.workshopSpellId}
                                                                                style={{
                                                                                    ...styles.spellCard,
                                                                                    ...(isSelected ? styles.spellCardSelected : {}),
                                                                                }}
                                                                                onClick={() => handleToggleSpell(spell.workshopSpellId)}
                                                                            >
                                                                                <Checkbox checked={isSelected} style={{ flexShrink: 0 }} />
                                                                                <div style={styles.spellCardImage}>
                                                                                    {spell.image ? (
                                                                                        <img src={spell.image} alt={spell.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '0.3rem' }} />
                                                                                    ) : (
                                                                                        <div style={styles.spellCardImagePlaceholder} />
                                                                                    )}
                                                                                </div>
                                                                                <Text
                                                                                    strong
                                                                                    style={{ fontSize: '0.82rem', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                                                                                    title={spell.name}
                                                                                >
                                                                                    {spell.name}
                                                                                </Text>
                                                                                <Text
                                                                                    type="secondary"
                                                                                    style={{ fontSize: '0.72rem', backgroundColor: '#e8e4da', padding: '0.15rem 0.4rem', borderRadius: '0.3rem', whiteSpace: 'nowrap', flexShrink: 0 }}
                                                                                >
                                                                                    {group.level === 0 ? 'Cantrip' : `Lvl ${group.level}`}
                                                                                </Text>
                                                                            </div>
                                                                        );
                                                                    })}
                                                                </div>
                                                            </div>
                                                        ))
                                                    )}
                                                </div>
                                            </Form.Item>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        )}

                        <div style={styles.formContainer}>
                            <div style={{ ...styles.formHeader, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <Title level={4} style={{ marginTop: 0, marginBottom: 0 }}>
                                        Traits
                                    </Title>
                                    <Text type="secondary">Modify traits granted to members of this race</Text>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <Text strong>Have Progression</Text>
                                    <Switch
                                        checked={hasProgression}
                                        onChange={setHasProgression}
                                    />
                                </div>
                            </div>
                            <div style={{ ...styles.formContent, maxHeight: '40rem', overflowY: 'auto' }}>
                                <Form.Item
                                    help={traitErrMsg}
                                    validateStatus={traitErrMsg ? 'error' : ''}
                                    style={{ marginBottom: 0 }}
                                >
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                        {traits.map((trait, index) => (
                                            <div key={index}>
                                                {editingTraitIndex === index ? (
                                                    <TraitForm
                                                        initialValues={trait}
                                                        onSave={handleSaveTrait}
                                                        onCancel={handleCancelTrait}
                                                        featureTypeSelection={featureTypeSelection}
                                                        isEdit
                                                        hasProgression={hasProgression}
                                                    />
                                                ) : (
                                                    <div style={styles.traitCard} onClick={() => handleStartEditTrait(index)}>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                                <Text strong style={{ fontSize: '1rem' }}>{trait.name}</Text>
                                                                <Tag color={trait.type === 'active' ? 'blue' : 'default'} style={{ textTransform: 'capitalize', borderRadius: '4px' }}>
                                                                    {t(`classes.${trait.type}`)}
                                                                </Tag>
                                                            </div>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                                {hasProgression && (
                                                                    <Text type="secondary" style={{ fontSize: '0.85rem', fontWeight: 500 }}>
                                                                        Lvl {trait.level}
                                                                    </Text>
                                                                )}
                                                                <Button
                                                                    icon={<DeleteOutlined />}
                                                                    danger
                                                                    type="text"
                                                                    size="small"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleDeleteTrait(index);
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                        <Text type="secondary" style={{ display: 'block', marginTop: '0.5rem', fontSize: '0.85rem', lineHeight: '1.4' }}>
                                                            {trait.description}
                                                        </Text>
                                                    </div>
                                                )}
                                            </div>
                                        ))}

                                        {editingTraitIndex === -1 ? (
                                            <TraitForm
                                                onSave={handleSaveTrait}
                                                onCancel={handleCancelTrait}
                                                featureTypeSelection={featureTypeSelection}
                                                hasProgression={hasProgression}
                                            />
                                        ) : (
                                            <Button
                                                onClick={handleStartAddTrait}
                                                style={styles.addBonusBtn}
                                                icon={<PlusOutlined />}
                                            >
                                                Add Trait
                                            </Button>
                                        )}
                                    </div>
                                </Form.Item>
                            </div>
                        </div>




                    </Form>
                </div>
            </div>
        </>
    )}
        </Modal>
    )
}

const styles: { [key: string]: React.CSSProperties } = {
    header: {
        padding: '1rem 1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#f0eee3',
        borderBottom: '1px solid #e0dcd3',
        position: 'sticky',
        top: 0,
        zIndex: 1,
    },
    titleDivider: {
        height: '2rem',
        backgroundColor: '#e0dcd3',
        margin: '0px'
    },
    content: {
        padding: '1.7rem 1.5rem',
        display: 'flex',
        gap: '1.6rem',
        alignItems: 'flex-start',
    },
    imageFormContainer: {
        width: '30%',
        minWidth: '20rem',
        position: 'sticky',
        top: '7.7rem',
        alignSelf: 'flex-start',
        overflowY: 'auto',
    },
    formContainer: {
        backgroundColor: '#fbf9f6',
        borderRadius: '1rem',
        border: '1px solid #e0dcd3'
    },
    formHeader: {
        padding: '1rem 1.5rem',
        borderBottom: '1px solid #e0dcd3',
    },
    formContent: {
        padding: '1.5rem',
    },
    formRow: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
    },
    bonusCard: {
        backgroundColor: '#f5f2ea',
        border: '1px solid #e0dcd3',
        borderRadius: '0.6rem',
        overflow: 'hidden',
        marginBottom: '0.75rem',
    },
    traitCard: {
        backgroundColor: '#fff',
        border: '1px solid #e0dcd3',
        borderRadius: '0.75rem',
        padding: '1rem 1.25rem',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
        position: 'relative',
    },
    bonusCardHeader: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.9rem 1.1rem',
    },
    bonusCardContent: {
        padding: '1rem 1.1rem',
        borderTop: '1px solid #e0dcd3',
    },
    spellList: {
        maxHeight: '28rem',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
    },
    spellGroup: {
        borderRadius: '0.5rem',
        border: '1px solid #e0dcd3',
        overflow: 'hidden',
    },
    spellGroupHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.6rem',
        padding: '0.6rem 0.75rem',
        backgroundColor: '#f0eee3',
        borderBottom: '1px solid #e0dcd3',
    },
    spellGroupBadge: {
        width: '1.4rem',
        height: '1.4rem',
        borderRadius: '0.3rem',
        backgroundColor: '#8c7a52',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
    spellGrid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '0',
    },
    spellCard: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.55rem 0.75rem',
        cursor: 'pointer',
        borderBottom: '1px solid #e8e4da',
        transition: 'background-color 0.15s',
        backgroundColor: '#fbf9f6',
        userSelect: 'none',
    },
    spellCardSelected: {
        backgroundColor: '#f0e9d8',
        outline: '1.5px solid #b8a070',
        outlineOffset: '-1.5px',
    },
    spellCardImage: {
        width: '2rem',
        height: '2rem',
        borderRadius: '0.3rem',
        overflow: 'hidden',
        flexShrink: 0,
        backgroundColor: '#e0dcd3',
    },
    spellCardImagePlaceholder: {
        width: '100%',
        height: '100%',
        backgroundColor: '#d0ccc0',
    },
    addBonusBtn: {
        marginTop: '0.5rem',
        width: '100%',
    },
};
