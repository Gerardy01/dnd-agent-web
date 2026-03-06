import { useCallback, useRef, useState } from "react";

// interfaces
import type { Transform, Point } from "@/models/mapInterfaces";

const MIN_SCALE = 0.03;
const MAX_SCALE = 200;


export default function useMapViewport() {

    const [transform, setTransform] = useState<Transform>({ x: 0, y: 0, scale: 1 });
    const [mousePos, setMousePos] = useState<Point>({ x: 0, y: 0 });
    const [worldPos, setWorldPos] = useState<Point>({ x: 0, y: 0 });
    const [cursorMode, setCursorMode] = useState<'default' | 'grab' | 'draw_rect' | 'draw_free'>('default');

    const isDragging = useRef(false);
    const lastMousePos = useRef<Point>({ x: 0, y: 0 });

    const initViewport = useCallback(() => {
        setTransform({
            x: window.innerWidth / 2,
            y: window.innerHeight / 2,
            scale: 0.08
        });
    }, []);

    const applyZoom = useCallback((zoomFactor: number, pointerX: number, pointerY: number) => {
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
    }, []);

    const onPointerMove = useCallback((x: number, y: number) => {
        setMousePos({ x, y });
        setWorldPos(() => ({
            x: Math.round((x - transform.x) / transform.scale),
            y: Math.round((y - transform.y) / transform.scale)
        }));

        if (isDragging.current) {
            const dx = x - lastMousePos.current.x;
            const dy = y - lastMousePos.current.y;
            setTransform(prev => ({ ...prev, x: prev.x + dx, y: prev.y + dy }));
        }
        lastMousePos.current = { x, y };
    }, [transform]);

    const onPointerDown = useCallback((x: number, y: number, isMiddleClick: boolean) => {
        if (cursorMode === 'grab' || isMiddleClick) {
            isDragging.current = true;
            lastMousePos.current = { x, y };
            // Force re-render for cursor change
            setMousePos(prev => ({ ...prev }));
        }
    }, [cursorMode]);

    const onPointerUp = useCallback(() => {
        isDragging.current = false;
        setMousePos(prev => ({ ...prev }));
    }, []);

    const handleChangeCursorMode = (mode: 'default' | 'grab' | 'draw_rect' | 'draw_free') => {
        setCursorMode(mode);
    };

    return {
        transform,
        setTransform,
        mousePos,
        worldPos,
        cursorMode,
        handleChangeCursorMode,
        isDragging: isDragging.current,
        initViewport,
        applyZoom,
        onPointerMove,
        onPointerDown,
        onPointerUp
    };

}