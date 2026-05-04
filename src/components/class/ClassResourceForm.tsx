import { Button, ColorPicker, Form, Input, InputNumber, Select, Typography, type ColorPickerProps } from "antd";
import { CloseOutlined, DeleteOutlined, PictureOutlined, PlusOutlined, MinusOutlined } from "@ant-design/icons";
import { useEffect, useRef, useState } from "react";

// hooks
import useImageForm from "@/hooks/global/form/useImageForm";
import { useTranslation } from "react-i18next";
import useReferenceStore from "@/stores/useReferenceStore";

// interfaces
import type { CreateClassResourceDTO, MaxKnown } from "@/models/classInterfaces";

const { Text } = Typography;

type Color = Parameters<NonNullable<ColorPickerProps['onChange']>>[0];

interface ResourceFormProps {
    initialValues?: CreateClassResourceDTO;
    onSave: (resource: CreateClassResourceDTO, imageUrl: string) => void;
    onCancel: () => void;
    isEdit?: boolean;
    imageUrlEdit?: string;
}

const ClassResourceForm = ({ initialValues, onSave, onCancel, isEdit = false, imageUrlEdit = undefined }: ResourceFormProps) => {
    const { t } = useTranslation();
    const [form] = Form.useForm();
    const { classOptions } = useReferenceStore();
    const {
        fileInputRef,
        imageUrl,
        handleFileChange,
        handleRemoveImage,
    } = useImageForm((key) => form.setFieldsValue({ image: key }), imageUrlEdit || initialValues?.image);

    const colorValue = Form.useWatch('color', form);
    const [maxPerLevel, setMaxPerLevel] = useState<MaxKnown[]>(initialValues?.maxPerLevel || [...Array(20)].map((_, i) => ({ level: i + 1, amount: 0 })));
    const scrollRef = useRef<HTMLDivElement>(null);

    const handleColorChange = (color: Color | string) => {
        const hex = typeof color === 'string' ? color : color.toHexString();
        form.setFieldsValue({ color: hex });
    };

    const handleMaxChange = (index: number, amount: number) => {
        setMaxPerLevel((prev) => {
            const newState = [...prev];
            newState[index] = { ...newState[index], amount };
            return newState;
        });
    }

    const recoveryTypeSelection = classOptions.resourceRecoveryType.map((type) => ({ label: t(`classes.${type}`), value: type }));

    const [maxTotal, setMaxTotal] = useState<number>(maxPerLevel.length);

    const handleMaxTotalChange = (newTotal: number) => {
        setMaxTotal(newTotal);
        setMaxPerLevel((prev) => {
            if (newTotal > prev.length) {
                return [...prev, ...[...Array(newTotal - prev.length)].map((_, i) => ({ level: prev.length + i + 1, amount: 0 }))];
            } else {
                return prev.slice(0, newTotal);
            }
        });
    }

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({
                left: scrollRef.current.scrollWidth,
                behavior: 'smooth'
            });
        }
    }, [maxTotal]);

    const onFinish = (values: any) => {
        onSave({
            ...values,
            image: values.image || initialValues?.image || null,
            maxPerLevel: maxPerLevel,
            resourceRecovery: {
                shortRest: values.shortRest,
                longRest: values.longRest
            }
        }, imageUrl);
    }

    return (
        <div style={styles.bonusCard}>
            <div style={styles.bonusCardHeader}>
                <Text strong style={{ fontSize: '0.95rem' }}>
                    {isEdit ? t('classes.editResource') : t('classes.addResource')}
                </Text>
                <Button icon={<CloseOutlined />} type="text" onClick={onCancel} size="small" />
            </div>
            <div style={styles.bonusCardContent}>
                <Form
                    form={form}
                    layout="vertical"
                    initialValues={initialValues || {
                        color: '#000000',
                        shortRest: { value: 0, type: 'flat' },
                        longRest: { value: 0, type: 'flat' }
                    }}
                    onFinish={onFinish}
                    requiredMark={false}
                    component={false}
                >
                    <div style={styles.resourceImageUploadContainer}>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={(e) => handleFileChange(e.target.files?.[0]!)}
                        />
                        <div
                            style={styles.resourceImagePreview}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            {imageUrl ? (
                                <img src={imageUrl} alt="Resource" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <div style={styles.resourceImagePlaceholder}>
                                    <PictureOutlined style={{ fontSize: '2.5rem', color: '#8c7a52', marginBottom: '0.5rem' }} />
                                    <Text type="secondary" style={{ fontSize: '0.85rem' }}>{t('global.dropImageHere')}</Text>
                                </div>
                            )}
                            {imageUrl && (
                                <Button
                                    icon={<DeleteOutlined />}
                                    size="small"
                                    danger
                                    style={styles.resourceImageRemoveBtn}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleRemoveImage();
                                    }}
                                />
                            )}
                        </div>
                        <Form.Item name="image" noStyle>
                            <Input type="hidden" />
                        </Form.Item>
                    </div>

                    <Form.Item
                        label={t('classes.resourceName')}
                        name="name"
                        rules={[{ required: true, message: t('global.fieldRequired') }]}
                        labelCol={{ style: { fontWeight: 'bold', fontSize: '0.85rem' } }}
                    >
                        <Input placeholder={t('classes.resourceNamePlaceholder')} maxLength={50} size="large" />
                    </Form.Item>

                    <Form.Item
                        label={t('classes.resourceDescription')}
                        name="description"
                        rules={[{ required: true, message: t('global.fieldRequired') }]}
                        labelCol={{ style: { fontWeight: 'bold', fontSize: '0.85rem' } }}
                    >
                        <Input.TextArea rows={4} placeholder={t('classes.resourceDescriptionPlaceholder')} maxLength={500} showCount size="large" />
                    </Form.Item>

                    <Form.Item
                        label={t('classes.resourceColor')}
                        name="color"
                        labelCol={{ style: { fontWeight: 'bold', fontSize: '0.85rem' } }}
                    >
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <ColorPicker
                                size="large"
                                showText
                                value={colorValue || "#000000"}
                                onChange={handleColorChange}
                            />
                            <Input
                                placeholder={t('classes.resourceColorPlaceholder')}
                                size="large"
                                maxLength={10}
                                style={{ flex: 1 }}
                                value={colorValue}
                                onChange={(e) => handleColorChange(e.target.value)}
                            />
                        </div>
                    </Form.Item>

                    <div style={{ ...styles.maxKnownCard, backgroundColor: '#fbf9f6' }}>
                        <div style={styles.bonusCardHeader}>
                            <Text strong style={{ fontSize: '0.85rem' }}>{t('classes.maxPerLevel')}</Text>
                        </div>
                        <div style={styles.maxKnownCardContent}>
                            <div ref={scrollRef} style={{ ...styles.maxKnownRow, maxWidth: '35rem', paddingRight: '0px' }}>
                                {maxPerLevel.map((item, index) => (
                                    <div key={index} style={styles.maxKnownCol}>
                                        <Text strong>{index + 1}</Text>
                                        <InputNumber
                                            style={styles.maxKnownInput}
                                            min={0}
                                            max={50}
                                            value={item.amount}
                                            onChange={(val) => handleMaxChange(index, val || 0)}
                                            mode="spinner"
                                            controls={false}
                                        />
                                    </div>
                                ))}
                            </div>
                            <div style={{ ...styles.maxKnownLabelContainer, padding: '1.2rem 1rem 0px 1rem', backgroundColor: '#fbf9f6' }}>
                                <Text strong>{t('global.max')}</Text>
                            </div>
                            <div style={{ ...styles.maxKnownControlContainer, backgroundColor: '#fbf9f6' }}>
                                <Button
                                    type="text"
                                    icon={<PlusOutlined />}
                                    onClick={() => handleMaxTotalChange(maxTotal + 1)}
                                />
                                <Button
                                    type="text"
                                    icon={<MinusOutlined />}
                                    onClick={() => handleMaxTotalChange(maxTotal - 1)}
                                    disabled={maxTotal === 1}
                                />
                            </div>
                        </div>
                    </div>

                    <div style={{ ...styles.bonusCard, backgroundColor: '#fbf9f6' }}>
                        <div style={styles.bonusCardHeader}>
                            <Text strong>Resource Recovery</Text>
                        </div>
                        <div style={styles.bonusCardContent}>
                            <div style={styles.recoveryInputCard}>
                                <Text strong style={{ fontSize: '0.85rem', color: '#8c7a52', marginBottom: '0.5rem' }}>Short Rest</Text>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <Form.Item name={['shortRest', 'value']} noStyle>
                                        <InputNumber min={0} size="large" style={{ flex: 1 }} />
                                    </Form.Item>
                                    <Form.Item name={['shortRest', 'type']} noStyle>
                                        <Select options={recoveryTypeSelection} size="large" style={{ width: '8.5rem' }} />
                                    </Form.Item>
                                </div>
                            </div>
                            <div style={styles.recoveryInputCard}>
                                <Text strong style={{ fontSize: '0.85rem', color: '#8c7a52', marginBottom: '0.5rem' }}>Long Rest</Text>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <Form.Item name={['longRest', 'value']} noStyle>
                                        <InputNumber min={0} size="large" style={{ flex: 1 }} />
                                    </Form.Item>
                                    <Form.Item name={['longRest', 'type']} noStyle>
                                        <Select options={recoveryTypeSelection} size="large" style={{ width: '8.5rem' }} />
                                    </Form.Item>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                        <Button onClick={onCancel}>{t('global.cancel')}</Button>
                        <Button type="primary" onClick={() => form.submit()}>
                            {isEdit ? t('global.save') : t('global.add')}
                        </Button>
                    </div>
                </Form>
            </div>
        </div>
    );
};

const styles: Record<string, React.CSSProperties> = {
    bonusCard: {
        backgroundColor: '#f8f6f0',
        border: '1px solid #e0dcd3',
        borderRadius: '0.75rem',
        overflow: 'hidden',
        marginBottom: '1rem',
    },
    bonusCardHeader: {
        padding: '0.75rem 1.25rem',
        borderBottom: '1px solid #e0dcd3',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    bonusCardContent: {
        padding: '1.25rem',
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
        position: 'relative',
    },
    maxKnownRow: {
        display: 'flex',
        gap: '0.5rem',
        width: 'calc(100vw - 30rem)',
        maxWidth: '40rem',
        overflowX: 'auto',
        paddingLeft: '3.8rem',
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
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        width: '4rem',
        backgroundColor: '#fff',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        borderRight: '1px solid #e0dcd3',
        zIndex: 2,
    },
    maxKnownControlContainer: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        width: '3rem',
        backgroundColor: '#fff',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        borderLeft: '1px solid #e0dcd3',
        zIndex: 2,
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
    resourceImagePlaceholder: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
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
};

export default ClassResourceForm;
