import { Button, Spin, Typography, Upload } from "antd";
import { DeleteOutlined, PictureOutlined, UploadOutlined } from "@ant-design/icons";

// assets
import { SparklesIcon } from "@/assets";

// hooks
import useImageForm from "@/hooks/global/form/useImageForm";
import { useTranslation } from "react-i18next";

// interfaces
interface Props {
    title: string;
    submitLoad: boolean;
    onFileChange: (fileUrl: string) => void;
    initialImage?: string | null;
}


const { Title, Text } = Typography;


export default function ImageForm({ title, submitLoad, onFileChange, initialImage }: Props) {

    const {
        fileInputRef,
        loading,
        imageUrl,
        handleFileChange,
        handleRemoveImage,
    } = useImageForm(onFileChange, initialImage);

    const { t } = useTranslation();

    return (
        <div style={styles.imageFormContainer}>
            <Title level={4} style={{ marginTop: 0, marginBottom: '1rem' }}>
                {title}
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
                        {!loading ? (
                            <div style={styles.uploadIconContainer}>
                                <PictureOutlined style={{ fontSize: '1.8rem' }} />
                            </div>
                        ) : (
                            <Spin size="large" style={{ marginBottom: '2rem' }} />
                        )}
                        <div>
                            <Text strong style={{ display: 'block', fontSize: '1rem' }}>{t('global.dropImageHere')}</Text>
                            <Text type="secondary" style={{ fontSize: '0.85rem' }}>{t('global.orClickToBrowse')}</Text>
                        </div>
                    </div>
                </Upload.Dragger>
            ) : (
                <div style={styles.imagePreviewContainer}>
                    <img src={imageUrl} alt="Item" style={styles.imagePreview} />
                    <button
                        style={styles.removeBtn}
                        disabled={submitLoad}
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
                    loading={loading}
                    disabled={submitLoad}
                >
                    {t('global.upload')}
                </Button>
                <Button
                    icon={<SparklesIcon style={{ fontSize: '1rem' }} />}
                    style={{ flex: 1, padding: '1.2rem', borderColor: '#d4cebe', borderRadius: '8px' }}
                    disabled={submitLoad}
                    loading={loading}
                >
                    {t('global.generate')}
                </Button>
            </div>
        </div>
    );
}

const styles: { [key: string]: React.CSSProperties } = {
    imageFormContainer: {
        padding: '1.5rem',
        backgroundColor: '#fbf9f6',
        borderRadius: '1rem',
        border: '1px solid #e0dcd3'
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
}