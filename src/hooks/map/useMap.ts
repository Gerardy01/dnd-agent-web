import { useEffect, useRef, useState } from "react";

// utils
import { isPointInArea, getTransformHandles, getShapeBounds } from "@/utils/mapMath";

// hooks
import useMapRenderer from "@/hooks/map/useMapRenderer";
import useMapViewport from "@/hooks/map/useMapViewport";

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
    const [drawArea, setDrawArea] = useState<AreaShape | null>(null);

    // Selection state
    const [selectedShapeId, setSelectedShapeId] = useState<string | null>(null);
    const [transformMode, setTransformMode] = useState<'move' | 'resize' | 'rotate' | null>(null);
    const transformStartRef = useRef<{ x: number, y: number, initialArea?: AreaShape, handleIndex?: number }>({ x: 0, y: 0 });
    // Holds the ID of an area that was JUST created, so the cursorMode effect
    // doesn't immediately clear the selection it set.
    const justCreatedIdRef = useRef<string | null>(null);

    // Dirty tracking: shape IDs that have been transformed but not yet saved
    const [dirtyShapeIds, setDirtyShapeIds] = useState<Set<string>>(new Set());
    const [isSaving, setIsSaving] = useState(false);

    useMapRenderer({
        mainCanvasRef,
        topRulerRef,
        leftRulerRef,
        transform: viewport.transform,
        mousePos: viewport.mousePos,
        areas: areaShapes,
        drawArea,
        selectedShapeId
    });

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setAreaShapes(prev => areas.map(area => {
            // Keep the in-memory (dirty) version so unsaved transforms aren't reverted
            if (dirtyShapeIds.has(area.areaId)) {
                return prev.find(s => s.areaId === area.areaId)
                    ?? { ...area.shape, areaId: area.areaId, areaName: area.name };
            }
            return { ...area.shape, areaId: area.areaId, areaName: area.name };
        }));
    }, [areas, dirtyShapeIds]);

    // Cancel incomplete drawing and clear selection when cursor mode changes.
    // Exception: if an area was just created (justCreatedIdRef is set), keep that
    // selection intact and restore it after the effect clears state.
    useEffect(() => {
        const preservedId = justCreatedIdRef.current;
        justCreatedIdRef.current = null;
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setDrawArea(null);
        setTransformMode(null);
        if (preservedId) {
            setSelectedShapeId(preservedId);
        } else {
            setSelectedShapeId(null);
        }
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

    // 5. Handlers
    const handleMouseMove = (e: React.MouseEvent) => {
        const rect = mainCanvasRef.current?.getBoundingClientRect();
        if (rect) {
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            viewport.onPointerMove(x, y);

            const clampWorld = (val: number) => Math.max(-10000, Math.min(10000, val));

            if (viewport.cursorMode === 'draw_rect' && drawArea && drawArea.type !== 'free') {
                const worldX = clampWorld(Math.round((x - viewport.transform.x) / viewport.transform.scale));
                const worldY = clampWorld(Math.round((y - viewport.transform.y) / viewport.transform.scale));
                setDrawArea(prev => prev ? {
                    ...prev,
                    w: worldX - prev.x,
                    h: worldY - prev.y
                } : null);
            } else if (viewport.cursorMode === 'draw_free' && drawArea && drawArea.type === 'free' && (e.buttons & 1)) {
                // Dragging to draw free shape
                const worldX = clampWorld(Math.round((x - viewport.transform.x) / viewport.transform.scale));
                const worldY = clampWorld(Math.round((y - viewport.transform.y) / viewport.transform.scale));

                const points = drawArea.points || [];
                if (points.length > 0) {
                    const lastPt = points[points.length - 1];
                    const dx = (worldX - lastPt.x) * viewport.transform.scale;
                    const dy = (worldY - lastPt.y) * viewport.transform.scale;

                    // Only add point if we moved a bit (e.g., 5 screen pixels)
                    if (dx * dx + dy * dy > 25) {
                        const firstPt = points[0];
                        const distToStartSq = Math.pow((worldX - firstPt.x) * viewport.transform.scale, 2) + Math.pow((worldY - firstPt.y) * viewport.transform.scale, 2);

                        // If we returned to the start AND have enough points, complete
                        if (distToStartSq < 400 && points.length > 5) {
                            createArea({ ...drawArea, points: [...points, { x: worldX, y: worldY }] });
                            setDrawArea(null);
                            viewport.handleChangeCursorMode('default');
                        } else {
                            setDrawArea(prev => prev ? { ...prev, points: [...points, { x: worldX, y: worldY }] } : null);
                        }
                    }
                }
            } else if (viewport.cursorMode === 'default' && transformMode && selectedShapeId && (e.buttons & 1)) {
                // Dragging a selected shape
                const worldX = clampWorld((x - viewport.transform.x) / viewport.transform.scale);
                const worldY = clampWorld((y - viewport.transform.y) / viewport.transform.scale);

                const startX = transformStartRef.current.x;
                const startY = transformStartRef.current.y;
                const initialArea = transformStartRef.current.initialArea;

                if (initialArea) {
                    const dx = worldX - startX;
                    const dy = worldY - startY;

                    if (transformMode === 'move') {
                        const bounds = getShapeBounds(initialArea);
                        // clamp dx and dy so bounds don't escape [-10000, 10000]
                        const minAllowedDx = -10000 - bounds.minX;
                        const maxAllowedDx = 10000 - bounds.maxX;
                        const minAllowedDy = -10000 - bounds.minY;
                        const maxAllowedDy = 10000 - bounds.maxY;

                        const cappedDx = Math.max(minAllowedDx, Math.min(maxAllowedDx, dx));
                        const cappedDy = Math.max(minAllowedDy, Math.min(maxAllowedDy, dy));

                        setAreaShapes(prev => prev.map(area => {
                            if (area.areaId === selectedShapeId) {
                                if (area.type === 'free' && area.points) {
                                    // Move all points
                                    return {
                                        ...area,
                                        points: initialArea.points!.map(p => ({ x: p.x + cappedDx, y: p.y + cappedDy }))
                                    };
                                } else {
                                    // Move rect
                                    return {
                                        ...area,
                                        x: initialArea.x + cappedDx,
                                        y: initialArea.y + cappedDy
                                    };
                                }
                            }
                            return area;
                        }));
                    } else if (transformMode === 'rotate') {
                        const bounds = getShapeBounds(initialArea);
                        // Calculate angle from center of shape to mouse
                        const angle = Math.atan2(worldY - bounds.cy, worldX - bounds.cx);
                        // The handle is at -PI/2 (top), so we offset by +PI/2 to get the actual rotation
                        const newRotation = angle + Math.PI / 2;

                        setAreaShapes(prev => prev.map(area => {
                            if (area.areaId === selectedShapeId) {
                                return { ...area, rotation: newRotation };
                            }
                            return area;
                        }));
                    } else if (transformMode === 'resize') {
                        const bounds = getShapeBounds(initialArea);
                        const handleIndex = transformStartRef.current.handleIndex;

                        // We need the movement purely in the UNROTATED local coordinate space of the shape
                        const currentLocal = { x: worldX - bounds.cx, y: worldY - bounds.cy };
                        const unrotatedLocal = {
                            x: currentLocal.x * Math.cos(-(initialArea.rotation || 0)) - currentLocal.y * Math.sin(-(initialArea.rotation || 0)),
                            y: currentLocal.x * Math.sin(-(initialArea.rotation || 0)) + currentLocal.y * Math.cos(-(initialArea.rotation || 0))
                        };

                        const startLocal = { x: startX - bounds.cx, y: startY - bounds.cy };
                        const startUnrotatedLocal = {
                            x: startLocal.x * Math.cos(-(initialArea.rotation || 0)) - startLocal.y * Math.sin(-(initialArea.rotation || 0)),
                            y: startLocal.x * Math.sin(-(initialArea.rotation || 0)) + startLocal.y * Math.cos(-(initialArea.rotation || 0))
                        };

                        const localDx = unrotatedLocal.x - startUnrotatedLocal.x;
                        const localDy = unrotatedLocal.y - startUnrotatedLocal.y;

                        setAreaShapes(prev => prev.map(area => {
                            if (area.areaId === selectedShapeId) {
                                const oldScaleX = initialArea.scaleX || 1;
                                const oldScaleY = initialArea.scaleY || 1;
                                let scaleX = oldScaleX;
                                let scaleY = oldScaleY;

                                const baseW = bounds.w / oldScaleX;
                                const baseH = bounds.h / oldScaleY;

                                // 0: tl, 1: tr, 2: bl, 3: br
                                if (handleIndex === 0) {
                                    scaleX = (bounds.w - localDx) / baseW;
                                    scaleY = (bounds.h - localDy) / baseH;
                                } else if (handleIndex === 1) {
                                    scaleX = (bounds.w + localDx) / baseW;
                                    scaleY = (bounds.h - localDy) / baseH;
                                } else if (handleIndex === 2) {
                                    scaleX = (bounds.w - localDx) / baseW;
                                    scaleY = (bounds.h + localDy) / baseH;
                                } else if (handleIndex === 3) {
                                    scaleX = (bounds.w + localDx) / baseW;
                                    scaleY = (bounds.h + localDy) / baseH;
                                }

                                // Avoid flipping by capping at small positive
                                scaleX = Math.max(0.1, scaleX);
                                scaleY = Math.max(0.1, scaleY);

                                // Compute center shift to anchor the opposite handle
                                const anchorLocalX = (handleIndex === 0 || handleIndex === 2) ? (baseW / 2) : (-baseW / 2);
                                const anchorLocalY = (handleIndex === 0 || handleIndex === 1) ? (baseH / 2) : (-baseH / 2);

                                const deltaScaleX = scaleX - oldScaleX;
                                const deltaScaleY = scaleY - oldScaleY;

                                const deltaCxLocal = anchorLocalX * -deltaScaleX;
                                const deltaCyLocal = anchorLocalY * -deltaScaleY;

                                // Rotate this shift back to world space
                                const rot = initialArea.rotation || 0;
                                const s = Math.sin(rot);
                                const c = Math.cos(rot);
                                const tx = deltaCxLocal * c - deltaCyLocal * s;
                                const ty = deltaCxLocal * s + deltaCyLocal * c;

                                if (area.type === 'free' && area.points) {
                                    return {
                                        ...area,
                                        scaleX,
                                        scaleY,
                                        points: initialArea.points!.map(p => ({ x: p.x + tx, y: p.y + ty }))
                                    };
                                } else {
                                    return {
                                        ...area,
                                        scaleX,
                                        scaleY,
                                        x: initialArea.x + tx,
                                        y: initialArea.y + ty
                                    };
                                }
                            }
                            return area;
                        }));
                    }
                }
            }
        }
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        const isMiddleClick = e.button === 1;
        viewport.onPointerDown(e.nativeEvent.offsetX, e.nativeEvent.offsetY, isMiddleClick);

        const clampWorld = (val: number) => Math.max(-10000, Math.min(10000, val));

        if (viewport.cursorMode === 'draw_rect' && !isMiddleClick && e.button === 0) {
            const rect = mainCanvasRef.current?.getBoundingClientRect();
            if (rect) {
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const worldX = clampWorld(Math.round((x - viewport.transform.x) / viewport.transform.scale));
                const worldY = clampWorld(Math.round((y - viewport.transform.y) / viewport.transform.scale));
                setDrawArea({
                    areaId: "",
                    type: 'rect',
                    x: worldX,
                    y: worldY,
                    w: 0,
                    h: 0,
                    color: 'rgba(231, 76, 60, 0.4)'
                });
            }
        } else if (viewport.cursorMode === 'draw_free' && !isMiddleClick && e.button === 0) {
            const rect = mainCanvasRef.current?.getBoundingClientRect();
            if (rect) {
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const worldX = clampWorld(Math.round((x - viewport.transform.x) / viewport.transform.scale));
                const worldY = clampWorld(Math.round((y - viewport.transform.y) / viewport.transform.scale));

                if (!drawArea || drawArea.type !== 'free') {
                    // Start new free shape
                    setDrawArea({
                        areaId: "",
                        type: 'free',
                        x: worldX,
                        y: worldY,
                        w: 0,
                        h: 0,
                        color: 'rgba(46, 204, 113, 0.4)', // Different color to distinguish
                        points: [{ x: worldX, y: worldY }]
                    });
                } else {
                    // Continuing shape: check distance to first point to close
                    if (drawArea.points && drawArea.points.length > 0) {
                        const firstPt = drawArea.points[0];
                        // Distance in screen pixels
                        const screenDx = (worldX - firstPt.x) * viewport.transform.scale;
                        const screenDy = (worldY - firstPt.y) * viewport.transform.scale;
                        const distSq = screenDx * screenDx + screenDy * screenDy;

                        // Threshold to close (e.g. 20 pixels radius)
                        if (distSq < 400 && drawArea.points.length > 2) {
                            // Close and save
                            createArea(drawArea);
                            setDrawArea(null);
                            viewport.handleChangeCursorMode('default');
                        } else {
                            // Add point
                            setDrawArea(prev => {
                                if (!prev) return prev;
                                return {
                                    ...prev,
                                    points: [...(prev.points || []), { x: worldX, y: worldY }]
                                };
                            });
                        }
                    }
                }
            }
        } else if (viewport.cursorMode === 'default' && !isMiddleClick && e.button === 0) {
            const rect = mainCanvasRef.current?.getBoundingClientRect();
            if (rect) {
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const worldX = clampWorld((x - viewport.transform.x) / viewport.transform.scale);
                const worldY = clampWorld((y - viewport.transform.y) / viewport.transform.scale);

                let foundSelection = false;

                // Check for handle clicks here later...
                if (selectedShapeId) {
                    const selectedArea = areaShapes.find(a => a.areaId === selectedShapeId);
                    if (selectedArea) {
                        const handles = getTransformHandles(selectedArea, viewport.transform.scale);
                        const handleHitRadius = 10 / viewport.transform.scale;

                        // Check rotation handle
                        const rDist = Math.hypot(worldX - handles.rotate.x, worldY - handles.rotate.y);
                        if (rDist < handleHitRadius) {
                            setTransformMode('rotate');
                            transformStartRef.current = {
                                x: worldX,
                                y: worldY,
                                initialArea: JSON.parse(JSON.stringify(selectedArea))
                            };
                            foundSelection = true;
                        }

                        // Check corners
                        if (!foundSelection) {
                            for (let i = 0; i < handles.corners.length; i++) {
                                const corner = handles.corners[i];
                                const cDist = Math.hypot(worldX - corner.x, worldY - corner.y);
                                if (cDist < handleHitRadius) {
                                    setTransformMode('resize');
                                    transformStartRef.current = {
                                        x: worldX,
                                        y: worldY,
                                        initialArea: JSON.parse(JSON.stringify(selectedArea)),
                                        handleIndex: i // 0: tl, 1: tr, 2: bl, 3: br
                                    };
                                    foundSelection = true;
                                    break;
                                }
                            }
                        }
                    }
                }

                // If no handles clicked, check for shape body click
                if (!foundSelection) {
                    for (let i = areaShapes.length - 1; i >= 0; i--) {
                        if (isPointInArea(worldX, worldY, areaShapes[i])) {
                            setSelectedShapeId(areaShapes[i].areaId || null);
                            setTransformMode('move');
                            transformStartRef.current = {
                                x: worldX,
                                y: worldY,
                                initialArea: JSON.parse(JSON.stringify(areaShapes[i])) // Deep copy
                            };
                            foundSelection = true;
                            break;
                        }
                    }
                }

                if (!foundSelection) {
                    setSelectedShapeId(null);
                    setTransformMode(null);
                }
            }
        }
    };

    const handleMouseUp = () => {
        viewport.onPointerUp();

        if (transformMode && selectedShapeId) {
            // Only mark as dirty if the shape actually changed
            const currentArea = areaShapes.find(a => a.areaId === selectedShapeId);
            const initialArea = transformStartRef.current.initialArea;

            if (currentArea && initialArea) {
                if (JSON.stringify(currentArea) !== JSON.stringify(initialArea)) {
                    setDirtyShapeIds(prev => new Set(prev).add(selectedShapeId));
                }
            }

            setTransformMode(null);
        }

        if (drawArea && (!drawArea.type || drawArea.type === 'rect')) {
            const normalizedRect = { ...drawArea };
            if (normalizedRect.w < 0) {
                normalizedRect.x += normalizedRect.w;
                normalizedRect.w = Math.abs(normalizedRect.w);
            }
            if (normalizedRect.h < 0) {
                normalizedRect.y += normalizedRect.h;
                normalizedRect.h = Math.abs(normalizedRect.h);
            }

            if (normalizedRect.w > 0 && normalizedRect.h > 0) {
                createArea(normalizedRect);
                viewport.handleChangeCursorMode('default');
            }
            setDrawArea(null);
        }
    };

    const currentCursor = viewport.isDragging ? 'grabbing' : (viewport.cursorMode === 'grab' ? 'grab' : (viewport.cursorMode === 'draw_rect' || viewport.cursorMode === 'draw_free') ? 'crosshair' : 'default');

    const createArea = async (shape: AreaShape) => {
        const [error, area] = await mapApi.createArea(shape);
        if (error) {
            console.error(error);
            return;
        }
        // Stash the ID before setAreas triggers any downstream effects,
        // so the cursorMode effect (which runs on mode→'default') can
        // preserve this selection instead of nulling it out.
        justCreatedIdRef.current = area.areaId;
        setAreas(prev => [...prev, area]);
        setSelectedShapeId(area.areaId);
    };

    const saveChanges = async () => {
        if (isSaving || dirtyShapeIds.size === 0) return;
        setIsSaving(true);

        // Build Area[] payload for each dirty shape
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
            // Sync areas with successful updates and clear dirty set
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