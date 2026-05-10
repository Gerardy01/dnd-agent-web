import { Button, Col, Form, Input, InputNumber, Row, Select, Typography } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

// hooks
import useFeatureForm from "@/hooks/class/useFeatureForm";

// interfaces
import type { Features } from "@/models/classInterfaces";

const { Text } = Typography;

interface Props {
    initialValues?: Features;
    onSave: (feature: Features) => void;
    onCancel: () => void;
    featureTypeSelection: { label: string; value: string }[];
    isEdit?: boolean;
    isLoading?: boolean;
}

export default function FeatureForm({ initialValues, onSave, onCancel, featureTypeSelection, isEdit = false, isLoading = false }: Props) {
    const { t } = useTranslation();
    const { form, onFinish } = useFeatureForm({ onSave });

    return (
        <div style={styles.bonusCard}>
            <div style={styles.bonusCardHeader}>
                <Text strong style={{ fontSize: '0.95rem' }}>
                    {isEdit ? t('classes.editFeature') : t('classes.addFeature')}
                </Text>
                <Button icon={<CloseOutlined />} type="text" onClick={onCancel} size="small" disabled={isLoading} />
            </div>
            <div style={styles.bonusCardContent}>
                <Form
                    form={form}
                    layout="vertical"
                    initialValues={initialValues || { level: 1, type: 'active' }}
                    onFinish={onFinish}
                    requiredMark={false}
                    component={false}
                    disabled={isLoading}
                    scrollToFirstError={{ behavior: 'smooth', block: 'center' }}
                >
                    <Form.Item
                        label={t('classes.featureName')}
                        name="name"
                        rules={[{ required: true, message: t('global.fieldRequired') }]}
                        labelCol={{ style: { fontWeight: 'bold', fontSize: '0.85rem' } }}
                    >
                        <Input placeholder={t('classes.featureNamePlaceholder')} maxLength={50} size="large" />
                    </Form.Item>
                    <Form.Item
                        label={t('classes.featureDescription')}
                        name="description"
                        rules={[{ required: true, message: t('global.fieldRequired') }]}
                        labelCol={{ style: { fontWeight: 'bold', fontSize: '0.85rem' } }}
                    >
                        <Input.TextArea rows={4} placeholder={t('classes.featureDescriptionPlaceholder')} maxLength={1250} showCount size="large" />
                    </Form.Item>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label={t('classes.levelRequired')}
                                name="level"
                                rules={[{ required: true, message: t('global.fieldRequired') }]}
                                labelCol={{ style: { fontWeight: 'bold', fontSize: '0.85rem' } }}
                            >
                                <InputNumber min={1} max={99} style={{ width: '100%' }} mode="spinner" size="large" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label={t('classes.featureType')}
                                name="type"
                                rules={[{ required: true, message: t('global.fieldRequired') }]}
                                labelCol={{ style: { fontWeight: 'bold', fontSize: '0.85rem' } }}
                            >
                                <Select options={featureTypeSelection} placeholder={t('classes.featureTypePlaceholder')} size="large" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                        <Button onClick={onCancel} disabled={isLoading}>{t('global.cancel')}</Button>
                        <Button type="primary" onClick={() => form.submit()} loading={isLoading}>
                            {isEdit ? t('global.save') : t('global.add')}
                        </Button>
                    </div>
                </Form>
            </div>
        </div>
    );
}

const styles: { [key: string]: React.CSSProperties } = {
    bonusCard: {
        backgroundColor: '#f8f6f0',
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
};
