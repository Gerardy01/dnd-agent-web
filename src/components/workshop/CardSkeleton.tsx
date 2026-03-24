import { Skeleton } from "antd";

export default function CardSkeleton() {
    return (
        <div style={styles.container}>
            <div style={styles.imagePlaceholder}>
                <Skeleton.Image active style={{ width: '100%', height: '100%' }} className="skeleton-image-full" />
            </div>

            <div style={styles.content}>
                <Skeleton active paragraph={{ rows: 2 }} title={{ width: '70%' }} />
                <div style={styles.footer}>
                    <Skeleton.Button active size="small" shape="round" style={{ width: '80px' }} />
                    <Skeleton.Button active size="small" shape="round" style={{ width: '60px' }} />
                </div>
            </div>
        </div>
    );
}

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        width: '100%',
        maxWidth: '320px',
        backgroundColor: '#E8E2D1',
        borderRadius: '8px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid #C2BAA6'
    },
    imagePlaceholder: {
        height: '260px',
        width: '100%',
        backgroundColor: '#DDD6C7',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
    },
    footer: {
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '16px',
        alignItems: 'center'
    }
};