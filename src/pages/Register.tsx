import { Button, Input, Divider, Typography, Form } from 'antd';
import { MailOutlined, GoogleOutlined, LockOutlined } from '@ant-design/icons';

// hooks
import useRegister from '@/hooks/register/useRegister';
import { useTranslation } from 'react-i18next';

const { Title, Text, Link } = Typography;



export default function Register() {

    const {
        load,
        errorMsg,
        registerForm,
        handleClickSignIn,
        submitRegisterData
    } = useRegister();

    const { t } = useTranslation();

    return (
        <div style={styles.page}>
            <div style={styles.container}>
                <div style={styles.contentHolder}>
                    <div style={styles.header}>
                        <div style={styles.iconWrapper}>
                            <svg viewBox="0 0 24 24" width="32" height="32" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                            </svg>
                        </div>
                        <Title level={2} style={styles.title}>{t('register.title')}</Title>
                        <Text type="secondary" style={styles.subtitle}>{t('register.subTitle')}</Text>
                    </div>

                    <Form
                        name="register"
                        form={registerForm}
                        onFinish={submitRegisterData}
                        style={styles.formSection}
                        autoComplete="off"
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
                                    message: `${t('register.validEmail')}`,
                                },
                            ]}
                            help={errorMsg ? t('error.account.ACCOUNT001') : undefined}
                            validateStatus={errorMsg ? 'error' : ''}
                        >
                            <Input
                                size="large"
                                placeholder={t('register.email')}
                                maxLength={50}
                                prefix={<MailOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                            />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            validateDebounce={500}
                            hasFeedback
                            rules={[
                                {
                                    required: true,
                                    message: `${t('global.fieldRequired')}`,
                                },
                                { min: 8, message: `${t('register.minLength')}` },
                                {
                                    pattern: /^(?=.*[A-Z]).*$/,
                                    message: `${t('register.uppercase')}`
                                },
                                {
                                    pattern: /^(?=.*\d).*$/,
                                    message: `${t('register.number')}`
                                },
                                {
                                    max: 100,
                                    message: `${t('register.maxLength')}`,
                                },
                            ]}
                        >
                            <Input.Password
                                size="large"
                                placeholder={t('global.password')}
                                prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                                maxLength={100}
                                type="password"
                            />
                        </Form.Item>
                        <Form.Item
                            name="confirmPassword"
                            required
                            dependencies={['password']}
                            validateTrigger="onBlur"
                            rules={[
                                { required: true, message: `${t('global.fieldRequired')}` },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('password') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error(t("register.passwordNotMatch")));
                                    }
                                })
                            ]}
                        >
                            <Input.Password
                                size="large"
                                placeholder={t('register.repeatPass')}
                                maxLength={100}
                                prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                                type="password"
                                onFocus={() => registerForm.setFields([{ name: 'confirmPassword', errors: [] }])}
                            />
                        </Form.Item>
                        <Form.Item style={{ marginTop: '2rem' }}>
                            <Button
                                type="primary"
                                htmlType="submit"
                                size="large"
                                block
                                style={styles.continueButton}
                                loading={load}
                            >
                                {t('global.continue')}
                            </Button>
                        </Form.Item>
                    </Form>

                    <Divider style={styles.divider} className="custom-divider">
                        <Text>{t('register.orRegisterWith')}</Text>
                    </Divider>

                    <Button
                        size="large"
                        block
                        icon={<GoogleOutlined />}
                        style={styles.googleButton}
                        disabled={load}
                    >
                        {t("register.withGoogle")}
                    </Button>

                    <div style={styles.footer}>
                        <Text type="secondary">{t('register.haveAccount')} </Text>
                        <Link
                            style={styles.link}
                            onClick={handleClickSignIn}
                        >{t('global.signIn')}</Link>
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
        maxWidth: '30rem',
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