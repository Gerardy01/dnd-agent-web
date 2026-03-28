import { AutoComplete, Button, Col, Divider, Form, Input, InputNumber, Modal, Row, Select, Switch, Typography, Upload } from "antd";

// utils
import { ItemTypeEnum, WeaponToggleEnum } from "@/utils/enums";

// hooks
import useCreateItem from "@/hooks/workshop/workshopItem/useCreateItem";
import { useTranslation } from "react-i18next";

// assets
import { SparklesIcon } from "@/assets";
import { CloseOutlined, DeleteOutlined, PictureOutlined, PlusOutlined, UploadOutlined } from "@ant-design/icons";

// interfaces
interface Props {
    open: boolean;
    onClose: () => void;
}

const { Title, Text } = Typography;


export default function CreateItemModal({ open, onClose }: Props) {

    const {
        createItemForm,
        fileInputRef,
        imageUrl,
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
        handleRemoveImage,
        handleTypeChange,
        restartForm,
        handleMagicItemChange,
        handleEquipSlotChange,
        handleUpdateVersatileDamageRoll,
        submitCreateItem,
    } = useCreateItem();

    const { t } = useTranslation();

    return (
        <Modal
            open={open}
            footer={null}
            closable={false}
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
                    <Title level={2} style={{ margin: '0px' }}>Create New Item</Title>
                    <Text style={{ fontSize: '1rem' }}>Design and customize your item</Text>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Button
                        icon={<SparklesIcon style={{ fontSize: '1.5rem' }} />}
                        style={{ padding: '1.2rem 1rem' }}
                    >
                        Generate With AI
                    </Button>
                    <Button
                        style={{ padding: '1.2rem 1.5rem' }}
                        type="primary"
                        onClick={() => createItemForm.submit()}
                    >
                        Create Item
                    </Button>
                    <Divider vertical style={styles.titleDivier} />
                    <Button
                        icon={<CloseOutlined />}
                        style={{ padding: '1.2rem', borderRadius: '50%' }}
                        onClick={() => {
                            onClose();
                            restartForm();
                        }}
                        type="text"
                    />
                </div>
            </div>
            <div style={styles.content}>
                <div style={{ width: '30%', position: 'sticky', top: '7.7rem', alignSelf: 'flex-start' }}>
                    <div style={styles.imageFormContainer}>
                        <Title level={4} style={{ marginTop: 0, marginBottom: '1rem' }}>
                            Item Image
                        </Title>
                        {!imageUrl ? (
                            <Upload.Dragger
                                name="file"
                                multiple={false}
                                showUploadList={false}
                                style={styles.uploadDragger}
                                beforeUpload={(file) => {
                                    handleFileChange(file);
                                    return false;
                                }}
                            >
                                <div style={styles.uploadDraggerContent}>
                                    <div style={styles.uploadIconContainer}>
                                        <PictureOutlined style={{ fontSize: '1.8rem' }} />
                                    </div>
                                    <div>
                                        <Text strong style={{ display: 'block', fontSize: '1rem' }}>Drop image here</Text>
                                        <Text type="secondary" style={{ fontSize: '0.85rem' }}>or click to browse</Text>
                                    </div>
                                </div>
                            </Upload.Dragger>
                        ) : (
                            <div style={styles.imagePreviewContainer}>
                                <img src={imageUrl} alt="Item" style={styles.imagePreview} />
                                <button
                                    style={styles.removeBtn}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleRemoveImage();
                                    }}
                                >
                                    <DeleteOutlined style={{ fontSize: '1rem' }} />
                                </button>
                            </div>
                        )}

                        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                            {/* Hidden native file input */}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={(e) => handleFileChange(e.target.files?.[0]!)}
                            />
                            <Button
                                icon={<UploadOutlined />}
                                style={{ flex: 1, padding: '1.2rem', borderColor: '#d4cebe', borderRadius: '8px' }}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                Upload
                            </Button>
                            <Button
                                icon={<SparklesIcon style={{ fontSize: '1rem' }} />}
                                style={{ flex: 1, padding: '1.2rem', borderColor: '#d4cebe', borderRadius: '8px' }}
                            >
                                Generate
                            </Button>
                        </div>
                    </div>
                </div>
                <div style={{ flex: '1' }}>
                    <Form
                        name="createItem"
                        layout="vertical"
                        form={createItemForm}
                        style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
                        onFinish={submitCreateItem}
                    >
                        <div style={styles.formContainer}>
                            <div style={styles.formHeader}>
                                <Title level={4} style={{ marginTop: 0, marginBottom: 0 }}>
                                    Basic Information
                                </Title>
                                <Text type="secondary">Add basic information about your item</Text>
                            </div>
                            <div style={styles.formContent}>
                                <Form.Item
                                    name="name"
                                    label="Item Name"
                                    labelCol={{ style: { fontWeight: 'bold' } }}
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please enter the item name',
                                        },
                                    ]}
                                >
                                    <Input
                                        placeholder="Enter item name..."
                                        size="large"
                                        maxLength={100}
                                    />
                                </Form.Item>
                                <Form.Item
                                    name="type"
                                    label="Item Type"
                                    labelCol={{ style: { fontWeight: 'bold' } }}
                                    initialValue={ItemTypeEnum.GEAR}
                                    required
                                >
                                    <Select
                                        placeholder="Select item type..."
                                        size="large"
                                        options={typeSelection}
                                        onChange={handleTypeChange}
                                    />
                                </Form.Item>
                                <Form.Item
                                    name="description"
                                    label="Description"
                                    labelCol={{ style: { fontWeight: 'bold' } }}
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please enter the item description',
                                        },
                                    ]}
                                >
                                    <Input.TextArea
                                        rows={5}
                                        placeholder="What does the item do?"
                                        maxLength={500}
                                        showCount
                                    />
                                </Form.Item>
                                <Form.Item
                                    name="appearance"
                                    label="Appearance"
                                    labelCol={{ style: { fontWeight: 'bold' } }}
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please enter the item appearance',
                                        },
                                    ]}
                                >
                                    <Input.TextArea
                                        rows={4}
                                        placeholder="What does the item look like?"
                                        maxLength={500}
                                        showCount
                                    />
                                </Form.Item>
                            </div>
                        </div>

                        <div style={styles.formContainer}>
                            <div style={styles.formHeader}>
                                <Title level={4} style={{ marginTop: 0, marginBottom: 0 }}>
                                    Item Properties
                                </Title>
                                <Text type="secondary">Add statistics and characteristics of your item</Text>
                            </div>
                            <div style={styles.formContent}>
                                <Form.Item
                                    name="category"
                                    label="Category"
                                    labelCol={{ style: { fontWeight: 'bold' } }}
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please select the item category',
                                        },
                                    ]}
                                >
                                    <Select
                                        placeholder="Select item category..."
                                        size="large"
                                        options={selectedType === ItemTypeEnum.GEAR ? gearCategoriesSelection : selectedType === ItemTypeEnum.WEAPON ? weaponCategoriesSelection : armorCategoriesSelection}
                                    />
                                </Form.Item>
                                <Row style={styles.formRow}>
                                    <Col style={{ width: '48%' }}>
                                        <Form.Item
                                            name="rarity"
                                            label="Rarity"
                                            labelCol={{ style: { fontWeight: 'bold' } }}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Please select the item rarity',
                                                },
                                            ]}
                                        >
                                            <Select
                                                placeholder="Select item rarity..."
                                                size="large"
                                                options={raritySelection}
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col style={{ width: '48%' }}>
                                        <Form.Item
                                            name="isMagicItem"
                                            label="Magic Item"
                                            labelCol={{ style: { fontWeight: 'bold' } }}
                                            style={{ width: '100%' }}
                                            required
                                            initialValue={false}
                                        >
                                            <div style={styles.magicItemContainer}>
                                                <Text>{isMagicItem ? 'Is Magic' : 'Not Magic'}</Text>
                                                <Switch onChange={handleMagicItemChange} />
                                            </div>
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row style={styles.formRow}>
                                    <Col style={{ width: '48%' }}>
                                        <Form.Item
                                            name="weight"
                                            label="Weight (lbs.)"
                                            labelCol={{ style: { fontWeight: 'bold' } }}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Please enter the item weight',
                                                },
                                            ]}
                                            initialValue={0}
                                        >
                                            <InputNumber
                                                placeholder="Weight"
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
                                            label="Cost"
                                            labelCol={{ style: { fontWeight: 'bold' } }}
                                            initialValue={0}
                                        >
                                            <InputNumber
                                                placeholder="Cost"
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
                                            label="Currency Unit"
                                            labelCol={{ style: { fontWeight: 'bold' } }}
                                            dependencies={['cost']}
                                            rules={[
                                                ({ getFieldValue }) => ({
                                                    validator(_, value) {
                                                        const costValue = getFieldValue('cost');
                                                        if (costValue > 0 && !value) {
                                                            return Promise.reject(new Error('Please select currency unit'));
                                                        }
                                                        return Promise.resolve();
                                                    },
                                                }),
                                            ]}
                                            initialValue=""
                                        >
                                            <Select
                                                placeholder="Select currency unit..."
                                                size="large"
                                                options={currencyUnitSelection}
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                {selectedType === ItemTypeEnum.GEAR && (
                                    <Form.Item
                                        name="equipSlot"
                                        label="Equip Slot"
                                        labelCol={{ style: { fontWeight: 'bold' } }}
                                        initialValue=""
                                    >
                                        <Select
                                            placeholder="Select equip slot..."
                                            size="large"
                                            options={equipSlotSelection}
                                            onChange={handleEquipSlotChange}
                                        />
                                    </Form.Item>
                                )}
                            </div>
                        </div>

                        {selectedType === ItemTypeEnum.WEAPON && (
                            <div style={styles.formContainer}>
                                <div style={styles.formHeader}>
                                    <Title level={4} style={{ marginTop: 0, marginBottom: 0 }}>
                                        Weapon Properties
                                    </Title>
                                    <Text type="secondary">Properties of your weapon</Text>
                                </div>
                                <div style={styles.formContent}>
                                    <Form.Item
                                        label="Damage Roll"
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
                                                        placeholder="Damage type..."
                                                        value={roll.damageType || undefined}
                                                        options={damageTypeSelection}
                                                        onChange={(val) => handleUpdateDamageRollType(index, val)}
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
                                                Add Roll
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
                                                                label="Normal Range (ft)"
                                                                labelCol={{ style: { fontWeight: 'bold' } }}
                                                                rules={[{ required: true, message: 'Please enter normal range' }]}
                                                            >
                                                                <InputNumber
                                                                    style={{ width: '100%' }}
                                                                    min={0}
                                                                    placeholder="Enter normal range"
                                                                />
                                                            </Form.Item>
                                                        </Col>
                                                        <Col style={{ width: '48%' }}>
                                                            <Form.Item
                                                                name="longRange"
                                                                label="Long Range"
                                                                labelCol={{ style: { fontWeight: 'bold' } }}
                                                            >
                                                                <InputNumber
                                                                    style={{ width: '100%' }}
                                                                    min={0}
                                                                    placeholder="Enter long range"
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
                                        Armor Properties
                                    </Title>
                                    <Text type="secondary">Properties of your Armor</Text>
                                </div>
                                <div style={styles.formContent}>

                                </div>
                            </div>
                        )}

                        <div style={styles.formContainer}>
                            <div style={styles.formHeader}>
                                <Title level={4} style={{ marginTop: 0, marginBottom: 0 }}>
                                    Additional Properties
                                </Title>
                                <Text type="secondary">Extra properties of your item</Text>
                            </div>
                            <div style={styles.formContent}>
                                <Form.Item
                                    name="immunities"
                                    label="Immunities"
                                    labelCol={{ style: { fontWeight: 'bold' } }}
                                    initialValue={[]}
                                >
                                    <Select
                                        mode="multiple"
                                        placeholder="Select damage immunities..."
                                        size="large"
                                        options={damageTypeSelection}
                                    />
                                </Form.Item>
                                <Form.Item
                                    name="resistances"
                                    label="Resistances"
                                    labelCol={{ style: { fontWeight: 'bold' } }}
                                    initialValue={[]}
                                >
                                    <Select
                                        mode="multiple"
                                        placeholder="Select damage resistances..."
                                        size="large"
                                        options={damageTypeSelection}
                                    />
                                </Form.Item>
                                <Form.Item
                                    name="vulnerabilities"
                                    label="Vulnerabilities"
                                    labelCol={{ style: { fontWeight: 'bold' } }}
                                    initialValue={[]}
                                >
                                    <Select
                                        mode="multiple"
                                        placeholder="Select damage vulnerabilities..."
                                        size="large"
                                        options={damageTypeSelection}
                                    />
                                </Form.Item>
                                <Form.Item
                                    name="conditionImmunities"
                                    label="Condition Immunities"
                                    labelCol={{ style: { fontWeight: 'bold' } }}
                                    initialValue={[]}
                                >
                                    <Select
                                        mode="multiple"
                                        placeholder="Select conditions..."
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
                                                <Text strong style={{ fontSize: '0.95rem', display: 'block' }}>Flat Bonus</Text>
                                                <Text type="secondary" style={{ fontSize: '0.82rem' }}>Add a fixed value to the character's stats</Text>
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
                                                        <Text strong style={{ flex: 1 }}>STAT</Text>
                                                        <Text strong style={{ width: '7rem' }}>VALUE</Text>
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
                                                                placeholder="Select stat..."
                                                                value={bonus.stats || undefined}
                                                                options={availableOptions}
                                                                onChange={(val) => handleUpdateFlatBonusStat(index, val)}
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
                                                    Add Bonus
                                                </Button>
                                            </div>
                                        )}
                                    </div>

                                    {/* Override Bonus */}
                                    <div style={styles.bonusCard}>
                                        <div style={styles.bonusCardHeader}>
                                            <div>
                                                <Text strong style={{ fontSize: '0.95rem', display: 'block' }}>Override Bonus</Text>
                                                <Text type="secondary" style={{ fontSize: '0.82rem' }}>Replace the character's stat with a specific value</Text>
                                            </div>
                                            <Switch
                                                checked={overrideBonusEnabled}
                                                onChange={handleOverrideBonusChange}
                                            />
                                        </div>
                                        {overrideBonusEnabled && (
                                            <div style={styles.bonusCardContent}>
                                                {/* Table header */}
                                                {overrideBonusValue.length > 0 && (
                                                    <div style={styles.bonusTableHeader}>
                                                        <Text strong style={{ flex: 1 }}>STAT</Text>
                                                        <Text strong style={{ width: '7rem' }}>VALUE</Text>
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
                                                    return (
                                                        <div key={index} style={styles.bonusTableRow}>
                                                            <Select
                                                                style={{ flex: 1 }}
                                                                size="middle"
                                                                placeholder="Select stat..."
                                                                value={bonus.stats || undefined}
                                                                options={availableOptions}
                                                                onChange={(val) => handleUpdateOverrideBonusStat(index, val)}
                                                            />
                                                            <InputNumber
                                                                style={{ width: '7rem' }}
                                                                size="middle"
                                                                value={bonus.value}
                                                                onChange={(val) => handleUpdateOverrideBonusValue(index, val ?? 0)}
                                                            />
                                                            <Button
                                                                onClick={() => handleDeleteOverrideBonus(index)}
                                                                icon={<DeleteOutlined />}
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
                                                    Add Bonus
                                                </Button>
                                            </div>
                                        )}
                                    </div>

                                    {/* Modifier Bonus */}
                                    <div style={styles.bonusCard}>
                                        <div style={styles.bonusCardHeader}>
                                            <div>
                                                <Text strong style={{ fontSize: '0.95rem', display: 'block' }}>Modifier Bonus</Text>
                                                <Text type="secondary" style={{ fontSize: '0.82rem' }}>Apply a modifier based on another stat</Text>
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
                                                        <Text>Add</Text>
                                                        <Select
                                                            style={{ flex: 1, minWidth: '5rem' }}
                                                            placeholder="from stat"
                                                            value={mod.from || undefined}
                                                            options={itemBonusStatSelection}
                                                            onChange={(val) => handleUpdateModifierBonusFrom(index, val)}
                                                        />
                                                        <Text>modifier to</Text>
                                                        <Select
                                                            style={{ flex: 1, minWidth: '5rem' }}
                                                            placeholder="to stat"
                                                            value={mod.to || undefined}
                                                            options={itemBonusStatSelection}
                                                            onChange={(val) => handleUpdateModifierBonusTo(index, val)}
                                                        />
                                                        <Text>up to</Text>
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
                                                    Add Bonus
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
    titleDivier: {
        height: '2rem',
        backgroundColor: '#e0dcd3',
        margin: '0px'
    },
    imageFormContainer: {
        padding: '1.5rem',
        backgroundColor: '#fbf9f6',
        borderRadius: '1rem',
        border: '1px solid #e0dcd3'
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
    uploadDragger: {
        backgroundColor: 'transparent',
        borderColor: '#d4cebe',
        borderStyle: 'dashed',
        borderWidth: '2px',
        borderRadius: '8px',
        padding: '3.5rem 1rem'
    },
    uploadDraggerContent: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem'
    },
    uploadIconContainer: {
        width: '4rem',
        height: '4rem',
        borderRadius: '50%',
        backgroundColor: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
    },
    imagePreviewContainer: {
        position: 'relative',
        width: '100%',
        aspectRatio: '1 / 1',
        borderColor: '#d4cebe',
        borderStyle: 'dashed',
        borderWidth: '2px',
        borderRadius: '8px',
        padding: '0',
        overflow: 'hidden',
    },
    imagePreview: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        display: 'block',
    },
    removeBtn: {
        position: 'absolute',
        top: '8px',
        right: '8px',
        width: '2rem',
        height: '2rem',
        borderRadius: '50%',
        backgroundColor: 'rgba(0,0,0,0.55)',
        border: 'none',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
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
}