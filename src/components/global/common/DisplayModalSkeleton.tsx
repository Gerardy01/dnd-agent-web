import React from "react";
import { Skeleton } from "antd";

export default function DisplayModalSkeleton() {
    return (
        <div style={{ display: 'flex', height: '100%' }}>
            <div style={styles.leftSideContent}>
                <Skeleton.Image active style={{ width: '20rem', height: '20rem', borderRadius: '8px', marginTop: '4rem' }} />
                <div style={{ marginTop: '2rem' }}>
                    <Skeleton active paragraph={{ rows: 6 }} title={false} />
                </div>
            </div>

            <div style={styles.rightSideContent}>
                <Skeleton.Input active size="large" style={{ width: '60%', height: 40, marginBottom: '2rem' }} />

                <Skeleton active paragraph={{ rows: 5 }} />

                <div style={{ marginTop: '3rem' }}>
                    <Skeleton active paragraph={{ rows: 4 }} />
                </div>
            </div>
        </div>
    );
}

const styles: { [key: string]: React.CSSProperties } = {
    leftSideContent: {
        width: '35%',
        minWidth: '24rem',
        overflowY: 'hidden',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    rightSideContent: {
        flex: 1,
        overflowY: 'hidden',
        padding: '2rem',
        backgroundColor: '#FEFDFA',
        borderLeft: '1px solid #C2BAA6',
        display: 'flex',
        flexDirection: 'column',
    }
}
