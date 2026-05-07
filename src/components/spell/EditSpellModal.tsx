import { AutoComplete, Button, Col, Divider, Form, Input, InputNumber, Modal, Row, Select, Slider, Switch, Typography } from "antd";
import { CloseOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";

// assets
import { SparklesIcon } from "@/assets";

// hooks
import useEditSpell from "@/hooks/spell/useEditSpell";
import { useTranslation } from "react-i18next";

// components
import ImageForm from "@/components/global/form/ImageForm";

// interfaces
import type { Spell } from "@/models/spellInterfaces";
interface Props {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: Spell) => Promise<void>;
    getData: () => Promise<Spell | null>;
}

const { Title, Text } = Typography;


export default function EditSpellModal({ open, onClose, onSubmit, getData }: Props) {

    const {
        spell,
        editSpellForm,
        submitLoad,
        isAttack,
        setIsAttack,
        requiresRangedAttack,
        setRequiresRangedAttack,
        damageRollValue,
        damageRollErrMsg,
        isSave,
        setIsSave,
        successDamageAdj,
        setSuccessDamageAdj,
        failDamageAdj,
        setFailDamageAdj,
        spellLevelSelection,
        spellSchoolSelection,
        savingThrowStatSelection,
        damageTypeSelection,
        diceSelection,
        handleFileChange,
        handleAddDamageRoll,
        handleUpdateDamageRollCount,
        handleUpdateDamageRollDice,
        handleUpdateDamageRollBonus,
        handleUpdateDamageRollType,
        handleDeleteDamageRoll,
        submitEditSpell,
        handleCloseModal,
    } = useEditSpell(onClose, onSubmit, getData);

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
            {spell ? (
                <>
                    <div style={styles.header}>
                        <div>
                            <Title level={2} style={{ margin: '0px' }}>{t('spells.editSpellTitle')}</Title>
                            <Text style={{ fontSize: '1rem' }}>{t('spells.editSpellDescription')}</Text>
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
                                onClick={() => editSpellForm.submit()}
                                loading={submitLoad}
                            >
                                {t('spells.editSpell')}
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
                                title="Spell Image"
                                submitLoad={submitLoad}
                                onFileChange={handleFileChange}
                                initialImage={spell?.image || ""}
                            />
                        </div>

                        <div style={{ flex: '1' }}>
                            <Form
                                name="editSpell"
                                layout="vertical"
                                form={editSpellForm}
                                style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
                                onFinish={submitEditSpell}
                                scrollToFirstError={{ behavior: 'smooth', block: 'center' }}
                            >
                                <div style={styles.formContainer}>
                                    <div style={styles.formHeader}>
                                        <Title level={4} style={{ marginTop: 0, marginBottom: 0 }}>
                                            {t('items.basicInformation')}
                                        </Title>
                                        <Text type="secondary">{t('items.basicInformationDescription')}</Text>
                                    </div>
                                    <div style={styles.formContent}>
                                        <Form.Item
                                            name="name"
                                            label={t('items.itemName')}
                                            labelCol={{ style: { fontWeight: 'bold' } }}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: t('global.fieldRequired'),
                                                },
                                            ]}
                                        >
                                            <Input
                                                placeholder={t('items.itemNamePlaceholder')}
                                                size="large"
                                                maxLength={100}
                                            />
                                        </Form.Item>
                                        <Form.Item
                                            name="description"
                                            label={t('items.description')}
                                            labelCol={{ style: { fontWeight: 'bold' } }}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: t('global.fieldRequired'),
                                                },
                                            ]}
                                        >
                                            <Input.TextArea
                                                rows={5}
                                                placeholder={t('items.descriptionPlaceholder')}
                                                maxLength={500}
                                                showCount
                                            />
                                        </Form.Item>
                                    </div>
                                </div>
                                <div style={styles.formContainer}>
                                    <div style={styles.formHeader}>
                                        <Title level={4} style={{ marginTop: 0, marginBottom: 0 }}>
                                            {t('spells.spellDetails')}
                                        </Title>
                                        <Text type="secondary">{t('spells.spellDetailsDescription')}</Text>
                                    </div>
                                    <div style={styles.formContent}>
                                        <Row style={styles.formRow}>
                                            <Col style={{ width: '48%' }}>
                                                <Form.Item
                                                    name="level"
                                                    label={t('spells.spellLevel')}
                                                    labelCol={{ style: { fontWeight: 'bold' } }}
                                                    initialValue={0}
                                                    required
                                                >
                                                    <Select
                                                        placeholder={t('spells.spellLevelPlaceholder')}
                                                        size="large"
                                                        options={spellLevelSelection}
                                                        showSearch
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col style={{ width: '48%' }}>
                                                <Form.Item
                                                    name="range"
                                                    label={t('spells.range')}
                                                    labelCol={{ style: { fontWeight: 'bold' } }}
                                                    initialValue={0}
                                                >
                                                    <InputNumber
                                                        placeholder={t('spells.rangePlaceholder')}
                                                        size="large"
                                                        min={0}
                                                        style={{ width: '100%' }}
                                                        mode="spinner"
                                                        step={5}
                                                    />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                        <Row style={styles.formRow}>
                                            <Col style={{ width: '48%' }}>
                                                <Form.Item
                                                    name="school"
                                                    label={t('spells.school')}
                                                    labelCol={{ style: { fontWeight: 'bold' } }}
                                                    initialValue={''}
                                                >
                                                    <Select
                                                        placeholder={t('spells.schoolPlaceholder')}
                                                        size="large"
                                                        options={spellSchoolSelection}
                                                        showSearch
                                                    />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    </div>
                                </div>
                                <div style={styles.formContainer}>
                                    <div style={styles.formHeader}>
                                        <Title level={4} style={{ marginTop: 0, marginBottom: 0 }}>
                                            {t('spells.spellProperties')}
                                        </Title>
                                        <Text type="secondary">{t('spells.spellPropertiesDescription')}</Text>
                                    </div>
                                    <div style={styles.formContent}>
                                        <div style={styles.bonusCard}>
                                            <div style={styles.bonusCardHeader}>
                                                <div>
                                                    <Text strong style={{ fontSize: '0.95rem', display: 'block' }}>{t('spells.isAttack')}</Text>
                                                    <Text type="secondary" style={{ fontSize: '0.82rem' }}>{t('spells.isAttackDescription')}</Text>
                                                </div>
                                                <Switch
                                                    checked={isAttack}
                                                    onChange={setIsAttack}
                                                />
                                            </div>
                                            {isAttack && (
                                                <div style={styles.bonusCardContent}>
                                                    <div style={styles.rangedAttContainer}>
                                                        <Text>{t('spells.requiresRangedAttack')}</Text>
                                                        <Switch
                                                            checked={requiresRangedAttack}
                                                            onChange={setRequiresRangedAttack}
                                                        />
                                                    </div>
                                                    <Divider style={{ margin: '1rem 0' }} />
                                                    <Form.Item
                                                        label={t('items.damageRoll')}
                                                        labelCol={{ style: { fontWeight: 'bold' } }}
                                                        help={damageRollErrMsg}
                                                        validateStatus={damageRollErrMsg ? 'error' : ''}
                                                        style={{ marginBottom: '0px' }}
                                                    >
                                                        <>
                                                            {damageRollValue.map((roll, index) => (
                                                                <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                                                    <InputNumber
                                                                        style={{ width: '4rem' }}
                                                                        min={1}
                                                                        value={roll.count}
                                                                        onChange={(val) => handleUpdateDamageRollCount(index, val ?? 1)}
                                                                    />
                                                                    <Text>d</Text>
                                                                    <AutoComplete
                                                                        style={{ width: '5rem' }}
                                                                        value={roll.dice.toString()}
                                                                        options={diceSelection}
                                                                        onChange={(val) => handleUpdateDamageRollDice(index, Number(val))}
                                                                    />
                                                                    <Text>+</Text>
                                                                    <InputNumber
                                                                        style={{ width: '4.5rem' }}
                                                                        value={roll.bonus}
                                                                        onChange={(val) => handleUpdateDamageRollBonus(index, val ?? 0)}
                                                                    />
                                                                    <Select
                                                                        style={{ flex: 1 }}
                                                                        placeholder={t('items.damageTypePlaceholder')}
                                                                        value={roll.damageType || undefined}
                                                                        options={damageTypeSelection}
                                                                        onChange={(val) => handleUpdateDamageRollType(index, val)}
                                                                        showSearch
                                                                    />
                                                                    <Button
                                                                        onClick={() => handleDeleteDamageRoll(index)}
                                                                        icon={<DeleteOutlined />}
                                                                    />
                                                                </div>
                                                            ))}
                                                            <Button
                                                                onClick={handleAddDamageRoll}
                                                                style={styles.addBonusBtn}
                                                                icon={<PlusOutlined />}
                                                            >
                                                                {t('items.addRoll')}
                                                            </Button>
                                                        </>
                                                    </Form.Item>
                                                </div>
                                            )}
                                        </div>
                                        <div style={styles.bonusCard}>
                                            <div style={styles.bonusCardHeader}>
                                                <div>
                                                    <Text strong style={{ fontSize: '0.95rem', display: 'block' }}>{t('spells.requiresSpellSave')}</Text>
                                                    <Text type="secondary" style={{ fontSize: '0.82rem' }}>{t('spells.requiresSpellSaveDescription')}</Text>
                                                </div>
                                                <Switch
                                                    checked={isSave}
                                                    onChange={setIsSave}
                                                />
                                            </div>
                                            {isSave && (
                                                <div style={styles.bonusCardContent}>
                                                    <Row style={styles.formRow}>
                                                        <Col style={{ width: '30%' }}>
                                                            <Form.Item
                                                                name="savingThrowStat"
                                                                label={t('spells.savingThrowStat')}
                                                                labelCol={{ style: { fontWeight: 'bold' } }}
                                                                rules={[{ required: true, message: t('global.fieldRequired') }]}
                                                            >
                                                                <Select
                                                                    placeholder={t('spells.savingThrowStatPlaceholder')}
                                                                    size="large"
                                                                    options={savingThrowStatSelection}
                                                                    showSearch
                                                                />
                                                            </Form.Item>
                                                        </Col>
                                                        <Col style={{ width: '30%' }}>
                                                            <div style={{ padding: '0 0.5rem' }}>
                                                                <Text strong style={{ display: 'block', marginBottom: '0.5rem' }}>{t('spells.successDamageAdj')}</Text>
                                                                <Slider
                                                                    min={0}
                                                                    max={100}
                                                                    step={5}
                                                                    value={successDamageAdj}
                                                                    onChange={setSuccessDamageAdj}
                                                                    marks={{ 0: '0%', 50: '50%', 100: '100%' }}
                                                                />
                                                            </div>
                                                        </Col>
                                                        <Col style={{ width: '30%' }}>
                                                            <div style={{ padding: '0 0.5rem' }}>
                                                                <Text strong style={{ display: 'block', marginBottom: '0.5rem' }}>{t('spells.failDamageAdj')}</Text>
                                                                <Slider
                                                                    min={0}
                                                                    max={100}
                                                                    step={5}
                                                                    value={failDamageAdj}
                                                                    onChange={setFailDamageAdj}
                                                                    marks={{ 0: '0%', 50: '50%', 100: '100%' }}
                                                                />
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Form>
                        </div>
                    </div>
                </>
            ) : null}
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
    rangedAttContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        backgroundColor: '#fbf9f6',
        padding: '0.5rem 1rem',
        borderRadius: '0.6rem',
        border: '1px solid #e0dcd3',
    },
    addBonusBtn: {
        marginTop: '0.5rem',
        width: '100%',
    },
}