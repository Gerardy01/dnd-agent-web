import { Dropdown, Typography } from "antd";

// hooks
import useHeader from "@/hooks/global/useHeader";

// interfaces
interface Props {
    height?: number;
}

const { Title, Text } = Typography;

export default function Header({ height = 64 }: Props) {

    const {
        items,
        username
    } = useHeader();

    return (
        <div style={{ ...styles.header, height: `${height}px` }}>
            <Title style={{ marginBottom: '0px' }}>LOGO</Title>
            <Dropdown menu={{ items }} placement="bottomRight" trigger={['click']}>
                <div style={styles.profileBtn} className="profile-btn">
                    <div style={styles.imgHolder}>
                        {username ? username.charAt(0).toUpperCase() : "-"}
                    </div>
                    <Text style={{ marginLeft: '0.7rem', fontWeight: 'bold' }}>{username ? username : "-"}</Text>
                </div>
            </Dropdown>
        </div>
    )
}

const styles: { [key: string]: React.CSSProperties } = {
    header: {
        width: '100%',
        height: '68px',
        padding: '0.5rem 1.5rem',
        backgroundColor: '#f6f1e7',
        boxShadow: '0 0px 15px 5px #C2BAA6',
        position: 'relative',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    profileBtn: {
        minWidth: '8.5rem',
        borderRadius: '5px',
        backgroundColor: '#ededee',
        border: '2px solid #d8d2cc',
        display: 'flex',
        alignItems: 'center',
        padding: '0.3rem 0.7rem',
        cursor: 'pointer',
    },
    imgHolder: {
        width: '2.3rem',
        aspectRatio: '1/1',
        borderRadius: '50%',
        backgroundColor: '#ededee',
        border: '2px solid #677772ff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    }
}