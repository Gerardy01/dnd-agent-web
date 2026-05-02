import { Alert, Button, Input, Typography } from "antd";
import { MailOutlined } from "@ant-design/icons";

// components
import PageLoading from "@/components/global/PageLoading";

// hooks
import { useTranslation } from "react-i18next";
import useVerification from "@/hooks/verification/useVerification"

const { Text, Title, Link } = Typography;

export default function Verification() {

    const {
        email,
        pageLoad,
        load,
        otp,
        cooldown,
        errMsg,
        handleChangeOtp,
        submitOtp,
        handleResendOtp,
    } = useVerification();

    const { t } = useTranslation();

    if (pageLoad) {
        return (
            <PageLoading />
        )
    }

    return (
        <div style={styles.page}>
            <div style={styles.container}>
                <div style={styles.contentHolder} className="verification-card">
                    <div style={styles.header}>
                        <div style={styles.iconWrapper}>
                            <MailOutlined
                                style={{
                                    fontSize: '2rem',
                                    color: 'white'
                                }}
                            />
                        </div>
                        <Title level={4}>{t('verification.title')}</Title>
                        <Text type="secondary">{t('verification.subTitle')} {email}</Text>
                    </div>

                    {errMsg && (
                        <Alert
                            title={t(`error.auth.${errMsg}`)}
                            type="error"
                            showIcon
                            style={{ marginBottom: '16px', textAlign: 'left' }}
                        />
                    )}

                    <Input.OTP
                        size="large"
                        style={styles.otpInput}
                        value={otp}
                        onChange={handleChangeOtp}
                    />
                    <div style={styles.footer}>
                        <Text type="secondary">{t('verification.didntReceive')} </Text>
                        <Link
                            style={styles.link}
                            onClick={handleResendOtp}
                            disabled={cooldown > 0}
                        >{t('verification.resend')} {cooldown > 0 ? `(${cooldown}s)` : ''}</Link>
                    </div>

                    <Button
                        type="primary"
                        htmlType="submit"
                        size="large"
                        block
                        disabled={!otp || otp.length < 6}
                        onClick={submitOtp}
                        loading={load}
                    >
                        {t('verification.verify')}
                    </Button>
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
        maxWidth: '26rem',
        flex: 1,
        backgroundColor: '#F5F1E7', // Birch Wood
        padding: '2rem',
        borderRadius: '16px',
        border: '1px solid #C2BAA6', // Dried Twig
        boxShadow: '0 10px 25px -5px rgba(62, 74, 61, 0.15), 0 10px 10px -5px rgba(62, 74, 61, 0.1)',
        textAlign: 'center',
    },
    header: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        marginBottom: '1rem',
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
    footer: {
        textAlign: 'center',
        margin: '1.2rem 0px',
    },
    otpInput: {
        width: '100%',
        marginBottom: '1.5rem',
    },
};