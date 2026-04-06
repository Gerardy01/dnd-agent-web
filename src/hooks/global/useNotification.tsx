import { App, Typography } from "antd";
import { useTranslation } from 'react-i18next';
import { CheckCircleOutlined, CloseCircleOutlined, InfoCircleOutlined, WarningOutlined } from "@ant-design/icons";
import { theme } from "@/constants/theme";

const { Text } = Typography;

export default function useNotification() {
    const { t } = useTranslation();
    const { notification } = App.useApp();

    const commonNotificationConfig = {
        style: {
            backgroundColor: theme.token.colorBgBase,
            border: `1px solid ${theme.token.colorBorder}`,
            borderRadius: `${theme.token.borderRadius}px`,
            boxShadow: '0 4px 12px rgba(62, 74, 61, 0.15)', // Slightly softer shadow than the modal
        },
        placement: 'top' as const, // You can adjust default placement here
    };

    const successNotification = (title?: string, content?: string): void => {
        notification.success({
            ...commonNotificationConfig,
            title: (
                <Text style={styles.titleText}>
                    {title ? title : t("global.success")}
                </Text>
            ),
            description: content ? <Text style={styles.contentText}>{content}</Text> : null,
            icon: <CheckCircleOutlined style={{ ...styles.icon, ...styles.success }} />,
        });
    }

    const infoNotification = (title?: string, content?: string): void => {
        notification.info({
            ...commonNotificationConfig,
            title: (
                <Text style={styles.titleText}>
                    {title ? title : t("global.information")}
                </Text>
            ),
            description: content ? <Text style={styles.contentText}>{content}</Text> : null,
            icon: <InfoCircleOutlined style={{ ...styles.icon, ...styles.info }} />,
        });
    }

    const warningNotification = (title?: string, content?: string): void => {
        notification.warning({
            ...commonNotificationConfig,
            title: (
                <Text style={styles.titleText}>
                    {title ? title : t("global.warning")}
                </Text>
            ),
            description: content ? <Text style={styles.contentText}>{content}</Text> : null,
            icon: <WarningOutlined style={{ ...styles.icon, ...styles.warning }} />,
        });
    }

    const errorNotification = (title?: string, content?: string): void => {
        notification.error({
            ...commonNotificationConfig,
            title: (
                <Text style={styles.titleText}>
                    {title ? title : t("global.error")}
                </Text>
            ),
            description: content ? <Text style={styles.contentText}>{content}</Text> : null,
            icon: <CloseCircleOutlined style={{ ...styles.icon, ...styles.error }} />,
        });
    }

    return {
        successNotification,
        infoNotification,
        warningNotification,
        errorNotification,
    }
}

const styles: { [key: string]: React.CSSProperties } = {
    titleText: {
        fontFamily: theme.token.fontFamily,
        color: theme.token.colorTextBase,
        fontWeight: 600,
        fontSize: '16px',
    },
    contentText: {
        fontFamily: theme.token.fontFamily,
        color: theme.token.colorTextBase,
    },
    icon: {
        fontSize: '24px', // Smaller than modal icon (100px), standard for notifications
        marginTop: '2px', // Slight optical alignment
    },
    success: {
        color: '#41c057'
    },
    info: {
        color: '#46b8da'
    },
    warning: {
        color: theme.token.colorPrimary // Uses your Autumn Rust
    },
    error: {
        color: '#CC2B12'
    }
}