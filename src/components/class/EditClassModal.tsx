import { Button, Checkbox, Col, Divider, Form, Input, InputNumber, Modal, Popover, Row, Select, Switch, Tag, Typography } from "antd";
import { CloseOutlined, DeleteOutlined, MinusOutlined, PictureOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";

// utils
import { SpellPreparationTypeEnum } from "@/utils/enums";

// hooks
import useEditClass from "@/hooks/class/useEditClass";
import { useTranslation } from "react-i18next";

// assets
import { SparklesIcon } from "@/assets";

// components
import ImageForm from "@/components/global/form/ImageForm";
import ClassResourceForm from "./ClassResourceForm";
import FeatureForm from "./FeatureForm";
import EditModalSkeleton from "@/components/global/common/EditModalSkeleton";

// interfaces
import type { WorkshopClassDetailReturn } from "@/models/classInterfaces";
import type { WorkshopSpellReturn } from "@/models/spellInterfaces";

const { Title, Text } = Typography;

interface Props {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: WorkshopClassDetailReturn, prevData: WorkshopClassDetailReturn) => Promise<void>;
    getData: () => Promise<WorkshopClassDetailReturn | null>;
    workshopSpells: WorkshopSpellReturn[];
}

export default function EditClassModal({ open, onClose, onSubmit, getData, workshopSpells }: Props) {

    const {
        classData,
        editClassForm,
        submitLoad,
        isSpellcaster,
        diceSelection,
        spellcastingAbilitySelection,
        spellPreparationSelection,
        spellcastingTypeSelection,
        preparedLvlBonusSelection,
        maxKnownTotal,
        maxCantripKnown,
        maxSpellKnown,
        setIsSpellcaster,
        handleFileChange,
        submitEditClass,
        handleCloseModal,
        handleMaxKnownTotal,
        handleMaxCantripKnown,
        handleMaxSpellKnown,
        scrollRef,
        spellList,
        spellSearch,
        setSpellSearch,
        selectedSpellIds,
        handleToggleSpell,
        features,
        featureTypeSelection,
        handleStartAddFeature,
        handleDeleteFeature,
        editingFeatureIndex,
        handleStartEditFeature,
        handleCancelFeature,
        handleSaveFeature,
        featureErrMsg,
        spellErrMsg,
        resources,
        editingResourceIndex,
        resourceErrMsg,
        handleStartAddResource,
        handleStartEditResource,
        handleCancelResource,
        handleSaveResource,
        handleDeleteResource,
        handleApplyPreset,
        presets,
    } = useEditClass(onClose, onSubmit, getData, workshopSpells);

    const { t } = useTranslation();
    const spellPreparationType = Form.useWatch('spellPreparationType', editClassForm);

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
            {!classData ? (
                <EditModalSkeleton />
            ) : (
                <>
                    <div style={styles.header}>
                        <div>
                            <Title level={2} style={{ margin: '0px' }}>{t('classes.editClassTitle')}</Title>
                            <Text style={{ fontSize: '1rem' }}>{t('classes.editClassDescription')}</Text>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <Button
                                icon={<SparklesIcon style={{ fontSize: '1.5rem' }} />}
                                style={{ padding: '1.2rem 1rem' }}
                                disabled={submitLoad}
                            >
                                {t('global.generateWithAi')}
                            </Button>
                            <Button
                                style={{ padding: '1.2rem 1.5rem' }}
                                type="primary"
                                onClick={() => editClassForm.submit()}
                                loading={submitLoad}
                            >
                                {t('classes.editClass')}
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
                                title={t('classes.classImage')}
                                submitLoad={submitLoad}
                                onFileChange={handleFileChange}
                                initialImage={classData.image || ""}
                            />
                        </div>

                        <div style={{ flex: '1' }}>
                            <Form
                                name="editClass"
                                layout="vertical"
                                form={editClassForm}
                                style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
                                onFinish={submitEditClass}
                                scrollToFirstError={{ behavior: 'smooth', block: 'center' }}
                            >
                                <div style={styles.formContainer}>
                                    <div style={styles.formHeader}>
                                        <Title level={4} style={{ marginTop: 0, marginBottom: 0 }}>
                                            {t('classes.basicInformation')}
                                        </Title>
                                        <Text type="secondary">{t('classes.basicInformationDescription')}</Text>
                                    </div>
                                    <div style={styles.formContent}>
                                        <Form.Item
                                            name="name"
                                            label={t('classes.className')}
                                            labelCol={{ style: { fontWeight: 'bold' } }}
                                            rules={[{ required: true, message: t('global.fieldRequired') }]}
                                        >
                                            <Input placeholder={t('classes.classNamePlaceholder')} size="large" maxLength={100} />
                                        </Form.Item>
                                        <Form.Item
                                            name="description"
                                            label={t('classes.description')}
                                            labelCol={{ style: { fontWeight: 'bold' } }}
                                            rules={[{ required: true, message: t('global.fieldRequired') }]}
                                        >
                                            <Input.TextArea rows={5} placeholder={t('classes.descriptionPlaceholder')} maxLength={500} showCount />
                                        </Form.Item>

                                        <Row style={styles.formRow}>
                                            <Col style={{ width: '48%' }}>
                                                <Form.Item
                                                    name="hitDie"
                                                    label={t('classes.hitDie')}
                                                    labelCol={{ style: { fontWeight: 'bold' } }}
                                                    initialValue="d8"
                                                    required
                                                >
                                                    <Select
                                                        placeholder={t('classes.hitDiePlaceholder')}
                                                        size="large"
                                                        options={diceSelection}
                                                        showSearch
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col style={{ width: '48%' }}>
                                                <Form.Item
                                                    name="subclassLevel"
                                                    label={t('classes.subclassLevel')}
                                                    labelCol={{ style: { fontWeight: 'bold' } }}
                                                    initialValue={3}
                                                    required
                                                >
                                                    <InputNumber
                                                        placeholder={t('classes.subclassLevelPlaceholder')}
                                                        size="large"
                                                        min={1}
                                                        max={20}
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
                                            <Row style={styles.formRow}>
                                                <Col style={{ width: '48%' }}>
                                                    <Form.Item
                                                        name="spellPreparationType"
                                                        label={t('classes.preparationType')}
                                                        labelCol={{ style: { fontWeight: 'bold' } }}
                                                        rules={[{ required: true, message: t('global.fieldRequired') }]}
                                                    >
                                                        <Select
                                                            placeholder={t('classes.preparationTypePlaceholder')}
                                                            size="large"
                                                            options={spellPreparationSelection}
                                                            showSearch
                                                        />
                                                    </Form.Item>
                                                </Col>
                                                <Col style={{ width: '48%' }}>
                                                    <Form.Item
                                                        name="spellcastingType"
                                                        label={t('classes.spellcastingType')}
                                                        labelCol={{ style: { fontWeight: 'bold' } }}
                                                        rules={[{ required: true, message: t('global.fieldRequired') }]}
                                                    >
                                                        <Select
                                                            placeholder={t('classes.spellcastingTypePlaceholder')}
                                                            size="large"
                                                            options={spellcastingTypeSelection}
                                                            showSearch
                                                        />
                                                    </Form.Item>
                                                </Col>
                                            </Row>

                                            <div style={styles.maxKnownCard}>
                                                <div style={styles.bonusCardHeader}>
                                                    <div>
                                                        <Text strong style={{ fontSize: '0.85rem', display: 'block' }}>
                                                            Maximum Cantrips/Spells Known by Level
                                                        </Text>
                                                    </div>
                                                    <Popover
                                                        content={
                                                            <div style={styles.presetContainer}>
                                                                <Title level={5} style={{ gridColumn: 'span 2', margin: '0 0 0.5rem 0' }}>
                                                                    Preset Options
                                                                </Title>
                                                                {presets.map((preset) => (
                                                                    <Button
                                                                        key={preset.name}
                                                                        onClick={() => handleApplyPreset(preset)}
                                                                    >
                                                                        <Text strong style={{ textTransform: 'capitalize' }}>
                                                                            {t(`classes.presets.${preset.name}`, preset.name.replace(/([A-Z])/g, ' $1').trim())}
                                                                        </Text>
                                                                    </Button>
                                                                ))}
                                                            </div>
                                                        }
                                                        trigger="click"
                                                        placement="bottom"
                                                        styles={{
                                                            container: {
                                                                padding: '1rem', backgroundColor: '#fbf9f6', border: '1px solid #e0dcd3'
                                                            }
                                                        }}
                                                    >
                                                        <Button type="primary">
                                                            Presets
                                                        </Button>
                                                    </Popover>
                                                </div>
                                                <div style={styles.maxKnownCardContent}>
                                                    <div ref={scrollRef} style={styles.maxKnownRow}>
                                                        {Array.from({ length: maxKnownTotal }).map((_, index) => {
                                                            return (
                                                                <div key={index} style={styles.maxKnownCol}>
                                                                    <Text strong>{index + 1}</Text>
                                                                    <InputNumber
                                                                        style={styles.maxKnownInput}
                                                                        min={0}
                                                                        max={50}
                                                                        value={maxCantripKnown[index]?.amount || 0}
                                                                        onChange={(val) => handleMaxCantripKnown(index, val || 0)}
                                                                        mode="spinner"
                                                                        controls={false}

                                                                    />
                                                                    {spellPreparationType !== SpellPreparationTypeEnum.PREPARED && (
                                                                        <InputNumber
                                                                            style={styles.maxKnownInput}
                                                                            min={0}
                                                                            max={50}
                                                                            value={maxSpellKnown[index]?.amount || 0}
                                                                            onChange={(val) => handleMaxSpellKnown(index, val || 0)}
                                                                            mode="spinner"
                                                                            controls={false}
                                                                        />
                                                                    )}
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                    <div style={styles.maxKnownLabelContainer}>
                                                        <Text strong>Cantrips</Text>
                                                        {spellPreparationType !== SpellPreparationTypeEnum.PREPARED && (
                                                            <Text strong>Spells</Text>
                                                        )}
                                                    </div>
                                                    <div style={styles.maxKnownControlContainer}>
                                                        <Button
                                                            type="text"
                                                            icon={<PlusOutlined />}
                                                            onClick={() => handleMaxKnownTotal(maxKnownTotal + 1)}
                                                        />
                                                        <Button
                                                            type="text"
                                                            icon={<MinusOutlined />}
                                                            onClick={() => handleMaxKnownTotal(maxKnownTotal - 1)}
                                                            disabled={maxKnownTotal === 1}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            {spellPreparationType === SpellPreparationTypeEnum.PREPARED && (
                                                <>
                                                    <Form.Item
                                                        name="preparedLvlBonus"
                                                        label={t('classes.preparedLevelBonus')}
                                                        labelCol={{ style: { fontWeight: 'bold' } }}
                                                        initialValue={0}
                                                        rules={[{ required: true, message: t('global.fieldRequired') }]}
                                                    >
                                                        <Select
                                                            placeholder={t('classes.preparedLevelBonusPlaceholder')}
                                                            size="large"
                                                            options={preparedLvlBonusSelection}
                                                        />
                                                    </Form.Item>

                                                    <div style={styles.bonusCard}>
                                                        <div style={styles.bonusCardHeader}>
                                                            <div>
                                                                <Text strong style={{ fontSize: '0.95rem', display: 'block' }}>{t('classes.preparedModifierBonus')}</Text>
                                                                <Text type="secondary" style={{ fontSize: '0.82rem' }}>{t('classes.preparedModifierBonusDescription')}</Text>
                                                            </div>
                                                            <Form.Item name="preparedModBonus" valuePropName="checked" noStyle initialValue={false}>
                                                                <Switch />
                                                            </Form.Item>
                                                        </div>
                                                    </div>
                                                </>
                                            )}

                                            <div style={styles.bonusCard}>
                                                <div style={styles.bonusCardHeader}>
                                                    <div>
                                                        <Text strong style={{ fontSize: '0.95rem', display: 'block' }}>Spells</Text>
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
                                    <div style={styles.formHeader}>
                                        <Title level={4} style={{ marginTop: 0, marginBottom: 0 }}>
                                            {t('classes.features')}
                                        </Title>
                                        <Text type="secondary">{t('classes.featuresDescription')}</Text>
                                    </div>
                                    <div style={{ ...styles.formContent, maxHeight: '40rem', overflowY: 'auto' }}>
                                        <Form.Item
                                            help={featureErrMsg}
                                            validateStatus={featureErrMsg ? 'error' : ''}
                                            style={{ marginBottom: 0 }}
                                        >
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                                {features.map((feature, index) => (
                                                    <div key={index}>
                                                        {editingFeatureIndex === index ? (
                                                            <FeatureForm
                                                                initialValues={feature}
                                                                onSave={handleSaveFeature}
                                                                onCancel={handleCancelFeature}
                                                                featureTypeSelection={featureTypeSelection}
                                                                isEdit
                                                            />
                                                        ) : (
                                                            <div style={styles.featureCard} onClick={() => handleStartEditFeature(index)}>
                                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                                        <Text strong style={{ fontSize: '1rem' }}>{feature.name}</Text>
                                                                        <Tag color={feature.type === 'active' ? 'blue' : 'default'} style={{ textTransform: 'capitalize', borderRadius: '4px' }}>
                                                                            {t(`classes.${feature.type}`)}
                                                                        </Tag>
                                                                    </div>
                                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                                        <Text type="secondary" style={{ fontSize: '0.85rem', fontWeight: 500 }}>
                                                                            Lvl {feature.level}
                                                                        </Text>
                                                                        <Button
                                                                            icon={<DeleteOutlined />}
                                                                            danger
                                                                            type="text"
                                                                            size="small"
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                handleDeleteFeature(index);
                                                                            }}
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <Text type="secondary" style={{ display: 'block', marginTop: '0.5rem', fontSize: '0.85rem', lineHeight: '1.4' }}>
                                                                    {feature.description}
                                                                </Text>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}

                                                {editingFeatureIndex === -1 ? (
                                                    <FeatureForm
                                                        onSave={handleSaveFeature}
                                                        onCancel={handleCancelFeature}
                                                        featureTypeSelection={featureTypeSelection}
                                                    />
                                                ) : (
                                                    <Button
                                                        onClick={handleStartAddFeature}
                                                        style={styles.addBonusBtn}
                                                        icon={<PlusOutlined />}
                                                    >
                                                        {t('classes.addFeature')}
                                                    </Button>
                                                )}
                                            </div>
                                        </Form.Item>
                                    </div>
                                </div>

                                <div style={styles.formContainer}>
                                    <div style={styles.formHeader}>
                                        <Title level={4} style={{ marginTop: 0, marginBottom: 0 }}>
                                            {t('classes.resources')}
                                        </Title>
                                        <Text type="secondary">{t('classes.resourcesDescription')}</Text>
                                    </div>
                                    <div style={{ ...styles.formContent, maxHeight: '40rem', overflowY: 'auto' }}>
                                        <Form.Item
                                            help={resourceErrMsg}
                                            validateStatus={resourceErrMsg ? 'error' : ''}
                                            style={{ marginBottom: 0 }}
                                        >
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                                {resources.map((resource, index) => (
                                                    <div key={index}>
                                                        {editingResourceIndex === index ? (
                                                            <ClassResourceForm
                                                                initialValues={resource}
                                                                onSave={handleSaveResource}
                                                                onCancel={handleCancelResource}
                                                                isEdit
                                                                imageUrlEdit={resource.previewUrl || ""}
                                                            />
                                                        ) : (
                                                            <div style={styles.resourceCard} onClick={() => handleStartEditResource(index)}>
                                                                <div style={{ ...styles.resourceColorBar, backgroundColor: resource.color }} />
                                                                <div style={styles.resourceImageContainer}>
                                                                    {resource.previewUrl || resource.image ? (
                                                                        <img src={resource.previewUrl || resource.image || ""} alt={resource.name} style={styles.resourceImage} />
                                                                    ) : (
                                                                        <div style={styles.resourceImagePlaceholder}>
                                                                            <PictureOutlined style={{ fontSize: '1.2rem', color: '#8c7a52' }} />
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                                        <Text strong style={{ fontSize: '1rem' }}>{resource.name}</Text>
                                                                        <Button
                                                                            icon={<DeleteOutlined />}
                                                                            danger
                                                                            type="text"
                                                                            size="small"
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                handleDeleteResource(index);
                                                                            }}
                                                                        />
                                                                    </div>
                                                                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem', marginBottom: '0.5rem' }}>
                                                                        <Tag color="orange" style={{ fontSize: '0.7rem', padding: '0 0.4rem', borderRadius: '4px' }}>
                                                                            Short: {resource.resourceRecovery.shortRest.value} ({resource.resourceRecovery.shortRest.type})
                                                                        </Tag>
                                                                        <Tag color="purple" style={{ fontSize: '0.7rem', padding: '0 0.4rem', borderRadius: '4px' }}>
                                                                            Long: {resource.resourceRecovery.longRest.value} ({resource.resourceRecovery.longRest.type})
                                                                        </Tag>
                                                                    </div>
                                                                    <Text
                                                                        type="secondary"
                                                                        style={{
                                                                            display: '-webkit-box',
                                                                            WebkitLineClamp: 2,
                                                                            WebkitBoxOrient: 'vertical',
                                                                            overflow: 'hidden',
                                                                            fontSize: '0.85rem',
                                                                            lineHeight: '1.4'
                                                                        }}
                                                                    >
                                                                        {resource.description}
                                                                    </Text>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}

                                                {editingResourceIndex === -1 ? (
                                                    <ClassResourceForm
                                                        onSave={handleSaveResource}
                                                        onCancel={handleCancelResource}
                                                    />
                                                ) : (
                                                    <Button
                                                        onClick={handleStartAddResource}
                                                        style={styles.addBonusBtn}
                                                        icon={<PlusOutlined />}
                                                    >
                                                        {t('classes.addResource')}
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
    featureCard: {
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
    maxKnownCard: {
        backgroundColor: '#f5f2ea',
        border: '1px solid #e0dcd3',
        borderRadius: '0.6rem',
        overflow: 'hidden',
        marginBottom: '1.2rem',
    },
    maxKnownCardContent: {
        padding: '1rem 1.1rem',
        borderTop: '1px solid #e0dcd3',
        position: 'relative',
    },
    maxKnownRow: {
        display: 'flex',
        gap: '0.5rem',
        width: 'calc(100vw - 32rem)',
        maxWidth: '40rem',
        overflowX: 'auto',
        paddingLeft: '5rem',
        paddingBottom: '1rem',
        paddingRight: '3rem',
    },
    maxKnownCol: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        alignItems: 'center',
    },
    maxKnownInput: {
        width: '2.35rem',
    },
    maxKnownLabelContainer: {
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        fontSize: '1rem',
        padding: '3.1rem 1rem 0px 1rem',
        backgroundColor: '#f5f2ea',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.3rem',
        borderRight: '1px solid #e0dcd3',
    },
    maxKnownControlContainer: {
        height: '100%',
        position: 'absolute',
        top: 0,
        right: 0,
        fontSize: '1rem',
        backgroundColor: '#f5f2ea',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '1rem',
        borderLeft: '1px solid #e0dcd3',
        padding: '0px 0.5rem',
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
    resourceCard: {
        backgroundColor: '#fff',
        border: '1px solid #e0dcd3',
        borderRadius: '0.75rem',
        padding: '1rem 1.25rem',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
        position: 'relative',
        display: 'flex',
        gap: '1rem',
        alignItems: 'flex-start',
    },
    resourceColorBar: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        width: '4px',
        borderTopLeftRadius: '0.75rem',
        borderBottomLeftRadius: '0.75rem',
    },
    resourceImageContainer: {
        width: '3.5rem',
        height: '3.5rem',
        borderRadius: '0.5rem',
        overflow: 'hidden',
        flexShrink: 0,
        border: '1px solid #e0dcd3',
        backgroundColor: '#f5f2ea',
    },
    resourceImage: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
    resourceImagePlaceholder: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    resourceImageUploadContainer: {
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '1.5rem',
    },
    resourceImagePreview: {
        width: '12rem',
        height: '12rem',
        borderRadius: '1rem',
        border: '2px dashed #d4cebe',
        backgroundColor: '#fbf9f6',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.2s ease',
    },
    resourceImageRemoveBtn: {
        position: 'absolute',
        top: '0.5rem',
        right: '0.5rem',
        zIndex: 2,
    },
    recoveryInputCard: {
        borderRadius: '0.5rem',
        padding: '0.75rem',
    },
    presetContainer: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '0.75rem',
        width: '18rem',
    },
    presetBtn: {
        height: '3.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        border: '1px solid #e0dcd3',
        borderRadius: '0.6rem',
        boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
    }
}
