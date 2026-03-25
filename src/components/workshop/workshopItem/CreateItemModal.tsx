import { useRef, useState } from "react";
import { Button, Divider, Form, Modal, Typography, Upload } from "antd";

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

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    const handleFileChange = (file: File) => {
        if (!file) return;
        // Temporarily preview with a local object URL
        // Replace setImageUrl call with the S3 URL returned from the API when wiring the real upload
        setImageUrl(URL.createObjectURL(file));
    };

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
                    >
                        Create Item
                    </Button>
                    <Divider vertical style={styles.titleDivier} />
                    <Button
                        icon={<CloseOutlined />}
                        style={{ padding: '1.2rem', borderRadius: '50%' }}
                        onClick={onClose}
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
                                        setImageUrl(null);
                                        if (fileInputRef.current) fileInputRef.current.value = '';
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
                    <Form>
                        <div style={styles.formContainer}>
                            <div style={styles.formHeader}>
                                <Title level={4} style={{ marginTop: 0, marginBottom: 0 }}>
                                    Basic Information
                                </Title>
                                <Text type="secondary">Add basic information about your item</Text>
                            </div>
                            <div style={styles.formContent}>

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
    }
}