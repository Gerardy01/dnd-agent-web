import { Button, Checkbox, Divider, Form, Input, Modal, Typography } from "antd";
import { UserOutlined } from "@ant-design/icons";

// hooks
import useInitModal from "@/hooks/global/useInitModal";
import { useTranslation } from "react-i18next";

const { Title, Text, Link } = Typography;

export default function InitModal() {

    const {
        username,
        termsChecked,
        load,
        errMsg,
        handleTermsChecked,
        submitUsernameData,
    } = useInitModal();

    const { t } = useTranslation();

    return (
        <Modal
            open={!username}
            closable={false}
            centered
            footer={null}
        >
            <Title level={3}>{t("initModal.title")}</Title>
            <Text type="secondary" style={styles.subtitle}>{t("initModal.subTitle")}</Text>
            <Form
                name="changeUsername"
                onFinish={submitUsernameData}
                style={styles.formSection}
                autoComplete="off"
            >
                <Form.Item
                    name="username"
                    rules={[
                        {
                            required: true,
                            message: t("global.fieldRequired"),
                        },
                        {
                            pattern: /^[a-zA-Z0-9_]+$/,
                            message: t("initModal.invalid"),
                        },
                        {
                            min: 4,
                            message: t("initModal.min"),
                        },
                    ]}
                    validateTrigger="onSubmit"
                    help={errMsg ? t(`error.account.${errMsg}`) : undefined}
                    validateStatus={errMsg ? 'error' : ''}
                >
                    <Input
                        size="large"
                        placeholder={t("initModal.newUsername")}
                        maxLength={20}
                        prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                    />
                </Form.Item>
                <Form.Item
                    style={{ marginTop: '3rem', marginBottom: '0.5rem' }}
                >
                    <Checkbox
                        onChange={e => handleTermsChecked(e.target.checked)}
                        checked={termsChecked}
                        disabled={load}
                    >{t("initModal.terms")}</Checkbox>
                </Form.Item>
                <Text
                    style={{ fontSize: '12px' }}
                >
                    {t("initModal.termsMsg")}
                    <Link href="#" style={{ fontSize: '12px' }}> {t("initModal.termsOfService")} </Link>
                    <Text style={{ fontSize: '12px' }}>{t("global.and")} </Text>
                    <Link href="#" style={{ fontSize: '12px' }}>{t("initModal.privacyPolicy")}</Link>
                </Text>
                <Divider />
                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        block
                        style={styles.submitButton}
                        disabled={!termsChecked}
                        loading={load}
                    >
                        {t("global.submit")}
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    )
}

const styles: { [key: string]: React.CSSProperties } = {
    subTitle: {
        marginBottom: '1rem',
    },
    formSection: {
        marginTop: '1rem'
    },
    submitButton: {
        height: '2.7rem',
        fontWeight: 'bold',
    }
}