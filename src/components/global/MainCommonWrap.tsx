import { Outlet } from "react-router-dom";
import { Menu } from "antd";

// components
import Header from "@/components/global/Header";

// hooks
import useMainCommonWrap from "@/hooks/global/useMainCommonWrap";

const HEADER_SIZE = 68;

export default function MainCommonWrap() {

    const {
        menuItems,
        selectedSidebar,
    } = useMainCommonWrap();

    return (
        <>
            <Header height={HEADER_SIZE} />
            <div style={styles.container}>
                <div style={styles.sidebar}>
                    <Menu
                        selectedKeys={[selectedSidebar]}
                        mode="inline"
                        inlineCollapsed={false}
                        items={menuItems}
                        style={{
                            backgroundColor: '#EAE3D2',
                            border: 'none',
                        }}
                    />
                </div>
                <div style={styles.main}>
                    <Outlet />
                </div>
            </div>
        </>
    )
}

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        width: '100%',
        height: `calc(100vh - ${HEADER_SIZE}px)`,
        display: 'flex',
    },
    sidebar: {
        width: '230px',
        height: `calc(100vh - ${HEADER_SIZE}px)`,
        backgroundColor: '#EAE3D2',
        padding: '1rem 0px',
        borderRight: '1px solid #C2BAA6',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    main: {
        flex: 1,
        height: `calc(100vh - ${HEADER_SIZE}px)`,
        backgroundColor: '#EAE3D2',
        display: 'flex',
        justifyContent: 'center',
    },
}