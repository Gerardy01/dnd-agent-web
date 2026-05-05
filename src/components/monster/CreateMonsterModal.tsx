import { Button, Col, Divider, Form, Input, InputNumber, Modal, Row, Select, Typography } from "antd";

// hooks
import useCreateMonster from "@/hooks/monster/useCreateMonster";
import { useTranslation } from "react-i18next";

// assets
import { SparklesIcon } from "@/assets";
import { CloseOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";

// components
import ImageForm from "@/components/global/form/ImageForm";

// interfaces
import type { CreateMonsterDTO } from "@/models/monsterInterfaces";

interface Props {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: CreateMonsterDTO) => Promise<void>;
}

const { Title, Text } = Typography;

export default function CreateMonsterModal({ open, onClose, onSubmit }: Props) {

    const {
        createMonsterForm,
        sizeSelection,
        typeSelection,
        alignmentSelection,
        movementSelection,
        sensesSelection,
        damageTypeSelection,
        conditionSelection,
        speedValue,
        sensesValue,
        actionsValue,
        submitLoad,
        handleFileChange,
        handleAddSpeed,
        handleUpdateSpeedStat,
        handleUpdateSpeedValue,
        handleDeleteSpeed,
        handleAddSenses,
        handleUpdateSensesStat,
        handleUpdateSensesValue,
        handleDeleteSenses,
        handleAddAction,
        handleUpdateActionName,
        handleUpdateActionDescription,
        handleDeleteAction,
        submitCreateMonster,
        handleCloseModal,
    } = useCreateMonster(onClose, onSubmit);

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
            <div style={styles.header}>
                <div>
                    <Title level={2} style={{ margin: '0px' }}>{t('monsters.createMonsterTitle')}</Title>
                    <Text style={{ fontSize: '1rem' }}>{t('monsters.createMonsterDescription')}</Text>
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
                        onClick={() => createMonsterForm.submit()}
                        loading={submitLoad}
                    >
                        {t('monsters.createMonster')}
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
                        title={t('monsters.monsterImage')}
                        submitLoad={submitLoad}
                        onFileChange={handleFileChange}
                    />
                </div>
                <div style={{ flex: '1' }}>
                    <Form
                        name="createMonster"
                        layout="vertical"
                        form={createMonsterForm}
                        style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
                        onFinish={submitCreateMonster}
                        scrollToFirstError={{ behavior: 'smooth', block: 'center' }}
                    >
                        <div style={styles.formContainer}>
                            <div style={styles.formHeader}>
                                <Title level={4} style={{ marginTop: 0, marginBottom: 0 }}>
                                    {t('monsters.basicInformation')}
                                </Title>
                                <Text type="secondary">{t('monsters.basicInformationDescription')}</Text>
                            </div>
                            <div style={styles.formContent}>
                                <Form.Item
                                    name="name"
                                    label={t('monsters.monsterName')}
                                    labelCol={{ style: { fontWeight: 'bold' } }}
                                    rules={[{ required: true, message: t('global.fieldRequired') }]}
                                >
                                    <Input
                                        placeholder={t('monsters.monsterNamePlaceholder')}
                                        size="large"
                                        maxLength={100}
                                    />
                                </Form.Item>
                                <Row style={styles.formRow}>
                                    <Col style={{ width: '48%' }}>
                                        <Form.Item
                                            name="alignment"
                                            label={t('monsters.alignment')}
                                            labelCol={{ style: { fontWeight: 'bold' } }}
                                            rules={[{ required: true, message: t('global.fieldRequired') }]}
                                            initialValue="unaligned"
                                        >
                                            <Select
                                                placeholder={t('monsters.alignmentPlaceholder')}
                                                size="large"
                                                options={alignmentSelection}
                                                showSearch
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col style={{ width: '48%' }}>
                                        <Form.Item
                                            name="size"
                                            label={t('monsters.size')}
                                            labelCol={{ style: { fontWeight: 'bold' } }}
                                            rules={[{ required: true, message: t('global.fieldRequired') }]}
                                        >
                                            <Select
                                                placeholder={t('monsters.sizePlaceholder')}
                                                size="large"
                                                options={sizeSelection}
                                                showSearch
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row style={styles.formRow}>
                                    <Col style={{ width: '48%' }}>
                                        <Form.Item
                                            name="type"
                                            label={t('monsters.type')}
                                            labelCol={{ style: { fontWeight: 'bold' } }}
                                            rules={[{ required: true, message: t('global.fieldRequired') }]}
                                        >
                                            <Select
                                                placeholder={t('monsters.typePlaceholder')}
                                                size="large"
                                                options={typeSelection}
                                                showSearch
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Form.Item
                                    name="description"
                                    label={t('monsters.description')}
                                    labelCol={{ style: { fontWeight: 'bold' } }}
                                    rules={[{ required: true, message: t('global.fieldRequired') }]}
                                >
                                    <Input.TextArea
                                        rows={4}
                                        placeholder={t('monsters.descriptionPlaceholder')}
                                        maxLength={500}
                                        showCount
                                    />
                                </Form.Item>
                                <Form.Item
                                    name="appearance"
                                    label={t('monsters.appearance')}
                                    labelCol={{ style: { fontWeight: 'bold' } }}
                                    rules={[{ required: true, message: t('global.fieldRequired') }]}
                                >
                                    <Input.TextArea
                                        rows={4}
                                        placeholder={t('monsters.appearancePlaceholder')}
                                        maxLength={500}
                                        showCount
                                    />
                                </Form.Item>
                                <Form.Item
                                    name="languages"
                                    label={t('monsters.languages')}
                                    labelCol={{ style: { fontWeight: 'bold' } }}
                                >
                                    <Input.TextArea
                                        rows={3}
                                        placeholder={t('monsters.languagesPlaceholder')}
                                        maxLength={200}
                                        showCount
                                    />
                                </Form.Item>
                            </div>
                        </div>

                        <div style={styles.formContainer}>
                            <div style={styles.formHeader}>
                                <Title level={4} style={{ marginTop: 0, marginBottom: 0 }}>
                                    {t('monsters.monsterProperties')}
                                </Title>
                                <Text type="secondary">{t('monsters.monsterPropertiesDescription')}</Text>
                            </div>
                            <div style={styles.formContent}>
                                {/* Speed Card */}
                                <div style={{ ...styles.bonusCard, backgroundColor: '#f8f6f0' }}>
                                    <div style={styles.bonusCardHeader}>
                                        <div>
                                            <Text strong style={{ fontSize: '0.95rem', display: 'block' }}>{t('monsters.speed')}</Text>
                                            <Text type="secondary" style={{ fontSize: '0.82rem' }}>{t('monsters.speedDescription')}</Text>
                                        </div>
                                    </div>
                                    <div style={styles.bonusCardContent}>
                                        {/* Table header */}
                                        {speedValue.length > 0 && (
                                            <div style={styles.bonusTableHeader}>
                                                <Text strong style={{ flex: 1 }}>{t('monsters.movementType')}</Text>
                                                <Text strong style={{ width: '7rem' }}>{t('monsters.valueColumnHeader')}</Text>
                                                <Text style={{ width: '2.2rem' }} />
                                            </div>
                                        )}

                                        {/* Rows */}
                                        {speedValue.map((s, index) => (
                                            <div key={index} style={styles.bonusTableRow}>
                                                <Select
                                                    style={{ flex: 1 }}
                                                    placeholder={t('monsters.selectMovementPlaceholder')}
                                                    value={s.selection || undefined}
                                                    options={movementSelection.filter(opt => !speedValue.some((sv, i) => i !== index && sv.selection === opt.value))}
                                                    onChange={(val) => handleUpdateSpeedStat(index, val)}
                                                    showSearch
                                                />
                                                <InputNumber
                                                    style={{ width: '7rem' }}
                                                    min={0}
                                                    value={s.value}
                                                    onChange={(val) => handleUpdateSpeedValue(index, val ?? 0)}
                                                />
                                                <Button
                                                    onClick={() => handleDeleteSpeed(index)}
                                                    icon={<DeleteOutlined />}
                                                    type="text"
                                                    danger
                                                />
                                            </div>
                                        ))}
                                        <Button
                                            onClick={handleAddSpeed}
                                            style={styles.addBonusBtn}
                                            icon={<PlusOutlined />}
                                            disabled={speedValue.length >= movementSelection.length}
                                        >
                                            {t('monsters.addMovement')}
                                        </Button>
                                    </div>
                                </div>

                                {/* Senses Card */}
                                <div style={{ ...styles.bonusCard, backgroundColor: '#f8f6f0' }}>
                                    <div style={styles.bonusCardHeader}>
                                        <div>
                                            <Text strong style={{ fontSize: '0.95rem', display: 'block' }}>{t('monsters.senses')}</Text>
                                            <Text type="secondary" style={{ fontSize: '0.82rem' }}>{t('monsters.sensesDescription')}</Text>
                                        </div>
                                    </div>
                                    <div style={styles.bonusCardContent}>
                                        {/* Table header */}
                                        {sensesValue.length > 0 && (
                                            <div style={styles.bonusTableHeader}>
                                                <Text strong style={{ flex: 1 }}>{t('monsters.senseType')}</Text>
                                                <Text strong style={{ width: '7rem' }}>{t('monsters.distanceFt')}</Text>
                                                <Text style={{ width: '2.2rem' }} />
                                            </div>
                                        )}

                                        {/* Rows */}
                                        {sensesValue.map((s, index) => (
                                            <div key={index} style={styles.bonusTableRow}>
                                                <Select
                                                    style={{ flex: 1 }}
                                                    placeholder={t('monsters.selectSensePlaceholder')}
                                                    value={s.selection || undefined}
                                                    options={sensesSelection.filter(opt => !sensesValue.some((sv, i) => i !== index && sv.selection === opt.value))}
                                                    onChange={(val) => handleUpdateSensesStat(index, val)}
                                                    showSearch
                                                />
                                                <InputNumber
                                                    style={{ width: '7rem' }}
                                                    min={0}
                                                    value={s.value}
                                                    onChange={(val) => handleUpdateSensesValue(index, val ?? 0)}
                                                />
                                                <Button
                                                    onClick={() => handleDeleteSenses(index)}
                                                    icon={<DeleteOutlined />}
                                                />
                                            </div>
                                        ))}
                                        <Button
                                            onClick={handleAddSenses}
                                            style={styles.addBonusBtn}
                                            icon={<PlusOutlined />}
                                            disabled={sensesValue.length >= sensesSelection.length}
                                        >
                                            {t('monsters.addSenses')}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div style={styles.formContainer}>
                            <div style={styles.formHeader}>
                                <Title level={4} style={{ marginTop: 0, marginBottom: 0 }}>
                                    {t('monsters.stats')}
                                </Title>
                                <Text type="secondary">{t('monsters.statsDescription')}</Text>
                            </div>
                            <div style={styles.formContent}>
                                <Row gutter={16} style={{ marginBottom: '1rem' }}>
                                    <Col span={12}>
                                        <Form.Item name="minHp" label={t('monsters.minHp')} initialValue={10} rules={[{ required: true }]}>
                                            <InputNumber style={{ width: '100%' }} min={0} max={1000000} size="large" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item name="maxHp" label={t('monsters.maxHp')} initialValue={20} rules={[{ required: true }]}>
                                            <InputNumber style={{ width: '100%' }} min={0} max={1000000} size="large" />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Divider style={{ margin: '1rem 0' }} />

                                <Row gutter={16} style={{ marginBottom: '1rem' }}>
                                    <Col span={12}>
                                        <div style={styles.statBox}>
                                            <div style={styles.statBoxLabel}>AC</div>
                                            <Form.Item name="ac" initialValue={10} noStyle>
                                                <InputNumber mode="spinner" style={styles.statBoxInput} min={0} bordered={false} controls={false} />
                                            </Form.Item>
                                        </div>
                                    </Col>
                                    <Col span={12}>
                                        <div style={styles.statBox}>
                                            <div style={styles.statBoxLabel}>CR</div>
                                            <Form.Item name="cr" initialValue={0} noStyle>
                                                <InputNumber step={0.1} mode="spinner" style={styles.statBoxInput} min={0} bordered={false} controls={false} />
                                            </Form.Item>
                                        </div>
                                    </Col>
                                </Row>

                                <Divider style={{ margin: '1rem 0' }} />

                                <Row gutter={16}>
                                    {['str', 'dex', 'con', 'int', 'wis', 'cha'].map((stat) => (
                                        <Col span={12} key={stat} style={{ marginBottom: '1rem' }}>
                                            <div style={styles.statBox}>
                                                <div style={styles.statBoxLabel}>{stat.toUpperCase()}</div>
                                                <Form.Item name={stat} initialValue={10} noStyle>
                                                    <InputNumber mode="spinner" style={styles.statBoxInput} min={0} max={999} bordered={false} controls={false} />
                                                </Form.Item>
                                            </div>
                                        </Col>
                                    ))}
                                </Row>
                            </div>
                        </div>

                        <div style={styles.formContainer}>
                            <div style={styles.formHeader}>
                                <Title level={4} style={{ marginTop: 0, marginBottom: 0 }}>
                                    {t('monsters.additionalProperties')}
                                </Title>
                                <Text type="secondary">{t('monsters.additionalPropertiesDescription')}</Text>
                            </div>
                            <div style={styles.formContent}>
                                <Form.Item name="immunities" label={t('items.immunities')} initialValue={[]}>
                                    <Select mode="multiple" placeholder={t('items.immunitiesPlaceholder')} size="large" options={damageTypeSelection} />
                                </Form.Item>
                                <Form.Item name="resistances" label={t('items.resistances')} initialValue={[]}>
                                    <Select mode="multiple" placeholder={t('items.resistancesPlaceholder')} size="large" options={damageTypeSelection} />
                                </Form.Item>
                                <Form.Item name="vulnerabilities" label={t('items.vulnerabilities')} initialValue={[]}>
                                    <Select mode="multiple" placeholder={t('items.vulnerabilitiesPlaceholder')} size="large" options={damageTypeSelection} />
                                </Form.Item>
                                <Form.Item name="conditionImmunities" label={t('items.conditionImmunities')} initialValue={[]}>
                                    <Select mode="multiple" placeholder={t('items.conditionImmunitiesPlaceholder')} size="large" options={conditionSelection} />
                                </Form.Item>
                            </div>
                        </div>

                        <div style={styles.formContainer}>
                            <div style={styles.formHeader}>
                                <Title level={4} style={{ marginTop: 0, marginBottom: 0 }}>
                                    {t('monsters.actions')}
                                </Title>
                                <Text type="secondary">{t('monsters.actionsDescription')}</Text>
                            </div>
                            <div style={styles.formContent}>
                                {actionsValue.map((action, index) => (
                                    <div key={index} style={{ ...styles.bonusCard, backgroundColor: '#f8f6f0' }}>
                                        <div style={styles.bonusCardHeader}>
                                            <div>
                                                <Text strong style={{ fontSize: '0.95rem', display: 'block' }}>
                                                    {t('monsters.action')} #{index + 1}
                                                </Text>
                                            </div>
                                            {actionsValue.length > 1 && (
                                                <Button
                                                    onClick={() => handleDeleteAction(index)}
                                                    icon={<DeleteOutlined />}
                                                    type="text"
                                                    danger
                                                />
                                            )}
                                        </div>
                                        <div style={styles.bonusCardContent}>
                                            <Form.Item
                                                label={t('monsters.actionName')}
                                                name={['actions', index, 'name']}
                                                rules={[{ required: true, message: t('global.fieldRequired') }]}
                                                labelCol={{ style: { fontWeight: 'bold' } }}
                                            >
                                                <Input
                                                    placeholder={t('monsters.actionNamePlaceholder')}
                                                    value={action.name}
                                                    onChange={(e) => handleUpdateActionName(index, e.target.value)}
                                                />
                                            </Form.Item>
                                            <Form.Item
                                                label={t('monsters.actionDescription')}
                                                name={['actions', index, 'description']}
                                                rules={[{ required: true, message: t('global.fieldRequired') }]}
                                                labelCol={{ style: { fontWeight: 'bold' } }}
                                            >
                                                <Input.TextArea
                                                    rows={3}
                                                    placeholder={t('monsters.actionDescriptionPlaceholder')}
                                                    maxLength={200}
                                                    showCount
                                                    value={action.description}
                                                    onChange={(e) => handleUpdateActionDescription(index, e.target.value)}
                                                />
                                            </Form.Item>
                                        </div>
                                    </div>
                                ))}
                                <Button
                                    onClick={handleAddAction}
                                    style={styles.addBonusBtn}
                                    icon={<PlusOutlined />}
                                >
                                    {t('monsters.addAction')}
                                </Button>
                                {actionsValue.length === 0 && <Text type="danger">{t('monsters.actionRequired')}</Text>}
                            </div>
                        </div>
                    </Form>
                </div>
            </div>
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
    titleDivider: {
        height: '2rem',
        backgroundColor: '#e0dcd3',
        margin: '0px'
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
    bonusTableHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.6rem',
        marginBottom: '0.5rem',
        paddingBottom: '0.4rem',
        borderBottom: '1px solid #e0dcd3',
    },
    bonusTableRow: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.6rem',
        marginBottom: '0.5rem',
    },
    addBonusBtn: {
        marginTop: '0.5rem',
        width: '100%',
    },
    bonusCard: {
        backgroundColor: '#f5f2ea',
        border: '1px solid #e0dcd3',
        borderRadius: '0.6rem',
        overflow: 'hidden',
        marginBottom: '0.75rem',
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
    statBox: {
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#f5f2ea',
        border: '1px solid #e0dcd3',
        borderRadius: '4px',
        height: '4rem',
        overflow: 'hidden',
    },
    statBoxLabel: {
        width: '35%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#434343',
        fontWeight: 'bold',
        fontSize: '1.1rem',
        borderRight: '1px solid #e0dcd3',
        backgroundColor: 'rgba(0, 0, 0, 0.02)',
    },
    statBoxInput: {
        flex: 1,
        color: '#434343',
        fontSize: '1.2rem',
        textAlign: 'center',
        backgroundColor: 'transparent',
    },
}
