import { Alert, Button, Form, Input, Typography } from "antd";
import { MailOutlined } from "@ant-design/icons";

// hooks
import useForgotPassword from "@/hooks/forgotPassword/useForgotPassword";
import { useTranslation } from "react-i18next";

// components
import PageLoading from "@/components/global/PageLoading";

const { Title, Text, Link } = Typography;


export default function ForgotPassword() {

    const {
        pageLoad,
        load,
        errorMsg,
        success,
        handleForgotPassword,
        backToLogin,
    } = useForgotPassword();

    const { t } = useTranslation();

    if (pageLoad) return <PageLoading />;

    return (
        <div style={styles.page}>
            <div style={styles.container}>
                <div style={styles.contentHolder}>
                    {success ? (
                        <div style={styles.header}>
                            <Title level={2} style={styles.title}>{t('forgotPassword.sent')}</Title>
                            <Text type="secondary" style={styles.subtitle}>{t('forgotPassword.sentMsg')}</Text>
                        </div>
                    ) : (
                        <>
                            <div style={styles.header}>
                                <Title level={2} style={styles.title}>{t('forgotPassword.title')}</Title>
                                <Text type="secondary" style={styles.subtitle}>{t('forgotPassword.subTitle')}</Text>
                            </div>

                            {errorMsg && (
                                <Alert
                                    title="Account with this email not found."
                                    type="error"
                                    showIcon
                                    style={{ marginBottom: '16px' }}
                                />
                            )}

                            <Form
                                name="forgotPassword"
                                autoComplete="off"
                                onFinish={handleForgotPassword}
                            >
                                <Form.Item
                                    name="email"
                                    validateTrigger="onSubmit"
                                    rules={[
                                        {
                                            required: true,
                                            message: `${t('global.fieldRequired')}`,
                                        },
                                        {
                                            type: 'email',
                                            message: `${t('forgotPassword.validEmail')}`,
                                        },
                                    ]}
                                >
                                    <Input
                                        placeholder={t('forgotPassword.email')}
                                        size="large"
                                        maxLength={50}
                                        prefix={<MailOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    />
                                </Form.Item>
                                <Form.Item style={styles.submitBtn}>
                                    <Button
                                        type="primary"
                                        size="large"
                                        block
                                        htmlType="submit"
                                        loading={load}
                                    >
                                        {t('forgotPassword.resetPassword')}
                                    </Button>
                                </Form.Item>
                            </Form>
                        </>
                    )}

                    <div style={styles.footer}>
                        <Link
                            onClick={backToLogin}
                        >{t('forgotPassword.backToLogin')}</Link>
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
        backgroundColor: '#EAE3D2',
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
        maxWidth: '25rem',
        flex: 1,
        backgroundColor: '#F5F1E7',
        padding: '40px 32px',
        borderRadius: '16px',
        border: '1px solid #C2BAA6',
        boxShadow: '0 10px 25px -5px rgba(62, 74, 61, 0.15), 0 10px 10px -5px rgba(62, 74, 61, 0.1)',
    },
    header: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        marginBottom: '32px',
    },
    footer: {
        textAlign: 'center',
    },
    submitBtn: {
        marginTop: '2rem',
    }
}