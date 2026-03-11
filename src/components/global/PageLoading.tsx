import { Spin } from "antd"



export default function PageLoading() {
    return (
        <div style={styles.page}>
            <div style={styles.container}>
                <Spin size="large" />
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
}