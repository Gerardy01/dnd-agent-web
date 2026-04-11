import { Divider, Typography } from "antd";

const { Text } = Typography;


export default function DisplaySectionHeader({ icon, title }: { icon: React.ReactNode, title: string }) {
    return (
        <div style={{ marginTop: '2rem' }}>
            <div style={styles.headerContent}>
                <span style={{ fontSize: '1.2rem', display: 'flex' }}>{icon}</span>
                <Text strong style={styles.headerTitle}>{title}</Text>
            </div>
            <Divider style={{ margin: 0, borderColor: '#d3c9b3' }} />
        </div>
    );
}

const styles: { [key: string]: React.CSSProperties } = {
    headerContent: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.6rem',
        color: '#8c8069',
        marginBottom: '0.5rem'
    },
    headerTitle: {
        fontSize: '0.9rem',
        letterSpacing: '1.5px',
        color: '#8c8069',
        fontFamily: 'Georgia, serif'
    },
}