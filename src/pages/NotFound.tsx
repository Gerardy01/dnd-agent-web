import React from 'react';
import { Button, Typography } from 'antd';
import { CompassOutlined } from '@ant-design/icons';

// hooks
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

export default function NotFound() {

    const navigate = useNavigate();
    const { t } = useTranslation();

    return (
        <div style={styles.page}>
            <div style={styles.container}>
                <div style={styles.contentHolder}>
                    <div style={styles.header}>
                        <div style={styles.iconWrapper}>
                            <CompassOutlined style={{ fontSize: '32px', color: 'white' }} />
                        </div>
                        <Title level={2} style={styles.title}>{t('notFound.title')}</Title>
                        <Text type="secondary">
                            {t('notFound.subTitle')}
                        </Text>
                    </div>

                    <div style={{ marginTop: '2.5rem' }}>
                        <Button
                            type="primary"
                            size="large"
                            block
                            style={styles.continueButton}
                            onClick={() => navigate('/')}
                        >
                            {t('notFound.return')}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

const styles: { [key: string]: React.CSSProperties } = {
    page: {
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: '#EAE3D2', // Faded Canvas
        fontFamily: "'Palatino Linotype', 'Book Antiqua', Palatino, serif", // Adding a whimsical touch to font
    },
    container: {
        maxWidth: '75rem',
        flex: '1',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem'
    },
    contentHolder: {
        maxWidth: '30rem',
        flex: 1,
        backgroundColor: '#F5F1E7', // Birch Wood
        padding: '40px 32px',
        borderRadius: '16px',
        border: '1px solid #C2BAA6', // Dried Twig
        boxShadow: '0 10px 25px -5px rgba(62, 74, 61, 0.15), 0 10px 10px -5px rgba(62, 74, 61, 0.1)',
    },
    header: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
    },
    iconWrapper: {
        width: '64px',
        height: '64px',
        backgroundColor: '#D95C14', // Autumn Rust
        borderRadius: '50%', // More natural/whimsical shape than rigid square
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: '16px',
        boxShadow: '0 4px 6px -1px rgba(217, 92, 20, 0.3), 0 2px 4px -1px rgba(217, 92, 20, 0.2)',
    },
    title: {
        margin: '0 0 8px 0',
        fontWeight: 600,
        fontSize: '48px',
    },
    continueButton: {
        fontWeight: 600,
        height: '48px',
    },
};