
// hooks
import useMap from "@/hooks/map/useMap";



export default function Map() {

    const {
        mainCanvasRef,
        topRulerRef,
        leftRulerRef,
        containerRef,
        viewport,
        handleMouseMove,
        handleMouseDown,
        handleMouseUp,
        currentCursor,
        ZOOM_SPEED,
        hasDirty,
        isSaving,
        saveChanges,
    } = useMap();

    return (
        <div ref={containerRef} style={styles.container}>
            <div style={styles.cornerBlock} />
            <canvas ref={topRulerRef} style={styles.topRuler} />
            <canvas ref={leftRulerRef} style={styles.leftRuler} />

            <canvas
                ref={mainCanvasRef}
                style={{ ...styles.mainCanvas, cursor: currentCursor }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
            />

            <div style={styles.controls}>
                <button
                    style={{ ...styles.btn, backgroundColor: viewport.cursorMode === 'default' ? '#666' : '#444' }}
                    onClick={() => viewport.handleChangeCursorMode('default')}
                >
                    Pointer
                </button>
                {hasDirty && (
                    <button
                        style={{
                            ...styles.btn,
                            ...styles.saveBtn,
                            opacity: isSaving ? 0.6 : 1,
                            cursor: isSaving ? 'not-allowed' : 'pointer',
                        }}
                        onClick={saveChanges}
                        disabled={isSaving}
                    >
                        {isSaving ? 'Saving…' : '💾 Save'}
                    </button>
                )}
                <button
                    style={{ ...styles.btn, backgroundColor: viewport.cursorMode === 'grab' ? '#666' : '#444' }}
                    onClick={() => viewport.handleChangeCursorMode('grab')}
                >
                    Grab
                </button>
                <button
                    style={{ ...styles.btn, backgroundColor: viewport.cursorMode === 'draw_rect' ? '#666' : '#444' }}
                    onClick={() => viewport.handleChangeCursorMode('draw_rect')}
                >
                    Draw Rect
                </button>
                <button
                    style={{ ...styles.btn, backgroundColor: viewport.cursorMode === 'draw_free' ? '#666' : '#444' }}
                    onClick={() => viewport.handleChangeCursorMode('draw_free')}
                >
                    Draw Free
                </button>
                <div style={{ width: '1px', height: '24px', backgroundColor: '#555', margin: '0 5px' }} />
                <button style={styles.btn} onClick={() => viewport.applyZoom(1 - ZOOM_SPEED, (mainCanvasRef.current?.width || 0) / 4, (mainCanvasRef.current?.height || 0) / 4)}>-</button>
                <span style={{ minWidth: '50px', textAlign: 'center' }}>{Math.round(viewport.transform.scale * 100)}%</span>
                <button style={styles.btn} onClick={() => viewport.applyZoom(1 + ZOOM_SPEED, (mainCanvasRef.current?.width || 0) / 4, (mainCanvasRef.current?.height || 0) / 4)}>+</button>
                <button style={styles.btn} onClick={() => viewport.setTransform({ x: window.innerWidth / 2, y: window.innerHeight / 2, scale: 0.08 })}>Reset</button>
            </div>
        </div>
    );
}


const styles: Record<string, React.CSSProperties> = {
    container: {
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        backgroundColor: '#2c2c2c',
        color: '#fff',
        fontFamily: 'sans-serif',
        // flex: '1',
    },
    mainCanvas: {
        position: 'absolute',
        top: '20px',
        left: '20px',
        width: 'calc(100% - 20px)',
        height: 'calc(100% - 20px)',
        zIndex: 1,
    },
    topRuler: {
        position: 'absolute',
        top: 0,
        left: '20px',
        width: 'calc(100% - 20px)',
        height: '20px',
        zIndex: 2,
    },
    leftRuler: {
        position: 'absolute',
        top: '20px',
        left: 0,
        width: '20px',
        height: 'calc(100% - 20px)',
        zIndex: 2,
    },
    cornerBlock: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '20px',
        height: '20px',
        backgroundColor: '#1e1e1e',
        zIndex: 3,
        borderRight: '1px solid #444',
        borderBottom: '1px solid #444',
    },
    controls: {
        position: 'absolute',
        bottom: '20px',
        right: '20px',
        backgroundColor: '#333',
        padding: '10px',
        borderRadius: '8px',
        display: 'flex',
        gap: '10px',
        alignItems: 'center',
        zIndex: 10,
        boxShadow: '0 4px 10px rgba(0,0,0,0.5)'
    },
    btn: {
        padding: '6px 12px',
        backgroundColor: '#444',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer'
    },
    saveBtn: {
        backgroundColor: '#27ae60',
        boxShadow: '0 0 8px rgba(39, 174, 96, 0.7)',
        fontWeight: 'bold',
        animation: 'pulse 1.5s infinite',
    }
};