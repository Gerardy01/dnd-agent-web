import { Button, Col, Divider, Form, Input, InputNumber, Modal, Row, Select, Switch, Typography, Upload } from "antd";

// utils
import { ItemTypeEnum } from "@/utils/enums";

// hooks
import useCreateItem from "@/hooks/workshop/workshopItem/useCreateItem";

// assets
import { SparklesIcon } from "@/assets";
import { CloseOutlined, DeleteOutlined, PictureOutlined, UploadOutlined } from "@ant-design/icons";

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
        handleFileChange,
        handleRemoveImage,
        handleTypeChange,
        restartForm,
        handleMagicItemChange,
        submitCreateItem,
    } = useCreateItem();

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
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Please enter the item cost',
                                                },
                                            ]}
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
                                        />
                                    </Form.Item>
                                )}
                            </div>
                        </div>
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
                    </Form>
                </div>
            </div>
        </Modal>
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
    }
}