import { useState, useRef, type Dispatch, type SetStateAction } from "react";
import type { AreaShape } from "@/models/mapInterfaces";
import { getShapeBounds, getTransformHandles, isPointInArea } from "@/utils/mapMath";

interface UseMapTransformProps {
    viewport: {
        transform: { x: number, y: number, scale: number };
        cursorMode: string;
    };
    areaShapes: AreaShape[];
    setAreaShapes: Dispatch<SetStateAction<AreaShape[]>>;
    setDirtyShapeIds: Dispatch<SetStateAction<Set<string>>>;
}

export default function useMapTransform({ viewport, areaShapes, setAreaShapes, setDirtyShapeIds }: UseMapTransformProps) {
    const [selectedShapeId, setSelectedShapeId] = useState<string | null>(null);
    const [transformMode, setTransformMode] = useState<'move' | 'resize' | 'rotate' | null>(null);
    const transformStartRef = useRef<{ x: number, y: number, initialArea?: AreaShape, handleIndex?: number }>({ x: 0, y: 0 });

    const onTransformMove = (worldX: number, worldY: number, buttons: number) => {
        if (viewport.cursorMode === 'default' && transformMode && selectedShapeId && (buttons & 1)) {
            const startX = transformStartRef.current.x;
            const startY = transformStartRef.current.y;
            const initialArea = transformStartRef.current.initialArea;

            if (initialArea) {
                const dx = worldX - startX;
                const dy = worldY - startY;

                if (transformMode === 'move') {
                    const bounds = getShapeBounds(initialArea);
                    const minAllowedDx = -10000 - bounds.minX;
                    const maxAllowedDx = 10000 - bounds.maxX;
                    const minAllowedDy = -10000 - bounds.minY;
                    const maxAllowedDy = 10000 - bounds.maxY;

                    const cappedDx = Math.max(minAllowedDx, Math.min(maxAllowedDx, dx));
                    const cappedDy = Math.max(minAllowedDy, Math.min(maxAllowedDy, dy));

                    setAreaShapes(prev => prev.map(area => {
                        if (area.areaId === selectedShapeId) {
                            if (area.type === 'free' && area.points) {
                                return {
                                    ...area,
                                    points: initialArea.points!.map(p => ({ x: p.x + cappedDx, y: p.y + cappedDy }))
                                };
                            } else {
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
                    const angle = Math.atan2(worldY - bounds.cy, worldX - bounds.cx);
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

                            scaleX = Math.max(0.1, scaleX);
                            scaleY = Math.max(0.1, scaleY);

                            const anchorLocalX = (handleIndex === 0 || handleIndex === 2) ? (baseW / 2) : (-baseW / 2);
                            const anchorLocalY = (handleIndex === 0 || handleIndex === 1) ? (baseH / 2) : (-baseH / 2);

                            const deltaScaleX = scaleX - oldScaleX;
                            const deltaScaleY = scaleY - oldScaleY;

                            const deltaCxLocal = anchorLocalX * -deltaScaleX;
                            const deltaCyLocal = anchorLocalY * -deltaScaleY;

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
    };

    const onTransformDown = (worldX: number, worldY: number) => {
        if (viewport.cursorMode === 'default') {
            let foundSelection = false;

            if (selectedShapeId) {
                const selectedArea = areaShapes.find(a => a.areaId === selectedShapeId);
                if (selectedArea) {
                    const handles = getTransformHandles(selectedArea, viewport.transform.scale);
                    const handleHitRadius = 10 / viewport.transform.scale;

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
                                    handleIndex: i
                                };
                                foundSelection = true;
                                break;
                            }
                        }
                    }
                }
            }

            if (!foundSelection) {
                for (let i = areaShapes.length - 1; i >= 0; i--) {
                    if (isPointInArea(worldX, worldY, areaShapes[i])) {
                        setSelectedShapeId(areaShapes[i].areaId || null);
                        setTransformMode('move');
                        transformStartRef.current = {
                            x: worldX,
                            y: worldY,
                            initialArea: JSON.parse(JSON.stringify(areaShapes[i]))
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
    };

    const onTransformUp = () => {
        if (transformMode && selectedShapeId) {
            const currentArea = areaShapes.find(a => a.areaId === selectedShapeId);
            const initialArea = transformStartRef.current.initialArea;

            if (currentArea && initialArea) {
                if (JSON.stringify(currentArea) !== JSON.stringify(initialArea)) {
                    setDirtyShapeIds(prev => new Set(prev).add(selectedShapeId));
                }
            }

            setTransformMode(null);
        }
    };

    const clearSelection = () => {
        setSelectedShapeId(null);
        setTransformMode(null);
    };

    const setSelection = (id: string | null) => setSelectedShapeId(id);

    return {
        selectedShapeId,
        transformMode,
        onTransformMove,
        onTransformDown,
        onTransformUp,
        clearSelection,
        setSelection
    };
}
