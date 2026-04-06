import { AutoComplete, Button, Checkbox, Col, Divider, Form, Input, InputNumber, Modal, Row, Select, Switch, Typography } from "antd";

// utils
import { ItemTypeEnum, WeaponToggleEnum } from "@/utils/enums";

// hooks
import useEditItem from "@/hooks/item/useEditItem";
import { useTranslation } from "react-i18next";

// assets
import { SparklesIcon } from "@/assets";
import { CloseOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";

// components
import ImageForm from "@/components/global/form/ImageForm";
import EditModalSkeleton from "@/components/global/common/EditModalSkeleton";

// interfaces
import type { Item } from "@/models/itemInterfaces";
interface Props {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: Item, prevData: Item) => Promise<void>;
    getData: () => Promise<Item | null>;
}

const { Title, Text } = Typography;


export default function EditItemModal({ open, onClose, onSubmit, getData }: Props) {

    const {
        item,
        editItemForm,
        typeSelection,
        selectedType,
        gearCategoriesSelection,
        weaponCategoriesSelection,
        armorCategoriesSelection,
        raritySelection,
        isMagicItem,
        currencyUnitSelection,
        equipSlotSelection,
        damageTypeSelection,
        conditionSelection,
        itemBonusStatSelection,
        diceSelection,
        equipSlotValue,
        flatBonusEnabled,
        overrideBonusEnabled,
        modifierBonusEnabled,
        flatBonusValue,
        overrideBonusValue,
        modifierBonusValue,
        damageRollValue,
        damageRollErrMsg,
        weaponToggleList,
        versatileDamageRoll,
        versatileDamageRollErrMsg,
        submitLoad,
        handleFlatBonusChange,
        handleOverrideBonusChange,
        handleModifierBonusChange,
        handleAddFlatBonus,
        handleUpdateFlatBonusStat,
        handleUpdateFlatBonusValue,
        handleDeleteFlatBonus,
        handleAddOverrideBonus,
        handleUpdateOverrideBonusStat,
        handleUpdateOverrideBonusValue,
        handleDeleteOverrideBonus,
        handleAddModifierBonus,
        handleUpdateModifierBonusFrom,
        handleUpdateModifierBonusTo,
        handleUpdateModifierBonusValue,
        handleDeleteModifierBonus,
        handleAddDamageRoll,
        handleUpdateDamageRollCount,
        handleUpdateDamageRollDice,
        handleUpdateDamageRollBonus,
        handleUpdateDamageRollType,
        handleDeleteDamageRoll,
        handleFileChange,
        handleTypeChange,
        handleMagicItemChange,
        handleEquipSlotChange,
        handleUpdateVersatileDamageRoll,
        handleSetBaseAcValue,
        submitEditItem,
        handleCloseModal,
    } = useEditItem(onClose, onSubmit, getData);

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
            {item ? (
                <>
                    <div style={styles.header}>
                        <div>
                            <Title level={2} style={{ margin: '0px' }}>{t('items.editItemTitle')}</Title>
                            <Text style={{ fontSize: '1rem' }}>{t('items.editItemDescription')}</Text>
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
                                onClick={() => editItemForm.submit()}
                                loading={submitLoad}
                            >
                                {t('items.editItem')}
                            </Button>
                            <Divider vertical style={styles.titleDivier} />
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
                                title={t('items.itemImage')}
                                submitLoad={submitLoad}
                                onFileChange={handleFileChange}
                                initialImage={item?.image || ""}
                            />
                        </div>
                        <div style={{ flex: '1' }}>
                            <Form
                                name="editItem"
                                layout="vertical"
                                form={editItemForm}
                                style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
                                onFinish={submitEditItem}
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
                                            name="type"
                                            label={t('items.itemType')}
                                            labelCol={{ style: { fontWeight: 'bold' } }}
                                            initialValue={ItemTypeEnum.GEAR}
                                            required
                                        >
                                            <Select
                                                placeholder={t('items.itemTypePlaceholder')}
                                                size="large"
                                                options={typeSelection}
                                                onChange={handleTypeChange}
                                                showSearch
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
                                        <Form.Item
                                            name="appearance"
                                            label={t('items.appearance')}
                                            labelCol={{ style: { fontWeight: 'bold' } }}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: t('global.fieldRequired'),
                                                },
                                            ]}
                                        >
                                            <Input.TextArea
                                                rows={4}
                                                placeholder={t('items.appearancePlaceholder')}
                                                maxLength={500}
                                                showCount
                                            />
                                        </Form.Item>
                                    </div>
                                </div>

                                <div style={styles.formContainer}>
                                    <div style={styles.formHeader}>
                                        <Title level={4} style={{ marginTop: 0, marginBottom: 0 }}>
                                            {t('items.itemProperties')}
                                        </Title>
                                        <Text type="secondary">{t('items.itemPropertiesDescription')}</Text>
                                    </div>
                                    <div style={styles.formContent}>
                                        <Form.Item
                                            name="category"
                                            label={t('items.category')}
                                            labelCol={{ style: { fontWeight: 'bold' } }}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: t('global.fieldRequired'),
                                                },
                                            ]}
                                        >
                                            <Select
                                                placeholder={t('items.categoryPlaceholder')}
                                                size="large"
                                                options={selectedType === ItemTypeEnum.GEAR ? gearCategoriesSelection : selectedType === ItemTypeEnum.WEAPON ? weaponCategoriesSelection : armorCategoriesSelection}
                                                showSearch
                                            />
                                        </Form.Item>
                                        <Row style={styles.formRow}>
                                            <Col style={{ width: '48%' }}>
                                                <Form.Item
                                                    name="rarity"
                                                    label={t('items.rarity')}
                                                    labelCol={{ style: { fontWeight: 'bold' } }}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: t('global.fieldRequired'),
                                                        },
                                                    ]}
                                                >
                                                    <Select
                                                        placeholder={t('items.rarityPlaceholder')}
                                                        size="large"
                                                        options={raritySelection}
                                                        showSearch
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col style={{ width: '48%' }}>
                                                <Form.Item
                                                    name="isMagicItem"
                                                    label={t('items.magicItem')}
                                                    labelCol={{ style: { fontWeight: 'bold' } }}
                                                    style={{ width: '100%' }}
                                                    required
                                                    initialValue={false}
                                                >
                                                    <div style={styles.magicItemContainer}>
                                                        <Text>{isMagicItem ? t('items.isMagic') : t('items.notMagic')}</Text>
                                                        <Switch onChange={handleMagicItemChange} />
                                                    </div>
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                        <Row style={styles.formRow}>
                                            <Col style={{ width: '48%' }}>
                                                <Form.Item
                                                    name="weight"
                                                    label={`${t('items.weight')} (${t('items.lbs')})`}
                                                    labelCol={{ style: { fontWeight: 'bold' } }}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: t('global.fieldRequired'),
                                                        },
                                                    ]}
                                                    initialValue={0}
                                                >
                                                    <InputNumber
                                                        placeholder={t('items.weightPlaceholder')}
                                                        size="large"
                                                        min={0}
                                                        step={0.1}
                                                        mode="spinner"
                                                        style={{ width: '100%' }}
                                                    />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                        <Row style={styles.formRow}>
                                            <Col style={{ width: '48%' }}>
                                                <Form.Item
                                                    name="cost"
                                                    label={t('items.cost')}
                                                    labelCol={{ style: { fontWeight: 'bold' } }}
                                                    initialValue={0}
                                                >
                                                    <InputNumber
                                                        placeholder={t('items.costPlaceholder')}
                                                        size="large"
                                                        min={0}
                                                        mode="spinner"
                                                        style={{ width: '100%' }}
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col style={{ width: '48%' }}>
                                                <Form.Item
                                                    name="currencyUnit"
                                                    label={t('items.currencyUnit')}
                                                    labelCol={{ style: { fontWeight: 'bold' } }}
                                                    dependencies={['cost']}
                                                    rules={[
                                                        ({ getFieldValue }) => ({
                                                            validator(_, value) {
                                                                const costValue = getFieldValue('cost');
                                                                if (costValue > 0 && !value) {
                                                                    return Promise.reject(new Error(t('items.currencyUnitRequired')));
                                                                }
                                                                return Promise.resolve();
                                                            },
                                                        }),
                                                    ]}
                                                    initialValue=""
                                                >
                                                    <Select
                                                        placeholder={t('items.currencyUnitPlaceholder')}
                                                        size="large"
                                                        options={currencyUnitSelection}
                                                        showSearch
                                                    />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                        {selectedType === ItemTypeEnum.GEAR && (
                                            <Form.Item
                                                name="equipSlot"
                                                label={t('items.equipSlot')}
                                                labelCol={{ style: { fontWeight: 'bold' } }}
                                                initialValue=""
                                            >
                                                <Select
                                                    placeholder={t('items.equipSlotPlaceholder')}
                                                    size="large"
                                                    options={equipSlotSelection}
                                                    onChange={handleEquipSlotChange}
                                                    showSearch
                                                />
                                            </Form.Item>
                                        )}
                                    </div>
                                </div>

                                {selectedType === ItemTypeEnum.WEAPON && (
                                    <div style={styles.formContainer}>
                                        <div style={styles.formHeader}>
                                            <Title level={4} style={{ marginTop: 0, marginBottom: 0 }}>
                                                {t('items.weaponProperties')}
                                            </Title>
                                            <Text type="secondary">{t('items.weaponPropertiesDescription')}</Text>
                                        </div>
                                        <div style={styles.formContent}>
                                            <Form.Item
                                                label={t('items.damageRoll')}
                                                labelCol={{ style: { fontWeight: 'bold' } }}
                                                help={damageRollErrMsg}
                                                validateStatus={damageRollErrMsg ? 'error' : ''}
                                            >
                                                <>
                                                    {/* Rows */}
                                                    {damageRollValue.map((roll, index) => (
                                                        <div key={index} style={styles.damageRollRow}>
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

                                                    {/* Add button */}
                                                    <Button
                                                        onClick={handleAddDamageRoll}
                                                        style={styles.addBonusBtn}
                                                        icon={<PlusOutlined />}
                                                    >
                                                        {t('items.addRoll')}
                                                    </Button>
                                                </>
                                            </Form.Item>
                                            {weaponToggleList.map((item, index) => (
                                                <div key={index} style={styles.bonusCard}>
                                                    <div style={styles.bonusCardHeader}>
                                                        <div>
                                                            <Text strong style={{ fontSize: '0.95rem', display: 'block' }}>{t(`items.${item.title}`)}</Text>
                                                            <Text type="secondary" style={{ fontSize: '0.82rem' }}>{item.description}</Text>
                                                        </div>
                                                        <Switch
                                                            checked={item.checked}
                                                            onChange={(val) => item.onChange(val)}
                                                        />
                                                    </div>
                                                    {item.expandable && item.checked && item.title === WeaponToggleEnum.RANGE && (
                                                        <div style={styles.bonusCardContent}>
                                                            <Row style={styles.formRow}>
                                                                <Col style={{ width: '48%' }}>
                                                                    <Form.Item
                                                                        name="normalRange"
                                                                        label={t('items.normalRange')}
                                                                        labelCol={{ style: { fontWeight: 'bold' } }}
                                                                        rules={[{ required: true, message: t('global.fieldRequired') }]}
                                                                    >
                                                                        <InputNumber
                                                                            style={{ width: '100%' }}
                                                                            min={0}
                                                                            placeholder={t('items.normalRangePlaceholder')}
                                                                        />
                                                                    </Form.Item>
                                                                </Col>
                                                                <Col style={{ width: '48%' }}>
                                                                    <Form.Item
                                                                        name="longRange"
                                                                        label={t('items.longRange')}
                                                                        labelCol={{ style: { fontWeight: 'bold' } }}
                                                                    >
                                                                        <InputNumber
                                                                            style={{ width: '100%' }}
                                                                            min={0}
                                                                            placeholder={t('items.longRangePlaceholder')}
                                                                        />
                                                                    </Form.Item>
                                                                </Col>
                                                            </Row>
                                                        </div>
                                                    )}
                                                    {item.expandable && item.checked && item.title === WeaponToggleEnum.VERSATILE && (
                                                        <div style={{ ...styles.bonusCardContent, paddingBottom: versatileDamageRollErrMsg ? '1rem' : '0px' }}>
                                                            <Form.Item
                                                                name="versatileDamageRoll"
                                                                help={versatileDamageRollErrMsg}
                                                                validateStatus={versatileDamageRollErrMsg ? 'error' : ''}
                                                            >
                                                                <div style={{ ...styles.damageRollRow, marginBottom: '0px' }}>
                                                                    <InputNumber
                                                                        style={{ width: '4rem' }}
                                                                        min={1}
                                                                        value={versatileDamageRoll.count}
                                                                        onChange={(value) => handleUpdateVersatileDamageRoll({ ...versatileDamageRoll, count: Number(value) })}
                                                                    />
                                                                    <Text>d</Text>
                                                                    <AutoComplete
                                                                        style={{ width: '5rem' }}
                                                                        options={diceSelection}
                                                                        defaultValue={versatileDamageRoll.dice}
                                                                        onChange={(value) => handleUpdateVersatileDamageRoll({ ...versatileDamageRoll, dice: Number(value) })}
                                                                    />
                                                                    <Text>+</Text>
                                                                    <InputNumber
                                                                        style={{ width: '4.5rem' }}
                                                                        defaultValue={versatileDamageRoll.bonus}
                                                                        min={0}
                                                                        onChange={(value) => handleUpdateVersatileDamageRoll({ ...versatileDamageRoll, bonus: Number(value) })}
                                                                    />
                                                                    <Select
                                                                        style={{ flex: 1 }}
                                                                        placeholder="Damage type..."
                                                                        options={damageTypeSelection}
                                                                        value={versatileDamageRoll.damageType}
                                                                        onChange={(value) => handleUpdateVersatileDamageRoll({ ...versatileDamageRoll, damageType: value })}
                                                                        showSearch
                                                                    />
                                                                </div>
                                                            </Form.Item>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {selectedType === ItemTypeEnum.ARMOR && (
                                    <div style={styles.formContainer}>
                                        <div style={styles.formHeader}>
                                            <Title level={4} style={{ marginTop: 0, marginBottom: 0 }}>
                                                {t('items.armorProperties')}
                                            </Title>
                                            <Text type="secondary">{t('items.armorPropertiesDescription')}</Text>
                                        </div>
                                        <div style={styles.formContent}>
                                            <Row style={styles.formRow}>
                                                <Col style={{ width: '48%' }}>
                                                    <Form.Item
                                                        name="baseAc"
                                                        label={t('items.baseAc')}
                                                        labelCol={{ style: { fontWeight: 'bold' } }}
                                                        rules={[{ required: true, message: t('global.fieldRequired') }]}
                                                        initialValue={10}
                                                    >
                                                        <InputNumber
                                                            style={{ width: '100%' }}
                                                            min={0}
                                                            placeholder={t('items.baseAcPlaceholder')}
                                                            size="large"
                                                            onChange={(value) => handleSetBaseAcValue(Number(value) || 0)}
                                                        />
                                                    </Form.Item>
                                                </Col>
                                                <Col style={{ width: '48%' }}>
                                                    <Form.Item
                                                        name="strengthReq"
                                                        label={t('items.strengthReq')}
                                                        labelCol={{ style: { fontWeight: 'bold' } }}
                                                        initialValue={0}
                                                    >
                                                        <InputNumber
                                                            style={{ width: '100%' }}
                                                            min={0}
                                                            placeholder={t('items.strengthReqPlaceholder')}
                                                            size="large"
                                                        />
                                                    </Form.Item>
                                                </Col>
                                            </Row>
                                            <Title style={{ fontWeight: 'bold', fontSize: '1rem' }}>{t('items.modifier')}</Title>
                                            <div style={styles.armorModBox}>
                                                <Row style={styles.formRow}>
                                                    <Col style={{ width: '32%' }}>
                                                        <Form.Item
                                                            name="dexMod"
                                                            initialValue={false}
                                                            valuePropName="checked"
                                                            style={{ margin: '0px' }}
                                                        >
                                                            <Checkbox>{t('items.addDexModifier')}</Checkbox>
                                                        </Form.Item>
                                                    </Col>
                                                    <Col style={{ width: '32%' }}>
                                                        <Form.Item
                                                            name="conMod"
                                                            initialValue={false}
                                                            valuePropName="checked"
                                                            style={{ margin: '0px' }}
                                                        >
                                                            <Checkbox>{t('items.addConModifier')}</Checkbox>
                                                        </Form.Item>
                                                    </Col>
                                                    <Col style={{ width: '32%' }}>
                                                        <Form.Item
                                                            name="wisMod"
                                                            initialValue={false}
                                                            valuePropName="checked"
                                                            style={{ margin: '0px' }}
                                                        >
                                                            <Checkbox>{t('items.addWisModifier')}</Checkbox>
                                                        </Form.Item>
                                                    </Col>
                                                </Row>
                                            </div>
                                            <Row style={styles.formRow}>
                                                <Col style={{ width: '48%' }}>
                                                    <Form.Item
                                                        name="flatAcBonus"
                                                        label={t('items.flatAcBonus')}
                                                        labelCol={{ style: { fontWeight: 'bold' } }}
                                                        initialValue={0}
                                                    >
                                                        <InputNumber
                                                            style={{ width: '100%' }}
                                                            min={0}
                                                            placeholder={t('items.flatAcBonusPlaceholder')}
                                                            size="large"
                                                        />
                                                    </Form.Item>
                                                </Col>
                                                <Col style={{ width: '48%' }}>
                                                    <Form.Item
                                                        name="maxModifier"
                                                        label={t('items.maxModifier')}
                                                        labelCol={{ style: { fontWeight: 'bold' } }}
                                                        initialValue={0}
                                                    >
                                                        <InputNumber
                                                            style={{ width: '100%' }}
                                                            min={0}
                                                            placeholder={t('items.maxModifierPlaceholder')}
                                                            size="large"
                                                        />
                                                    </Form.Item>
                                                </Col>
                                            </Row>
                                            <Divider style={{ margin: '1rem 0' }} />
                                            <div style={styles.bonusCard}>
                                                <div style={{ display: 'flex', flexDirection: 'column', padding: '0.8rem 1.1rem', marginBottom: '0px' }}>
                                                    <Form.Item
                                                        name="stealthDisadvantage"
                                                        initialValue={false}
                                                        valuePropName="checked"
                                                        style={{ marginBottom: '0px' }}
                                                    >
                                                        <Checkbox>
                                                            <Text strong>{t('items.stealthDisadvantage')}</Text>
                                                        </Checkbox>
                                                    </Form.Item>
                                                    <div style={{ marginLeft: '1.5rem', marginTop: '-0.5rem' }}>
                                                        <Text type="secondary" style={{ fontSize: '0.82rem' }}>{t('items.stealthDisadvantageDescription')}</Text>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div style={styles.formContainer}>
                                    <div style={styles.formHeader}>
                                        <Title level={4} style={{ marginTop: 0, marginBottom: 0 }}>
                                            {t('items.additionalProperties')}
                                        </Title>
                                        <Text type="secondary">{t('items.additionalPropertiesDescription')}</Text>
                                    </div>
                                    <div style={styles.formContent}>
                                        <Form.Item
                                            name="immunities"
                                            label={t('items.immunities')}
                                            labelCol={{ style: { fontWeight: 'bold' } }}
                                            initialValue={[]}
                                        >
                                            <Select
                                                mode="multiple"
                                                placeholder={t('items.immunitiesPlaceholder')}
                                                size="large"
                                                options={damageTypeSelection}
                                            />
                                        </Form.Item>
                                        <Form.Item
                                            name="resistances"
                                            label={t('items.resistances')}
                                            labelCol={{ style: { fontWeight: 'bold' } }}
                                            initialValue={[]}
                                        >
                                            <Select
                                                mode="multiple"
                                                placeholder={t('items.resistancesPlaceholder')}
                                                size="large"
                                                options={damageTypeSelection}
                                            />
                                        </Form.Item>
                                        <Form.Item
                                            name="vulnerabilities"
                                            label={t('items.vulnerabilities')}
                                            labelCol={{ style: { fontWeight: 'bold' } }}
                                            initialValue={[]}
                                        >
                                            <Select
                                                mode="multiple"
                                                placeholder={t('items.vulnerabilitiesPlaceholder')}
                                                size="large"
                                                options={damageTypeSelection}
                                            />
                                        </Form.Item>
                                        <Form.Item
                                            name="conditionImmunities"
                                            label={t('items.conditionImmunities')}
                                            labelCol={{ style: { fontWeight: 'bold' } }}
                                            initialValue={[]}
                                        >
                                            <Select
                                                mode="multiple"
                                                placeholder={t('items.conditionImmunitiesPlaceholder')}
                                                size="large"
                                                options={conditionSelection}
                                            />
                                        </Form.Item>
                                    </div>
                                </div>

                                {(selectedType !== ItemTypeEnum.GEAR || equipSlotValue !== "") && (
                                    <div style={styles.formContainer}>
                                        <div style={styles.formHeader}>
                                            <Title level={4} style={{ marginTop: 0, marginBottom: 0 }}>
                                                Item Bonuses
                                            </Title>
                                            <Text type="secondary">Add bonuses to your item</Text>
                                        </div>
                                        <div style={styles.formContent}>
                                            {/* Flat Bonus */}
                                            <div style={styles.bonusCard}>
                                                <div style={styles.bonusCardHeader}>
                                                    <div>
                                                        <Text strong style={{ fontSize: '0.95rem', display: 'block' }}>{t('items.flatBonus')}</Text>
                                                        <Text type="secondary" style={{ fontSize: '0.82rem' }}>{t('items.flatBonusDescription')}</Text>
                                                    </div>
                                                    <Switch
                                                        checked={flatBonusEnabled}
                                                        onChange={handleFlatBonusChange}
                                                    />
                                                </div>
                                                {flatBonusEnabled && (
                                                    <div style={styles.bonusCardContent}>
                                                        {/* Table header */}
                                                        {flatBonusValue.length > 0 && (
                                                            <div style={styles.bonusTableHeader}>
                                                                <Text strong style={{ flex: 1 }}>{t('items.statColumnHeader')}</Text>
                                                                <Text strong style={{ width: '7rem' }}>{t('items.valueColumnHeader')}</Text>
                                                                <Text style={{ width: '2.2rem' }} />
                                                            </div>
                                                        )}

                                                        {/* Rows */}
                                                        {flatBonusValue.map((bonus, index) => {
                                                            const usedStats = flatBonusValue
                                                                .filter((_, i) => i !== index)
                                                                .map((b) => b.stats)
                                                                .filter(Boolean);
                                                            const availableOptions = itemBonusStatSelection.filter(
                                                                (opt) => !usedStats.includes(opt.value)
                                                            );
                                                            return (
                                                                <div key={index} style={styles.bonusTableRow}>
                                                                    <Select
                                                                        style={{ flex: 1 }}
                                                                        size="middle"
                                                                        placeholder={t('items.selectStatPlaceholder')}
                                                                        value={bonus.stats || undefined}
                                                                        options={availableOptions}
                                                                        onChange={(val) => handleUpdateFlatBonusStat(index, val)}
                                                                        showSearch
                                                                    />
                                                                    <InputNumber
                                                                        style={{ width: '7rem' }}
                                                                        size="middle"
                                                                        value={bonus.value}
                                                                        onChange={(val) => handleUpdateFlatBonusValue(index, val ?? 0)}
                                                                    />
                                                                    <Button
                                                                        onClick={() => handleDeleteFlatBonus(index)}
                                                                        icon={<DeleteOutlined />}
                                                                    />
                                                                </div>
                                                            );
                                                        })}
                                                        <Button
                                                            onClick={handleAddFlatBonus}
                                                            style={styles.addBonusBtn}
                                                            icon={<PlusOutlined />}
                                                            disabled={flatBonusValue.length >= 9}
                                                        >
                                                            {t('items.addBonus')}
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Override Bonus */}
                                            <div style={styles.bonusCard}>
                                                <div style={styles.bonusCardHeader}>
                                                    <div>
                                                        <Text strong style={{ fontSize: '0.95rem', display: 'block' }}>{t('items.overrideBonus')}</Text>
                                                        <Text type="secondary" style={{ fontSize: '0.82rem' }}>{t('items.overrideBonusDescription')}</Text>
                                                    </div>
                                                    <Switch
                                                        checked={overrideBonusEnabled}
                                                        onChange={handleOverrideBonusChange}
                                                        disabled={selectedType === ItemTypeEnum.ARMOR}
                                                    />
                                                </div>
                                                {overrideBonusEnabled && (
                                                    <div style={styles.bonusCardContent}>
                                                        {/* Table header */}
                                                        {overrideBonusValue.length > 0 && (
                                                            <div style={styles.bonusTableHeader}>
                                                                <Text strong style={{ flex: 1 }}>{t('items.statColumnHeader')}</Text>
                                                                <Text strong style={{ width: '7rem' }}>{t('items.valueColumnHeader')}</Text>
                                                                <Text style={{ width: '2.2rem' }} />
                                                            </div>
                                                        )}

                                                        {/* Rows */}
                                                        {overrideBonusValue.map((bonus, index) => {
                                                            const usedStats = overrideBonusValue
                                                                .filter((_, i) => i !== index)
                                                                .map((b) => b.stats)
                                                                .filter(Boolean);
                                                            const availableOptions = itemBonusStatSelection.filter(
                                                                (opt) => !usedStats.includes(opt.value)
                                                            );
                                                            const isFromArmor = selectedType === ItemTypeEnum.ARMOR && overrideBonusValue[index].stats === 'ac';
                                                            return (
                                                                <div key={index} style={styles.bonusTableRow}>
                                                                    <Select
                                                                        style={{ flex: 1 }}
                                                                        size="middle"
                                                                        placeholder={t('items.selectStatPlaceholder')}
                                                                        value={bonus.stats || undefined}
                                                                        options={availableOptions}
                                                                        onChange={(val) => handleUpdateOverrideBonusStat(index, val)}
                                                                        disabled={isFromArmor}
                                                                        showSearch
                                                                    />
                                                                    <InputNumber
                                                                        style={{ width: '7rem' }}
                                                                        size="middle"
                                                                        value={bonus.value}
                                                                        onChange={(val) => handleUpdateOverrideBonusValue(index, val ?? 0)}
                                                                        disabled={isFromArmor}
                                                                    />
                                                                    <Button
                                                                        onClick={() => handleDeleteOverrideBonus(index)}
                                                                        icon={<DeleteOutlined />}
                                                                        disabled={isFromArmor}
                                                                    />
                                                                </div>
                                                            );
                                                        })}
                                                        <Button
                                                            onClick={handleAddOverrideBonus}
                                                            style={styles.addBonusBtn}
                                                            icon={<PlusOutlined />}
                                                            disabled={flatBonusValue.length >= 9}
                                                        >
                                                            {t('items.addBonus')}
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Modifier Bonus */}
                                            <div style={styles.bonusCard}>
                                                <div style={styles.bonusCardHeader}>
                                                    <div>
                                                        <Text strong style={{ fontSize: '0.95rem', display: 'block' }}>{t('items.modifierBonus')}</Text>
                                                        <Text type="secondary" style={{ fontSize: '0.82rem' }}>{t('items.modifierBonusDescription')}</Text>
                                                    </div>
                                                    <Switch
                                                        checked={modifierBonusEnabled}
                                                        onChange={handleModifierBonusChange}
                                                    />
                                                </div>
                                                {modifierBonusEnabled && (
                                                    <div style={styles.bonusCardContent}>
                                                        {/* Rows */}
                                                        {modifierBonusValue.map((mod, index) => (
                                                            <div key={index} style={styles.modifierBonusRow}>
                                                                <Text>{t('items.modBonusAdd')}</Text>
                                                                <Select
                                                                    style={{ flex: 1, minWidth: '5rem' }}
                                                                    placeholder={t('items.fromStatPlaceholder')}
                                                                    value={mod.from || undefined}
                                                                    options={itemBonusStatSelection}
                                                                    onChange={(val) => handleUpdateModifierBonusFrom(index, val)}
                                                                    showSearch
                                                                />
                                                                <Text>{t('items.modBonusModifierTo')}</Text>
                                                                <Select
                                                                    style={{ flex: 1, minWidth: '5rem' }}
                                                                    placeholder={t('items.toStatPlaceholder')}
                                                                    value={mod.to || undefined}
                                                                    options={itemBonusStatSelection}
                                                                    onChange={(val) => handleUpdateModifierBonusTo(index, val)}
                                                                    showSearch
                                                                />
                                                                <Text>{t('items.modBonusUpTo')}</Text>
                                                                <InputNumber
                                                                    style={{ width: '5rem' }}
                                                                    value={mod.value}
                                                                    min={0}
                                                                    onChange={(val) => handleUpdateModifierBonusValue(index, val ?? 0)}
                                                                />
                                                                <Button
                                                                    onClick={() => handleDeleteModifierBonus(index)}
                                                                    icon={<DeleteOutlined />}
                                                                />
                                                            </div>
                                                        ))}

                                                        {/* Add button */}
                                                        <Button
                                                            onClick={handleAddModifierBonus}
                                                            style={styles.addBonusBtn}
                                                            icon={<PlusOutlined />}
                                                        >
                                                            {t('items.addBonus')}
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </Form>
                        </div>
                    </div >
                </>
            ) : (
                <EditModalSkeleton />
            )}
        </Modal >
    );
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
    titleDivier: {
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
    magicItemContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        backgroundColor: '#F6F1E7',
        padding: '0.5rem 1rem',
        borderRadius: '0.6rem',
        border: '1px solid #c9c6beff',
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
    modifierBonusRow: {
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '0.5rem',
        marginBottom: '0.6rem',
    },
    damageRollRow: {
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '0.5rem',
        marginBottom: '0.6rem',
    },
    armorModBox: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f2ea',
        padding: '0.8rem 1rem',
        borderRadius: '0.6rem',
        border: '1px solid #c9c6beff',
        marginBottom: '1.5rem'
    },
}