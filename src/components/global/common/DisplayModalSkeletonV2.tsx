import React from "react";
import { Skeleton } from "antd";

export default function DisplayModalSkeletonV2() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            {/* Header Image Skeleton */}
            <div style={styles.imageHeaderContainer}>
                <Skeleton.Image active />
            </div>

            {/* Tabs Skeleton */}
            <div style={styles.tabsContainer}>
                {[1, 2, 3].map((item) => (
                    <Skeleton.Input key={item} active style={styles.tabSkeleton} size="small" />
                ))}
            </div>

            {/* Content Skeleton */}
            <div style={styles.contentContainer}>
                <Skeleton.Input active style={styles.sectionHeaderSkeleton} size="default" />
                <div style={{ marginTop: '1rem' }}>
                    <Skeleton active paragraph={{ rows: 4 }} title={false} />
                </div>

                <Skeleton.Input active style={{ ...styles.sectionHeaderSkeleton, marginTop: '2rem' }} size="default" />
            </div>
        </div>
    );
}

const styles: { [key: string]: React.CSSProperties } = {
    imageHeaderContainer: {
        width: '100%',
        height: '320px',
        flexShrink: 0,
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    tabsContainer: {
        display: 'flex',
        gap: '2rem',
        padding: '1rem 2rem',
        borderBottom: '1px solid #d3c9b3',
        flexShrink: 0,
        alignItems: 'center',
    },
    tabSkeleton: {
        width: '80px',
    },
    contentContainer: {
        padding: '1.5rem 2rem 2rem 2rem',
        display: 'flex',
        flexDirection: 'column',
    },
    sectionHeaderSkeleton: {
        width: '200px',
        marginBottom: '0.5rem',
    },
    propertyBoxSkeleton: {
        marginTop: '1.5rem',
        width: '200px',
        border: '1px solid #d3c9b3',
        borderRadius: '4px',
        padding: '1rem',
        backgroundColor: '#fcfbf9',
        display: 'flex',
        flexDirection: 'column',
    },
};
