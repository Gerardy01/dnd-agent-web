import { useCallback, useEffect } from "react";

// interfaces
import type { Transform, Point, AreaShape } from "@/models/mapInterfaces";
interface RendererProps {
    mainCanvasRef: React.RefObject<HTMLCanvasElement | null>;
    topRulerRef: React.RefObject<HTMLCanvasElement | null>;
    leftRulerRef: React.RefObject<HTMLCanvasElement | null>;
    transform: Transform;
    mousePos: Point;
    areas: AreaShape[];
    drawArea: AreaShape | null;
    selectedShapeId?: string | null;
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


export default function useMapRenderer({
    mainCanvasRef,
    topRulerRef,
    leftRulerRef,
    transform,
    mousePos,
    areas,
    drawArea,
    selectedShapeId
}: RendererProps) {

    const drawRuler = useCallback((tCtx: CanvasRenderingContext2D, isTop: boolean, topCanvas: HTMLCanvasElement, leftCanvas: HTMLCanvasElement) => {
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
    }, [transform, mousePos]);

    const draw = useCallback(() => {
        const canvas = mainCanvasRef.current;
        const topCanvas = topRulerRef.current;
        const leftCanvas = leftRulerRef.current;

        if (!canvas || !topCanvas || !leftCanvas) return;

        const ctx = canvas.getContext('2d');
        const topCtx = topCanvas.getContext('2d');
        const leftCtx = leftCanvas.getContext('2d');
        if (!ctx || !topCtx || !leftCtx) return;

        // 1. Clear Main Canvas
        ctx.fillStyle = THEME.bg;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.save();
        ctx.translate(transform.x, transform.y);
        ctx.scale(transform.scale, transform.scale);

        // Clip everything within the 20000x20000 bounds
        ctx.beginPath();
        ctx.rect(-10000, -10000, 20000, 20000);
        ctx.clip();

        // Draw Areas
        ctx.lineWidth = 1 / transform.scale;

        const allRects = [...areas];
        if (drawArea) allRects.push(drawArea);

        // Collect label positions for a top-most second pass
        const labels: { cx: number; cy: number; name: string }[] = [];

        allRects.forEach(area => {
            ctx.save();
            const scaleX = area.scaleX || 1;
            const scaleY = area.scaleY || 1;
            let cx = 0, cy = 0;

            if (area.type === 'free' && area.points && area.points.length > 0) {
                const minX = Math.min(...area.points.map(p => p.x));
                const minY = Math.min(...area.points.map(p => p.y));
                const maxX = Math.max(...area.points.map(p => p.x));
                const maxY = Math.max(...area.points.map(p => p.y));
                cx = (minX + maxX) / 2;
                cy = (minY + maxY) / 2;
            } else {
                let minX = area.x, minY = area.y, maxX = area.x + area.w, maxY = area.y + area.h;
                if (maxX < minX) { const t = minX; minX = maxX; maxX = t; }
                if (maxY < minY) { const t = minY; minY = maxY; maxY = t; }
                cx = (minX + maxX) / 2;
                cy = (minY + maxY) / 2;
            }

            // Only apply rotation — no ctx.scale() so stroke widths stay uniform
            ctx.translate(cx, cy);
            if (area.rotation) ctx.rotate(area.rotation);
            ctx.translate(-cx, -cy);

            if (area.type === 'free' && area.points && area.points.length > 0) {
                // Scale points manually around center to avoid ctx.scale() distorting stroke
                const scaledPoints = area.points.map(p => ({
                    x: cx + (p.x - cx) * scaleX,
                    y: cy + (p.y - cy) * scaleY
                }));

                ctx.beginPath();
                ctx.moveTo(scaledPoints[0].x, scaledPoints[0].y);
                for (let i = 1; i < scaledPoints.length; i++) {
                    ctx.lineTo(scaledPoints[i].x, scaledPoints[i].y);
                }

                if (area === drawArea) {
                    const localWorldX = (mousePos.x - transform.x) / transform.scale;
                    const localWorldY = (mousePos.y - transform.y) / transform.scale;
                    ctx.lineTo(localWorldX, localWorldY);
                    ctx.lineWidth = 3 / transform.scale;
                    ctx.strokeStyle = '#2ecc71';
                    ctx.stroke();
                    ctx.lineWidth = 1 / transform.scale;
                } else {
                    if (scaledPoints.length > 2) ctx.closePath();
                    const isSelected = area.areaId === selectedShapeId;
                    ctx.fillStyle = isSelected
                        ? (area.color || 'rgba(46, 204, 113, 0.4)').replace('0.4', '0.7')
                        : (area.color || 'rgba(46, 204, 113, 0.4)');
                    ctx.fill();
                    ctx.lineWidth = isSelected ? 6 / transform.scale : 3 / transform.scale;
                    ctx.strokeStyle = '#2ecc71';
                    ctx.stroke();
                }

            } else {
                // Rect: apply scale directly to dimensions, not via ctx.scale()
                let rw = area.w;
                let rh = area.h;
                let rx = area.x;
                let ry = area.y;

                if (rw < 0) { rx += rw; rw = Math.abs(rw); }
                if (rh < 0) { ry += rh; rh = Math.abs(rh); }

                // Compute scaled rect centered on cx/cy
                const scaledW = rw * scaleX;
                const scaledH = rh * scaleY;
                const scaledRx = cx - scaledW / 2;
                const scaledRy = cy - scaledH / 2;

                if (area === drawArea) {
                    ctx.beginPath();
                    ctx.lineWidth = 3 / transform.scale;
                    ctx.strokeStyle = '#e74c3c';
                    ctx.strokeRect(rx, ry, rw, rh);
                    ctx.lineWidth = 1 / transform.scale;
                } else {
                    const isSelected = area.areaId === selectedShapeId;
                    ctx.fillStyle = isSelected
                        ? (area.color || 'rgba(231, 76, 60, 0.4)').replace('0.4', '0.7')
                        : (area.color || 'rgba(231, 76, 60, 0.4)');
                    ctx.fillRect(scaledRx, scaledRy, scaledW, scaledH);
                    ctx.lineWidth = isSelected ? 6 / transform.scale : 3 / transform.scale;
                    ctx.strokeStyle = '#e74c3c';
                    ctx.strokeRect(scaledRx, scaledRy, scaledW, scaledH);
                }
            }

            // Collect label for top-most pass (skip while actively drawing)
            if (area !== drawArea && area.areaName) {
                labels.push({ cx, cy, name: area.areaName });
            }

            ctx.restore();
        });

        // Draw selection bounding box and handles
        if (selectedShapeId) {
            const selectedArea = allRects.find(a => a.areaId === selectedShapeId);
            if (selectedArea) {
                // Determine base bounding box without scale/rotation
                let minX = 0, minY = 0, maxX = 0, maxY = 0;
                if (selectedArea.type === 'free' && selectedArea.points && selectedArea.points.length > 0) {
                    minX = Math.min(...selectedArea.points.map(p => p.x));
                    minY = Math.min(...selectedArea.points.map(p => p.y));
                    maxX = Math.max(...selectedArea.points.map(p => p.x));
                    maxY = Math.max(...selectedArea.points.map(p => p.y));
                } else {
                    minX = selectedArea.x;
                    minY = selectedArea.y;
                    maxX = selectedArea.x + selectedArea.w;
                    maxY = selectedArea.y + selectedArea.h;
                    if (maxX < minX) { const t = minX; minX = maxX; maxX = t; }
                    if (maxY < minY) { const t = minY; minY = maxY; maxY = t; }
                }

                // Apply area scale
                const cx = (minX + maxX) / 2;
                const cy = (minY + maxY) / 2;
                const w = (maxX - minX) * (selectedArea.scaleX || 1);
                const h = (maxY - minY) * (selectedArea.scaleY || 1);
                const rot = selectedArea.rotation || 0;

                ctx.save();
                ctx.translate(cx, cy);
                ctx.rotate(rot);

                // Draw bounding box
                ctx.strokeStyle = '#3498db';
                ctx.lineWidth = 1.5 / transform.scale;
                ctx.setLineDash([5 / transform.scale, 5 / transform.scale]);
                ctx.strokeRect(-w / 2, -h / 2, w, h);
                ctx.setLineDash([]); // Reset dash

                // Keep handle size consistent on screen irrespective of zoom
                const handleSize = 8 / transform.scale;
                ctx.fillStyle = '#fff';
                ctx.strokeStyle = '#3498db';
                ctx.lineWidth = 1.5 / transform.scale;

                // Draw 4 corners
                const corners = [
                    { x: -w / 2, y: -h / 2 },
                    { x: w / 2, y: -h / 2 },
                    { x: -w / 2, y: h / 2 },
                    { x: w / 2, y: h / 2 }
                ];

                corners.forEach(c => {
                    ctx.fillRect(c.x - handleSize / 2, c.y - handleSize / 2, handleSize, handleSize);
                    ctx.strokeRect(c.x - handleSize / 2, c.y - handleSize / 2, handleSize, handleSize);
                });

                // Draw rotation handle
                const rotHandleDist = 24 / transform.scale;
                ctx.beginPath();
                ctx.moveTo(0, -h / 2);
                ctx.lineTo(0, -h / 2 - rotHandleDist);
                ctx.stroke();

                ctx.beginPath();
                ctx.arc(0, -h / 2 - rotHandleDist, handleSize / 2, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();

                ctx.restore();
            }
        }

        // Draw Main Area Border (10000x10000 bounds)
        ctx.lineWidth = 2 / transform.scale;
        ctx.strokeStyle = '#444';

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
        }

        // --- Labels pass: drawn last so they sit above grid and shapes ---
        const fontSize = 20; // constant apparent px size on screen
        ctx.font = `600 ${fontSize / transform.scale}px Inter, Arial, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.lineJoin = 'round';
        ctx.lineWidth = 3.5 / transform.scale;
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.85)';

        labels.forEach(({ cx, cy, name }) => {
            // Dark outline stroke drawn first
            ctx.strokeText(name, cx, cy);
        });

        ctx.fillStyle = '#ffffff';
        labels.forEach(({ cx, cy, name }) => {
            ctx.fillText(name, cx, cy);
        });

        ctx.restore();

        // 2. Draw Rulers
        drawRuler(topCtx, true, topCanvas, leftCanvas);
        drawRuler(leftCtx, false, topCanvas, leftCanvas);
    }, [transform, mousePos, mainCanvasRef, topRulerRef, leftRulerRef, drawRuler, areas, drawArea]);

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
    }, [draw, mainCanvasRef, topRulerRef, leftRulerRef]);

    // Handle Window Resize
    useEffect(() => {
        window.addEventListener('resize', updateResizing);
        updateResizing();
        return () => window.removeEventListener('resize', updateResizing);
    }, [updateResizing]);

    // Handle initial and subsequent renders
    useEffect(() => {
        draw();
    }, [draw]);

}