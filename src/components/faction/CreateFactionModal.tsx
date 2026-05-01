
import { Button, ColorPicker, Divider, Form, Input, Modal, Typography } from "antd";

// hooks
import useCreateFaction from "@/hooks/faction/useCreateFaction";
import { useTranslation } from "react-i18next";

// assets
import { SparklesIcon } from "@/assets";
import { CloseOutlined } from "@ant-design/icons";

// components
import ImageForm from "@/components/global/form/ImageForm";

// interfaces
import type { CreateFactionDTO } from "@/models/factionInterfaces";

interface Props {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: CreateFactionDTO) => Promise<void>;
}

const { Title, Text } = Typography;

export default function CreateFactionModal({ open, onClose, onSubmit }: Props) {

    const {
        createFactionForm,
        submitLoad,
        handleFileChange,
        submitCreateFaction,
        handleCloseModal,
        handleColorChange,
    } = useCreateFaction(onClose, onSubmit);

    const { t } = useTranslation();

    const colorValue = Form.useWatch('color', createFactionForm);

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
            {/* Header */}
            <div style={styles.header}>
                <div>
                    <Title level={2} style={{ margin: '0px' }}>{t('factions.createFactionTitle')}</Title>
                    <Text style={{ fontSize: '1rem' }}>{t('factions.createFactionDescription')}</Text>
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
                        onClick={() => createFactionForm.submit()}
                        loading={submitLoad}
                    >
                        {t('factions.createFaction')}
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

            {/* Content */}
            <div style={styles.content}>
                {/* Image */}
                <div style={styles.imageFormContainer}>
                    <ImageForm
                        title={t('factions.factionImage')}
                        submitLoad={submitLoad}
                        onFileChange={handleFileChange}
                    />
                </div>

                {/* Form */}
                <div style={{ flex: '1' }}>
                    <Form
                        name="createFaction"
                        layout="vertical"
                        form={createFactionForm}
                        style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
                        onFinish={submitCreateFaction}
                        scrollToFirstError={{ behavior: 'smooth', block: 'center' }}
                    >
                        {/* Basic Information */}
                        <div style={styles.formContainer}>
                            <div style={styles.formHeader}>
                                <Title level={4} style={{ marginTop: 0, marginBottom: 0 }}>
                                    {t('factions.basicInformation')}
                                </Title>
                                <Text type="secondary">{t('factions.basicInformationDescription')}</Text>
                            </div>
                            <div style={styles.formContent}>
                                <Form.Item
                                    name="name"
                                    label={t('factions.factionName')}
                                    labelCol={{ style: { fontWeight: 'bold' } }}
                                    rules={[
                                        {
                                            required: true,
                                            message: t('global.fieldRequired'),
                                        },
                                    ]}
                                >
                                    <Input
                                        placeholder={t('factions.factionNamePlaceholder')}
                                        size="large"
                                        maxLength={100}
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="description"
                                    label={t('factions.description')}
                                    labelCol={{ style: { fontWeight: 'bold' } }}
                                    rules={[
                                        {
                                            required: true,
                                            message: t('global.fieldRequired'),
                                        },
                                    ]}
                                >
                                    <Input.TextArea
                                        rows={6}
                                        placeholder={t('factions.descriptionPlaceholder')}
                                        maxLength={1000}
                                        showCount
                                    />
                                </Form.Item>
                            </div>
                        </div>

                        {/* Optional Details */}
                        <div style={styles.formContainer}>
                            <div style={styles.formHeader}>
                                <Title level={4} style={{ marginTop: 0, marginBottom: 0 }}>
                                    {t('factions.optionalDetails')}
                                </Title>
                                <Text type="secondary">{t('factions.optionalDetailsDescription')}</Text>
                            </div>
                            <div style={styles.formContent}>
                                <Form.Item
                                    name="color"
                                    label={t('factions.color')}
                                    labelCol={{ style: { fontWeight: 'bold' } }}
                                    initialValue="#000000"
                                >
                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <ColorPicker
                                            size="large"
                                            showText
                                            value={colorValue || "#000000"}
                                            onChange={(color) => handleColorChange(color)}
                                        />
                                        <Input
                                            placeholder={t('factions.colorPlaceholder')}
                                            size="large"
                                            maxLength={50}
                                            style={{ flex: 1 }}
                                            value={colorValue}
                                            onChange={(e) => handleColorChange(e.target.value)}
                                        />
                                    </div>
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
};
