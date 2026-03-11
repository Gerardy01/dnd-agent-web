import { Button, Form, Input, Typography } from "antd";
import { LockOutlined } from "@ant-design/icons";

// hooks
import useResetPassword from "@/hooks/resetPassword/useResetPassword";
import { useTranslation } from "react-i18next";

// components
import PageLoading from "@/components/global/PageLoading";

const { Title, Text } = Typography;

export default function ResetPassword() {

    const {
        pageLoad,
        load,
        resetPassForm,
        submitResetPassword,
    } = useResetPassword();

    const { t } = useTranslation();

    if (pageLoad) return <PageLoading />

    return (
        <div style={styles.page}>
            <div style={styles.container}>
                <div style={styles.contentHolder}>
                    <div style={styles.header}>
                        <Title level={2} style={styles.title}>{t('resetPassword.title')}</Title>
                        <Text type="secondary" style={styles.subtitle}>{t('resetPassword.subTitle')}</Text>
                    </div>

                    <Form
                        name="resetPassword"
                        form={resetPassForm}
                        onFinish={submitResetPassword}
                        style={styles.formSection}
                        autoComplete="off"
                    >
                        <Form.Item
                            name="password"
                            validateDebounce={500}
                            hasFeedback
                            rules={[
                                {
                                    required: true,
                                    message: `${t('global.fieldRequired')}`,
                                },
                                { min: 8, message: `${t('resetPassword.minLength')}` },
                                {
                                    pattern: /^(?=.*[A-Z]).*$/,
                                    message: `${t('resetPassword.uppercase')}`
                                },
                                {
                                    pattern: /^(?=.*\d).*$/,
                                    message: `${t('resetPassword.number')}`
                                },
                                {
                                    max: 100,
                                    message: `${t('resetPassword.maxLength')}`,
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
                                        return Promise.reject(new Error(t("resetPassword.passwordNotMatch")));
                                    }
                                })
                            ]}
                        >
                            <Input.Password
                                size="large"
                                placeholder={t('resetPassword.repeatPass')}
                                maxLength={100}
                                prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                                type="password"
                                onFocus={() => resetPassForm.setFields([{ name: 'confirmPassword', errors: [] }])}
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
                                {t('resetPassword.reset')}
                            </Button>
                        </Form.Item>
                    </Form>
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
    formSection: {
        marginBottom: '24px',
    },
}