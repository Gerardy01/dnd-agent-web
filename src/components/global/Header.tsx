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
                    <Text style={{ marginLeft: '0.5rem', fontWeight: 'bold' }}>{username ? username : "-"}</Text>
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
        backgroundColor: '#F5F1E7',
        boxShadow: '0 0px 20px 5px #C2BAA6',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    profileBtn: {
        minWidth: '7rem',
        borderRadius: '5px',
        backgroundColor: '#ddd6c6ff',
        display: 'flex',
        alignItems: 'center',
        padding: '0.3rem 0.7rem',
        cursor: 'pointer',
    },
    imgHolder: {
        width: '2.3rem',
        aspectRatio: '1/1',
        borderRadius: '50%',
        backgroundColor: '#F5F1E7',
        border: '1px solid #C2BAA6',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    }
}