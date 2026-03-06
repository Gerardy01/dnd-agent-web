import { useState } from "react";
import type { AreaShape } from "@/models/mapInterfaces";

interface UseMapDrawProps {
    viewport: {
        transform: { x: number, y: number, scale: number };
        cursorMode: string;
        handleChangeCursorMode: (mode: 'default' | 'grab' | 'draw_rect' | 'draw_free') => void;
    };
    createArea: (shape: AreaShape) => Promise<void>;
}

export default function useMapDraw({ viewport, createArea }: UseMapDrawProps) {
    const [drawArea, setDrawArea] = useState<AreaShape | null>(null);

    const onDrawMove = (worldXRaw: number, worldYRaw: number, buttons: number) => {
        const worldX = Math.round(worldXRaw);
        const worldY = Math.round(worldYRaw);

        if (viewport.cursorMode === 'draw_rect' && drawArea && drawArea.type !== 'free') {
            setDrawArea(prev => prev ? {
                ...prev,
                w: worldX - prev.x,
                h: worldY - prev.y
            } : null);
        } else if (viewport.cursorMode === 'draw_free' && drawArea && drawArea.type === 'free' && (buttons & 1)) {
            const points = drawArea.points || [];
            if (points.length > 0) {
                const lastPt = points[points.length - 1];
                const dx = (worldX - lastPt.x) * viewport.transform.scale;
                const dy = (worldY - lastPt.y) * viewport.transform.scale;

                if (dx * dx + dy * dy > 25) {
                    const firstPt = points[0];
                    const distToStartSq = Math.pow((worldX - firstPt.x) * viewport.transform.scale, 2) + Math.pow((worldY - firstPt.y) * viewport.transform.scale, 2);

                    if (distToStartSq < 400 && points.length > 5) {
                        createArea({ ...drawArea, points: [...points, { x: worldX, y: worldY }] });
                        setDrawArea(null);
                        viewport.handleChangeCursorMode('default');
                    } else {
                        setDrawArea(prev => prev ? { ...prev, points: [...points, { x: worldX, y: worldY }] } : null);
                    }
                }
            }
        }
    };

    const onDrawDown = (worldXRaw: number, worldYRaw: number) => {
        const worldX = Math.round(worldXRaw);
        const worldY = Math.round(worldYRaw);

        if (viewport.cursorMode === 'draw_rect') {
            setDrawArea({
                areaId: "",
                type: 'rect',
                x: worldX,
                y: worldY,
                w: 0,
                h: 0,
                color: 'rgba(231, 76, 60, 0.4)'
            });
        } else if (viewport.cursorMode === 'draw_free') {
            if (!drawArea || drawArea.type !== 'free') {
                setDrawArea({
                    areaId: "",
                    type: 'free',
                    x: worldX,
                    y: worldY,
                    w: 0,
                    h: 0,
                    color: 'rgba(46, 204, 113, 0.4)',
                    points: [{ x: worldX, y: worldY }]
                });
            } else {
                if (drawArea.points && drawArea.points.length > 0) {
                    const firstPt = drawArea.points[0];
                    const screenDx = (worldX - firstPt.x) * viewport.transform.scale;
                    const screenDy = (worldY - firstPt.y) * viewport.transform.scale;
                    const distSq = screenDx * screenDx + screenDy * screenDy;

                    if (distSq < 400 && drawArea.points.length > 2) {
                        createArea(drawArea);
                        setDrawArea(null);
                        viewport.handleChangeCursorMode('default');
                    } else {
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
    };

    const onDrawUp = () => {
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

    const cancelDraw = () => setDrawArea(null);

    return { drawArea, onDrawMove, onDrawDown, onDrawUp, cancelDraw };
}
