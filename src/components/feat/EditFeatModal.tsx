import { Button, Divider, Form, Input, InputNumber, Modal, Select, Typography } from "antd";

// hooks
import useEditFeat from "@/hooks/feat/useEditFeat";
import { useTranslation } from "react-i18next";

// assets
import { SparklesIcon } from "@/assets";
import { CloseOutlined } from "@ant-design/icons";

// components
import ImageForm from "@/components/global/form/ImageForm";
import EditModalSkeleton from "@/components/global/common/EditModalSkeleton";

// interfaces
import type { Feat } from "@/models/featInterfaces";
interface Props {
    open: boolean;
    onClose: () => void;
    onSubmit: (feat: Feat) => Promise<void>;
    getData: () => Promise<Feat | null>;
}

const { Title, Text } = Typography;


export default function EditFeatModal({ open, onClose, onSubmit, getData }: Props) {

    const {
        feat,
        editFeatForm,
        categorySelection,
        submitLoad,
        handleFileChange,
        submitEditFeat,
        handleCloseModal,
    } = useEditFeat(onClose, onSubmit, getData);

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
            {feat ? (
                <>
                    {/* Header */}
                    <div style={styles.header}>
                        <div>
                            <Title level={2} style={{ margin: '0px' }}>{t('feats.editFeatTitle')}</Title>
                            <Text style={{ fontSize: '1rem' }}>{t('feats.editFeatDescription')}</Text>
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
                                onClick={() => editFeatForm.submit()}
                                loading={submitLoad}
                            >
                                {t('feats.editFeat')}
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
                                title={t('feats.featImage')}
                                submitLoad={submitLoad}
                                onFileChange={handleFileChange}
                                initialImage={feat?.image || ""}
                            />
                        </div>

                        {/* Form */}
                        <div style={{ flex: '1' }}>
                            <Form
                                name="editFeat"
                                layout="vertical"
                                form={editFeatForm}
                                style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
                                onFinish={submitEditFeat}
                                scrollToFirstError={{ behavior: 'smooth', block: 'center' }}
                            >
                                {/* Basic Information */}
                                <div style={styles.formContainer}>
                                    <div style={styles.formHeader}>
                                        <Title level={4} style={{ marginTop: 0, marginBottom: 0 }}>
                                            {t('feats.basicInformation')}
                                        </Title>
                                        <Text type="secondary">{t('feats.basicInformationDescription')}</Text>
                                    </div>
                                    <div style={styles.formContent}>
                                        <Form.Item
                                            name="name"
                                            label={t('feats.featName')}
                                            labelCol={{ style: { fontWeight: 'bold' } }}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: t('global.fieldRequired'),
                                                },
                                            ]}
                                        >
                                            <Input
                                                placeholder={t('feats.featNamePlaceholder')}
                                                size="large"
                                                maxLength={100}
                                            />
                                        </Form.Item>

                                        <Form.Item
                                            name="description"
                                            label={t('feats.description')}
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
                                                placeholder={t('feats.descriptionPlaceholder')}
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
                                            {t('feats.optionalDetails')}
                                        </Title>
                                        <Text type="secondary">{t('feats.optionalDetailsDescription')}</Text>
                                    </div>
                                    <div style={styles.formContent}>
                                        <Form.Item
                                            name="category"
                                            label={t('feats.category')}
                                            labelCol={{ style: { fontWeight: 'bold' } }}
                                        >
                                            <Select
                                                placeholder={t('feats.categoryPlaceholder')}
                                                size="large"
                                                options={categorySelection}
                                                showSearch
                                            />
                                        </Form.Item>
                                    </div>
                                </div>

                                {/* Prerequisites */}
                                <div style={styles.formContainer}>
                                    <div style={styles.formHeader}>
                                        <Title level={4} style={{ marginTop: 0, marginBottom: 0 }}>
                                            {t('feats.prerequisites')}
                                        </Title>
                                        <Text type="secondary">{t('feats.prerequisitesDescription')}</Text>
                                    </div>
                                    <div style={styles.formContent}>
                                        <Form.Item
                                            name="minLevel"
                                            label={t('feats.minLevel')}
                                            labelCol={{ style: { fontWeight: 'bold' } }}
                                            extra={<Text type="secondary" style={{ fontSize: '0.82rem' }}>{t('feats.minLevelDescription')}</Text>}
                                        >
                                            <InputNumber
                                                placeholder={t('feats.minLevelPlaceholder')}
                                                size="large"
                                                min={1}
                                                max={20}
                                                mode="spinner"
                                                style={{ width: '100%' }}
                                            />
                                        </Form.Item>
                                    </div>
                                </div>
                            </Form>
                        </div>
                    </div>
                </>
            ) : (
                <EditModalSkeleton />
            )}
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