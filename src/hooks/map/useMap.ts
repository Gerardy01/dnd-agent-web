import { useEffect, useRef, useState } from "react";

// custom map hooks
import useMapRenderer from "@/hooks/map/useMapRenderer";
import useMapViewport from "@/hooks/map/useMapViewport";
import useMapDraw from "@/hooks/map/useMapDraw";
import useMapTransform from "@/hooks/map/useMapTransform";

// api
import { mapApi } from "@/api";

// interfaces
import type { Area, AreaShape } from "@/models/mapInterfaces";

const ZOOM_SPEED = 0.06;

export default function useMap() {

    const mainCanvasRef = useRef<HTMLCanvasElement>(null);
    const topRulerRef = useRef<HTMLCanvasElement>(null);
    const leftRulerRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const viewport = useMapViewport();

    const [areas, setAreas] = useState<Area[]>([]);
    const [areaShapes, setAreaShapes] = useState<AreaShape[]>([]);

    const justCreatedIdRef = useRef<string | null>(null);

    const [dirtyShapeIds, setDirtyShapeIds] = useState<Set<string>>(new Set());
    const [isSaving, setIsSaving] = useState(false);

    const mapTransform = useMapTransform({ viewport, areaShapes, setAreaShapes, setDirtyShapeIds });

    const createArea = async (shape: AreaShape) => {
        const [error, area] = await mapApi.createArea(shape);
        if (error) {
            console.error(error);
            return;
        }
        justCreatedIdRef.current = area.areaId;
        setAreas(prev => [...prev, area]);
        mapTransform.setSelection(area.areaId);
    };

    const mapDraw = useMapDraw({ viewport, createArea });

    useMapRenderer({
        mainCanvasRef,
        topRulerRef,
        leftRulerRef,
        transform: viewport.transform,
        mousePos: viewport.mousePos,
        areas: areaShapes,
        drawArea: mapDraw.drawArea,
        selectedShapeId: mapTransform.selectedShapeId
    });

    useEffect(() => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        setAreaShapes(prev => areas.map(area => {
            if (dirtyShapeIds.has(area.areaId)) {
                return prev.find(s => s.areaId === area.areaId)
                    ?? { ...area.shape, areaId: area.areaId, areaName: area.name };
            }
            return { ...area.shape, areaId: area.areaId, areaName: area.name };
        }));
    }, [areas, dirtyShapeIds]);

    useEffect(() => {
        const preservedId = justCreatedIdRef.current;
        justCreatedIdRef.current = null;

        mapDraw.cancelDraw();
        mapTransform.clearSelection();

        if (preservedId) {
            mapTransform.setSelection(preservedId);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [viewport.cursorMode]);

    useEffect(() => {
        viewport.initViewport();
    }, [viewport.initViewport]);

    useEffect(() => {
        const canvas = mainCanvasRef.current;
        const handleWheel = (e: WheelEvent) => {
            e.preventDefault();
            const rect = canvas?.getBoundingClientRect();
            if (!rect) return;
            const zoomAmount = e.deltaY > 0 ? (1 - ZOOM_SPEED) : (1 + ZOOM_SPEED);
            viewport.applyZoom(zoomAmount, e.clientX - rect.left, e.clientY - rect.top);
        };

        canvas?.addEventListener('wheel', handleWheel, { passive: false });
        return () => canvas?.removeEventListener('wheel', handleWheel);
    }, [viewport.applyZoom]);

    const handleMouseMove = (e: React.MouseEvent) => {
        const rect = mainCanvasRef.current?.getBoundingClientRect();
        if (rect) {
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            viewport.onPointerMove(x, y);

            const clampWorld = (val: number) => Math.max(-10000, Math.min(10000, val));
            const worldX = clampWorld((x - viewport.transform.x) / viewport.transform.scale);
            const worldY = clampWorld((y - viewport.transform.y) / viewport.transform.scale);

            if (viewport.cursorMode.startsWith('draw_')) {
                mapDraw.onDrawMove(worldX, worldY, e.buttons);
            } else if (viewport.cursorMode === 'default') {
                mapTransform.onTransformMove(worldX, worldY, e.buttons);
            }
        }
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        const isMiddleClick = e.button === 1;
        viewport.onPointerDown(e.nativeEvent.offsetX, e.nativeEvent.offsetY, isMiddleClick);

        if (isMiddleClick || e.button !== 0) return;

        const rect = mainCanvasRef.current?.getBoundingClientRect();
        if (rect) {
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const clampWorld = (val: number) => Math.max(-10000, Math.min(10000, val));
            const worldX = clampWorld((x - viewport.transform.x) / viewport.transform.scale);
            const worldY = clampWorld((y - viewport.transform.y) / viewport.transform.scale);

            if (viewport.cursorMode.startsWith('draw_')) {
                mapDraw.onDrawDown(worldX, worldY);
            } else if (viewport.cursorMode === 'default') {
                mapTransform.onTransformDown(worldX, worldY);
            }
        }
    };

    const handleMouseUp = () => {
        viewport.onPointerUp();
        if (viewport.cursorMode.startsWith('draw_')) {
            mapDraw.onDrawUp();
        } else if (viewport.cursorMode === 'default') {
            mapTransform.onTransformUp();
        }
    };

    const currentCursor = viewport.isDragging ? 'grabbing' : (viewport.cursorMode === 'grab' ? 'grab' : (viewport.cursorMode === 'draw_rect' || viewport.cursorMode === 'draw_free') ? 'crosshair' : 'default');

    const saveChanges = async () => {
        if (isSaving || dirtyShapeIds.size === 0) return;
        setIsSaving(true);

        const payload: Area[] = Array.from(dirtyShapeIds).reduce<Area[]>((acc, areaId) => {
            const shape = areaShapes.find(s => s.areaId === areaId);
            const meta = areas.find(a => a.areaId === areaId);
            if (shape && meta) {
                acc.push({ ...meta, shape });
            }
            return acc;
        }, []);

        if (payload.length === 0) {
            setIsSaving(false);
            return;
        }

        try {
            const [error, saved] = await mapApi.bulkUpdateArea(payload);
            if (error) {
                console.error('Failed to save areas:', error);
                return;
            }
            setAreas(prev => prev.map(a => saved.find(s => s.areaId === a.areaId) ?? a));
            setDirtyShapeIds(new Set());
        } finally {
            setIsSaving(false);
        }
    };

    return {
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
        hasDirty: dirtyShapeIds.size > 0,
        isSaving,
        saveChanges,
    };
}