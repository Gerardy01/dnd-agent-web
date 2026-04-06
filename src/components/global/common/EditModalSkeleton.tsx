import React from "react";
import { Skeleton } from "antd";

export default function EditModalSkeleton() {
    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <div>
                    <Skeleton.Input active size="large" style={{ width: 300, height: 40, marginBottom: '0.5rem' }} />
                    <br />
                    <Skeleton.Input active size="small" style={{ width: 400, height: 20 }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Skeleton.Button active style={{ width: 150, height: 40, borderRadius: '8px' }} />
                    <Skeleton.Button active style={{ width: 120, height: 40, borderRadius: '8px' }} />
                </div>
            </div>
            <div style={styles.content}>
                <div style={styles.imageFormContainer}>
                    <Skeleton.Image active style={{ width: '20rem', height: '20rem', borderRadius: '1rem' }} />
                </div>
                <div style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={styles.formContainer}>
                        <div style={styles.formHeader}>
                            <Skeleton.Input active size="default" style={{ width: 200, height: 24, marginBottom: '0.5rem' }} />
                            <br />
                            <Skeleton.Input active size="small" style={{ width: 300, height: 16 }} />
                        </div>
                        <div style={styles.formContent}>
                            <Skeleton active paragraph={{ rows: 8 }} />
                        </div>
                    </div>
                    <div style={styles.formContainer}>
                        <div style={styles.formHeader}>
                            <Skeleton.Input active size="default" style={{ width: 200, height: 24, marginBottom: '0.5rem' }} />
                            <br />
                            <Skeleton.Input active size="small" style={{ width: 300, height: 16 }} />
                        </div>
                        <div style={styles.formContent}>
                            <Skeleton active paragraph={{ rows: 3 }} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        padding: '0px',
        backgroundColor: '#f5f2ea',
        overflow: 'hidden'
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1.5rem 2rem',
        borderBottom: '1px solid #C2BAA6'
    },
    titleDivier: {
        height: '40px',
        borderColor: '#C2BAA6'
    },
    content: {
        display: 'flex',
        padding: '2rem',
        gap: '2rem'
    },
    imageFormContainer: {
        width: '35%',
        minWidth: '20rem',
        height: '20rem',
    },
    formContainer: {
        backgroundColor: '#fbf9f6',
        borderRadius: '1rem',
        border: '1px solid #e0dcd3'
    },
    formHeader: {
        padding: '1rem 1.5rem',
        borderBottom: '1px solid #e0dcd3',
    },
    formContent: {
        padding: '1.5rem',
    },
}