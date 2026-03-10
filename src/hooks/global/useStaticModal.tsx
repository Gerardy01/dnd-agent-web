import { App, Typography } from "antd";
import { useTranslation } from 'react-i18next';
import { CheckCircleOutlined, CloseCircleOutlined, InfoCircleOutlined, WarningOutlined } from "@ant-design/icons";
import { theme } from "@/constants/theme";

// types and interfaces
interface ConfirmationModalParams {
    title: string,
    content: string,
    onOk?: () => void,
    onOkWithPromise?: () => Promise<void>,
    onCancel?: () => void,
    okBtn?: string,
    cancelBtn?: string,
    centered?: boolean,
    okBtnDanger?: boolean,
}

const { Title, Text } = Typography;

export default function useStaticModal() {

    const { t } = useTranslation();
    const { modal } = App.useApp();

    const commonModalConfig = {
        centered: true,
        icon: null,
        width: '320px',
        styles: {
            content: {
                backgroundColor: theme.token.colorBgBase,
                border: `1px solid ${theme.token.colorBorder}`,
                borderRadius: '16px',
                boxShadow: '0 10px 25px -5px rgba(62, 74, 61, 0.15), 0 10px 10px -5px rgba(62, 74, 61, 0.1)',
            },
            mask: {
                backgroundColor: 'rgba(62, 74, 61, 0.4)',
                backdropFilter: 'blur(4px)',
            }
        }
    };

    const successModal = (
        title?: string,
        content?: string,
        okText?: string,
    ): void => {
        modal.success({
            ...commonModalConfig,
            content: (
                <div style={styles.container}>
                    <CheckCircleOutlined style={{ ...styles.icon, ...styles.success }} />
                    <Title
                        level={4}
                        style={styles.titleText}
                    >{title ? title : t("global.success")}</Title>
                    <Text
                        style={styles.contentText}
                    >{content}</Text>
                </div>
            ),
            okText: okText ? okText : t("global.close"),
            okButtonProps: {
                style: { ...styles.okButton, ...styles.successBtn }
            }
        });
    }

    const infoModal = (
        title?: string,
        content?: string,
        okText?: string,
    ): void => {
        modal.info({
            ...commonModalConfig,
            content: (
                <div style={styles.container}>
                    <InfoCircleOutlined style={{ ...styles.icon, ...styles.info }} />
                    <Title
                        level={4}
                        style={styles.titleText}
                    >{title ? title : t("global.information")}</Title>
                    <Text
                        style={styles.contentText}
                    >{content}</Text>
                </div>
            ),
            okText: okText ? okText : t("global.close"),
            okButtonProps: {
                style: { ...styles.okButton, ...styles.infoBtn }
            }
        });
    }

    const warningModal = (
        title?: string,
        content?: string,
        okText?: string,
    ): void => {
        modal.warning({
            ...commonModalConfig,
            content: (
                <div style={styles.container}>
                    <WarningOutlined style={{ ...styles.icon, ...styles.warning }} />
                    <Title
                        level={4}
                        style={styles.titleText}
                    >{title ? title : t("global.warning")}</Title>
                    <Text
                        style={styles.contentText}
                    >{content}</Text>
                </div>
            ),
            okText: okText ? okText : t("global.close"),
            okButtonProps: {
                style: { ...styles.okButton, ...styles.warningBtn }
            }
        });
    }

    const errorModal = (
        title?: string,
        content?: string,
        okText?: string,
    ): void => {
        modal.error({
            ...commonModalConfig,
            content: (
                <div style={styles.container}>
                    <CloseCircleOutlined style={{ ...styles.icon, ...styles.error }} />
                    <Title
                        level={4}
                        style={styles.titleText}
                    >{title ? title : t("global.error")}</Title>
                    <Text
                        style={styles.contentText}
                    >{content}</Text>
                </div>
            ),
            okText: okText ? okText : t("global.close"),
            okButtonProps: {
                style: { ...styles.okButton, ...styles.errorBtn }
            }
        });
    }

    const serverErrorModal = (): void => {
        modal.warning({
            ...commonModalConfig,
            content: (
                <div style={styles.container}>
                    <WarningOutlined style={{ ...styles.icon, ...styles.warning }} />
                    <Title
                        level={4}
                        style={styles.titleText}
                    >{t("global.wentWrong")}</Title>
                    <Text
                        style={styles.contentText}
                    >{t("global.unexpectedError")}</Text>
                </div>
            ),
            okText: t("global.goBack"),
            okButtonProps: {
                style: { ...styles.okButton, ...styles.warningBtn }
            }
        });
    }

    const confirmationModal = ({
        title,
        content,
        okBtn,
        cancelBtn,
        centered = false,
        okBtnDanger = false,
        onOk,
        onOkWithPromise,
        onCancel
    }: ConfirmationModalParams): void => {
        modal.confirm({
            ...commonModalConfig,
            centered: centered,
            title: <Title level={4} style={{ ...styles.titleText, textAlign: 'left', marginBottom: '8px' }}>{title}</Title>,
            content: <Text style={{ ...styles.contentText, textAlign: 'left', display: 'block', marginBottom: '16px' }}>{content}</Text>,
            okText: okBtn || t("global.ok"),
            cancelText: cancelBtn || t("global.cancel"),
            okButtonProps: { danger: okBtnDanger, style: { fontWeight: 600, fontFamily: theme.token.fontFamily } },
            cancelButtonProps: { style: { fontWeight: 600, fontFamily: theme.token.fontFamily } },
            onOk: onOkWithPromise
                ? () => new Promise((resolve, reject) => {
                    onOkWithPromise()
                        .then(resolve)
                        .catch(reject);
                }).catch(() => console.log('Oops errors!'))
                : onOk,
            onCancel: onCancel,
            footer: (_, { OkBtn, CancelBtn }) => (
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '24px' }}>
                    <CancelBtn />
                    <OkBtn />
                </div>
            ),
        });
    }

    return {
        successModal,
        infoModal,
        warningModal,
        errorModal,
        serverErrorModal,
        confirmationModal,
    }

}

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        marginTop: '1rem',
        fontFamily: theme.token.fontFamily,
        color: theme.token.colorTextBase,
    },
    titleText: {
        textAlign: 'center',
        marginBottom: '1rem',
        fontFamily: theme.token.fontFamily,
        color: theme.token.colorTextBase,
        fontWeight: 600,
    },
    contentText: {
        textAlign: 'center',
        fontFamily: theme.token.fontFamily,
        color: theme.token.colorTextBase,
    },
    icon: {
        fontSize: '100px',
        display: 'flex',
        alignItems: 'center',
        marginBottom: '2rem',
    },
    success: {
        color: '#41c057'
    },
    successBtn: {
        backgroundColor: theme.token.colorPrimary,
        color: '#fff',
        border: 'none',
    },
    info: {
        color: '#46b8da'
    },
    infoBtn: {
        backgroundColor: theme.token.colorPrimary,
        color: '#fff',
        border: 'none',
    },
    error: {
        color: '#CC2B12'
    },
    errorBtn: {
        backgroundColor: '#CC2B12',
        color: '#fff',
        border: 'none',
    },
    warning: {
        color: theme.token.colorPrimary
    },
    warningBtn: {
        backgroundColor: theme.token.colorPrimary,
        color: '#fff',
        border: 'none',
    },
    okButton: {
        display: 'block',
        margin: '0 auto',
        marginBottom: '1rem',
        marginTop: '2rem',
        fontWeight: 600,
        height: '40px',
        minWidth: '120px',
        fontFamily: theme.token.fontFamily,
    }
}