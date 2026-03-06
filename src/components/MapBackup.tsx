import React, { useRef, useEffect, useState, useCallback } from 'react';

// interfaces
interface Transform {
    x: number;
    y: number;
    scale: number;
}

interface Point {
    x: number;
    y: number;
}

const THEME = {
    bg: '#2c2c2c',
    gridLines: '#2e1919ff',
    gridSubLines: '#333333',
    rulerBg: '#1e1e1e',
    rulerMarks: '#888',
    rulerText: '#aaa',
    accent: '#e74c3c',
    axisX: '#e74c3c',
    axisY: '#2ecc71',
};

const ZOOM_SPEED = 0.06;
const MIN_SCALE = 0.04;
const MAX_SCALE = 200;

export default function Map() {

    // Canvas Refs
    const mainCanvasRef = useRef<HTMLCanvasElement>(null);
    const topRulerRef = useRef<HTMLCanvasElement>(null);
    const leftRulerRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // State for rendering UI
    const [transform, setTransform] = useState<Transform>(() => {
        if (typeof window !== 'undefined') {
            return {
                x: window.innerWidth / 2,
                y: window.innerHeight / 2,
                scale: 0.08
            };
        }
        return { x: 0, y: 0, scale: 1 };
    });
    const [mousePos, setMousePos] = useState<Point>({ x: 0, y: 0 });
    const [worldPos, setWorldPos] = useState<Point>({ x: 0, y: 0 });
    const [cursorMode, setCursorMode] = useState<'default' | 'grab'>('default');

    // Refs for interaction state (prevents re-renders during mouse move)
    const isDragging = useRef(false);
    const lastMousePos = useRef<Point>({ x: 0, y: 0 });



    // --- Drawing Logic ---

    const drawRuler = (tCtx: CanvasRenderingContext2D, isTop: boolean, topCanvas: HTMLCanvasElement, leftCanvas: HTMLCanvasElement) => {
        const size = isTop ? topCanvas.width : leftCanvas.height;
        tCtx.fillStyle = THEME.rulerBg;
        tCtx.fillRect(0, 0, isTop ? size : 20, isTop ? 20 : size);

        tCtx.strokeStyle = '#444';
        if (isTop) {
            tCtx.moveTo(0, 19.5); tCtx.lineTo(size, 19.5);
        } else {
            tCtx.moveTo(19.5, 0); tCtx.lineTo(19.5, size);
        }
        tCtx.stroke();

        const targetScreenSize = 100;
        const idealGridSize = targetScreenSize / transform.scale;
        const magnitude = Math.pow(10, Math.floor(Math.log10(idealGridSize)));
        const normalized = idealGridSize / magnitude;
        let baseStep = magnitude;
        if (normalized > 5) baseStep = magnitude * 10;
        else if (normalized > 2) baseStep = magnitude * 5;
        else baseStep = magnitude * 2;
        if (baseStep > 1000) baseStep = 1000;

        const minorStep = baseStep / 10;
        tCtx.fillStyle = THEME.rulerText;
        tCtx.strokeStyle = THEME.rulerMarks;
        tCtx.font = '10px Arial';

        const worldStart = isTop ? -transform.x / transform.scale : -transform.y / transform.scale;
        const worldEnd = isTop ? (topCanvas.width - transform.x) / transform.scale : (leftCanvas.height - transform.y) / transform.scale;

        const rulerStart = Math.max(-10000, worldStart);
        const rulerEnd = Math.min(10000, worldEnd);

        tCtx.beginPath();
        for (let v = Math.floor(rulerStart / minorStep) * minorStep; v <= rulerEnd; v += minorStep) {
            if (v < -10000 || v > 10000) continue;
            const screenPos = v * transform.scale + (isTop ? transform.x : transform.y);
            // Handle floating point imprecision when checking modulo
            const stepRatio = Math.abs(v / baseStep);
            const isMajor = Math.abs(Math.round(stepRatio) - stepRatio) < 0.01;

            if (isMajor) {
                if (isTop) {
                    tCtx.moveTo(screenPos, 0); tCtx.lineTo(screenPos, 20);
                    tCtx.fillText(Math.round(v).toString(), screenPos + 2, 10);
                } else {
                    tCtx.moveTo(0, screenPos); tCtx.lineTo(20, screenPos);
                    tCtx.save();
                    tCtx.translate(10, screenPos); tCtx.rotate(-Math.PI / 2);
                    tCtx.fillText(Math.round(v).toString(), 2, 0);
                    tCtx.restore();
                }
            } else {
                if (minorStep * transform.scale > 5) {
                    if (isTop) {
                        tCtx.moveTo(screenPos, 12); tCtx.lineTo(screenPos, 20);
                    } else {
                        tCtx.moveTo(12, screenPos); tCtx.lineTo(20, screenPos);
                    }
                }
            }
        }
        tCtx.stroke();

        // Mouse Indicator
        tCtx.strokeStyle = THEME.accent;
        tCtx.beginPath();
        if (isTop) {
            tCtx.moveTo(mousePos.x, 0);
            tCtx.lineTo(mousePos.x, 20);
        } else {
            tCtx.moveTo(0, mousePos.y);
            tCtx.lineTo(20, mousePos.y);
        }
        tCtx.stroke();
    };

    const draw = useCallback(() => {
        const canvas = mainCanvasRef.current;
        const topCanvas = topRulerRef.current;
        const leftCanvas = leftRulerRef.current;

        if (!canvas || !topCanvas || !leftCanvas) return;

        const ctx = canvas.getContext('2d');
        const topCtx = topCanvas.getContext('2d');
        const leftCtx = leftCanvas.getContext('2d');
        if (!ctx || !topCtx || !leftCtx) return;

        // 1. Clear and Draw Main Canvas
        ctx.fillStyle = THEME.bg;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.save();
        ctx.translate(transform.x, transform.y);
        ctx.scale(transform.scale, transform.scale);

        // Draw Main Area Border (10000x10000 bounds)
        ctx.lineWidth = 2 / transform.scale;
        ctx.strokeStyle = '#444';
        ctx.strokeRect(-10000, -10000, 20000, 20000);

        // Draw Grid within bounds
        const startX = Math.max(-10000, -transform.x / transform.scale);
        const startY = Math.max(-10000, -transform.y / transform.scale);
        const endX = Math.min(10000, (canvas.width - transform.x) / transform.scale);
        const endY = Math.min(10000, (canvas.height - transform.y) / transform.scale);

        if (startX <= endX && startY <= endY) {
            const targetScreenSize = 100;
            const idealGridSize = targetScreenSize / transform.scale;
            const magnitude = Math.pow(10, Math.floor(Math.log10(idealGridSize)));
            const normalized = idealGridSize / magnitude;
            let gridSize = magnitude;
            if (normalized > 5) gridSize = magnitude * 10;
            else if (normalized > 2) gridSize = magnitude * 5;
            else gridSize = magnitude * 2;
            if (gridSize > 1000) gridSize = 1000;
            const subGridSize = gridSize / 10;

            ctx.lineWidth = 1 / transform.scale;

            // Sub-grid (hide if lines are too close)
            if (subGridSize * transform.scale > 5) {
                ctx.strokeStyle = THEME.gridSubLines;
                ctx.beginPath();
                for (let x = Math.floor(startX / subGridSize) * subGridSize; x <= endX; x += subGridSize) {
                    if (x >= -10000 && x <= 10000) {
                        ctx.moveTo(x, startY); ctx.lineTo(x, endY);
                    }
                }
                for (let y = Math.floor(startY / subGridSize) * subGridSize; y <= endY; y += subGridSize) {
                    if (y >= -10000 && y <= 10000) {
                        ctx.moveTo(startX, y); ctx.lineTo(endX, y);
                    }
                }
                ctx.stroke();
            }

            // Main grid
            ctx.strokeStyle = THEME.gridLines;
            ctx.beginPath();
            for (let x = Math.floor(startX / gridSize) * gridSize; x <= endX; x += gridSize) {
                if (x >= -10000 && x <= 10000) {
                    ctx.moveTo(x, startY); ctx.lineTo(x, endY);
                }
            }
            for (let y = Math.floor(startY / gridSize) * gridSize; y <= endY; y += gridSize) {
                if (y >= -10000 && y <= 10000) {
                    ctx.moveTo(startX, y); ctx.lineTo(endX, y);
                }
            }
            ctx.stroke();

            // Axes
            ctx.lineWidth = 2 / transform.scale;
            ctx.strokeStyle = THEME.axisX;
            ctx.beginPath();
            if (startY <= 0 && endY >= 0) {
                ctx.moveTo(Math.max(-10000, startX), 0); ctx.lineTo(Math.min(10000, endX), 0);
            }
            ctx.stroke();

            ctx.strokeStyle = THEME.axisY;
            ctx.beginPath();
            if (startX <= 0 && endX >= 0) {
                ctx.moveTo(0, Math.max(-10000, startY)); ctx.lineTo(0, Math.min(10000, endY));
            }
            ctx.stroke();
        }

        ctx.restore();

        // 2. Draw Rulers
        drawRuler(topCtx, true, topCanvas, leftCanvas);
        drawRuler(leftCtx, false, topCanvas, leftCanvas);
    }, [transform, mousePos]);



    // --- Utility Functions ---

    const updateResizing = useCallback(() => {
        const canvas = mainCanvasRef.current;
        const top = topRulerRef.current;
        const left = leftRulerRef.current;
        if (!canvas || !top || !left) return;

        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();

        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        top.width = rect.width * dpr;
        top.height = 20 * dpr;
        left.width = 20 * dpr;
        left.height = rect.height * dpr;

        const contexts = [canvas.getContext('2d'), top.getContext('2d'), left.getContext('2d')];
        contexts.forEach(c => c?.scale(dpr, dpr));

        draw();
    }, [draw]);

    const applyZoom = (zoomFactor: number, pointerX: number, pointerY: number) => {
        setTransform(prev => {
            let newScale = prev.scale * zoomFactor;
            newScale = Math.min(Math.max(newScale, MIN_SCALE), MAX_SCALE);

            const worldX = (pointerX - prev.x) / prev.scale;
            const worldY = (pointerY - prev.y) / prev.scale;

            return {
                scale: newScale,
                x: pointerX - worldX * newScale,
                y: pointerY - worldY * newScale
            };
        });
    };

    // --- Event Handlers ---

    const handlePointerMove = (e: React.MouseEvent | MouseEvent) => {
        const rect = mainCanvasRef.current?.getBoundingClientRect();
        if (!rect) return;

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        setMousePos({ x, y });
        setWorldPos({
            x: Math.round((x - transform.x) / transform.scale),
            y: Math.round((y - transform.y) / transform.scale)
        });

        if (isDragging.current) {
            const dx = x - lastMousePos.current.x;
            const dy = y - lastMousePos.current.y;
            setTransform(prev => ({ ...prev, x: prev.x + dx, y: prev.y + dy }));
        }
        lastMousePos.current = { x, y };
    };

    const handleWheel = (e: WheelEvent) => {
        e.preventDefault();
        const rect = mainCanvasRef.current?.getBoundingClientRect();
        if (!rect) return;

        const zoomAmount = e.deltaY > 0 ? (1 - ZOOM_SPEED) : (1 + ZOOM_SPEED);
        applyZoom(zoomAmount, e.clientX - rect.left, e.clientY - rect.top);
    };

    useEffect(() => {
        window.addEventListener('resize', updateResizing);
        // Use non-passive listener for zoom
        const canvas = mainCanvasRef.current;
        canvas?.addEventListener('wheel', handleWheel, { passive: false });

        updateResizing();
        return () => {
            window.removeEventListener('resize', updateResizing);
            canvas?.removeEventListener('wheel', handleWheel);
        };
    }, [updateResizing]);

    useEffect(() => {
        draw();
    }, [draw]);


    return (
        <div ref={containerRef} style={styles.container}>
            <div style={styles.cornerBlock} />
            <canvas ref={topRulerRef} style={styles.topRuler} />
            <canvas ref={leftRulerRef} style={styles.leftRuler} />

            <canvas
                ref={mainCanvasRef}
                style={{ ...styles.mainCanvas, cursor: isDragging.current ? 'grabbing' : (cursorMode === 'grab' ? 'grab' : 'default') }}
                onMouseDown={(e) => {
                    if (cursorMode === 'grab' || e.button === 1) {
                        isDragging.current = true;
                        lastMousePos.current = { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY };
                        // Force a re-render so the cursor instantly changes to grabbing
                        setMousePos(prev => ({ ...prev }));
                    }
                }}
                onMouseMove={handlePointerMove}
                onMouseUp={() => { isDragging.current = false; setMousePos(prev => ({ ...prev })); }}
                onMouseLeave={() => { isDragging.current = false; setMousePos(prev => ({ ...prev })); }}
            />

            <div style={styles.infoPanel}>
                X: {worldPos.x}, Y: {worldPos.y}
            </div>

            <div style={styles.controls}>
                <button
                    style={{ ...styles.btn, backgroundColor: cursorMode === 'default' ? '#666' : '#444' }}
                    onClick={() => setCursorMode('default')}
                >
                    Pointer
                </button>
                <button
                    style={{ ...styles.btn, backgroundColor: cursorMode === 'grab' ? '#666' : '#444' }}
                    onClick={() => setCursorMode('grab')}
                >
                    Grab
                </button>
                <div style={{ width: '1px', height: '24px', backgroundColor: '#555', margin: '0 5px' }} />
                <button style={styles.btn} onClick={() => applyZoom(1 - ZOOM_SPEED, (mainCanvasRef.current?.width || 0) / 4, (mainCanvasRef.current?.height || 0) / 4)}>-</button>
                <span style={{ minWidth: '50px', textAlign: 'center' }}>{Math.round(transform.scale * 100)}%</span>
                <button style={styles.btn} onClick={() => applyZoom(1 + ZOOM_SPEED, (mainCanvasRef.current?.width || 0) / 4, (mainCanvasRef.current?.height || 0) / 4)}>+</button>
                <button style={styles.btn} onClick={() => setTransform({ x: window.innerWidth / 2, y: window.innerHeight / 2, scale: 0.08 })}>Reset</button>
            </div>
        </div>
    )
}


const styles: Record<string, React.CSSProperties> = {
    container: {
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        backgroundColor: THEME.bg,
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
        backgroundColor: THEME.rulerBg,
        zIndex: 3,
        borderRight: '1px solid #444',
        borderBottom: '1px solid #444',
    },
    infoPanel: {
        position: 'absolute',
        top: '30px',
        right: '20px',
        backgroundColor: 'rgba(0,0,0,0.6)',
        padding: '8px 12px',
        borderRadius: '4px',
        fontSize: '12px',
        zIndex: 10,
        pointerEvents: 'none',
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
    }
};