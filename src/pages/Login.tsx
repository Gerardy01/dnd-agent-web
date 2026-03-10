import { Button, Input, Divider, Typography, Form, Alert, Spin } from 'antd';
import { MailOutlined, GoogleOutlined, LockOutlined } from '@ant-design/icons';

// hooks
import { useTranslation } from 'react-i18next';
import useLogin from '@/hooks/login/useLogin';

const { Title, Text, Link } = Typography;



export default function Login() {

    const {
        loginForm,
        loading,
        errorMsg,
        pageLoad,
        handleClickSignUp,
        submitLoginData,
    } = useLogin();

    const { t } = useTranslation();

    if (pageLoad) {
        return (
            <div style={styles.page}>
                <div style={styles.container}>
                    <Spin size="large" />
                </div>
            </div>
        )
    }

    return (
        <div style={styles.page}>
            <div style={styles.container}>
                <div style={styles.contentHolder}>
                    <div style={styles.header}>
                        <div style={styles.iconWrapper}>
                            <svg viewBox="0 0 24 24" width="32" height="32" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                                <circle cx="15.5" cy="15.5" r="1.5"></circle>
                            </svg>
                        </div>
                        <Title level={2} style={styles.title}>{t('login.title')}</Title>
                        <Text type="secondary" style={styles.subtitle}>{t('login.subTitle')}</Text>
                    </div>

                    {errorMsg && (
                        <Alert
                            title={t(`error.account.${errorMsg}`)}
                            type="error"
                            showIcon
                            style={{ marginBottom: '16px' }}
                        />
                    )}

                    <Form
                        name="login"
                        form={loginForm}
                        onFinish={submitLoginData}
                        style={styles.formSection}
                        autoComplete="off"
                    >
                        <Form.Item
                            name="identifier"
                            validateTrigger="onSubmit"
                            rules={[
                                {
                                    required: true,
                                    message: `${t('global.fieldRequired')}`,
                                },
                            ]}
                        >
                            <Input
                                size="large"
                                placeholder={t("login.identifier")}
                                maxLength={50}
                                prefix={<MailOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                            />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            validateTrigger="onSubmit"
                            rules={[
                                {
                                    required: true,
                                    message: `${t('global.fieldRequired')}`,
                                }
                            ]}
                            style={{ marginBottom: '8px' }}
                        >
                            <Input.Password
                                size="large"
                                placeholder={t("global.password")}
                                prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                                maxLength={100}
                                type="password"
                            />
                        </Form.Item>

                        <div style={styles.forgotPasswordContainer}>
                            <Link style={styles.link}>{t("login.forgotPassword")}</Link>
                        </div>

                        <Form.Item style={{ marginTop: '2rem' }}>
                            <Button
                                type="primary"
                                htmlType="submit"
                                size="large"
                                block
                                style={styles.continueButton}
                                loading={loading}
                            >
                                {t("login.enterRealm")}
                            </Button>
                        </Form.Item>
                    </Form>

                    <Divider style={styles.divider} className="custom-divider">
                        <Text>{t("login.orContinueWith")}</Text>
                    </Divider>

                    <Button
                        size="large"
                        block
                        icon={<GoogleOutlined />}
                        style={styles.googleButton}
                        disabled={loading}
                    >
                        {t("login.withGoogle")}
                    </Button>

                    <div style={styles.footer}>
                        <Text type="secondary">{t("login.noAccount")} </Text>
                        <Link
                            style={styles.link}
                            onClick={handleClickSignUp}
                        >{t("login.createAccount")}</Link>
                    </div>
                </div>
            </div>
        </div>
    )
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
        marginBottom: '32px',
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
    },
    subtitle: {
        fontSize: '14px',
        opacity: 0.9,
    },
    formSection: {
        marginBottom: '24px',
    },
    forgotPasswordContainer: {
        display: 'flex',
        justifyContent: 'flex-start',
        margin: '1rem 0px',
    },
    continueButton: {
        fontWeight: 600,
        height: '48px',
    },
    divider: {
        fontSize: '14px',
        margin: '24px 0',
    },
    googleButton: {
        fontWeight: 500,
        height: '48px',
        marginBottom: '32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    footer: {
        textAlign: 'center',
        fontSize: '14px',
    },
    link: {
        fontWeight: 600,
    }
};
