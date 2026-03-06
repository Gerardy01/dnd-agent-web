import type { Point, AreaShape } from "@/models/mapInterfaces";

/**
 * Rotate a point around a center.
 */
export function rotatePoint(px: number, py: number, cx: number, cy: number, angleRad: number): Point {
    const s = Math.sin(angleRad);
    const c = Math.cos(angleRad);

    // translate point back to origin:
    px -= cx;
    py -= cy;

    // rotate point
    const xnew = px * c - py * s;
    const ynew = px * s + py * c;

    // translate point back:
    return { x: xnew + cx, y: ynew + cy };
}

export function getShapeBounds(area: AreaShape) {
    let minX = 0, minY = 0, maxX = 0, maxY = 0;
    if (area.type === 'free' && area.points && area.points.length > 0) {
        minX = Math.min(...area.points.map(p => p.x));
        minY = Math.min(...area.points.map(p => p.y));
        maxX = Math.max(...area.points.map(p => p.x));
        maxY = Math.max(...area.points.map(p => p.y));
    } else {
        minX = area.x;
        minY = area.y;
        maxX = area.x + area.w;
        maxY = area.y + area.h;
        if (maxX < minX) { const t = minX; minX = maxX; maxX = t; }
        if (maxY < minY) { const t = minY; minY = maxY; maxY = t; }
    }
    const cx = (minX + maxX) / 2;
    const cy = (minY + maxY) / 2;
    const w = (maxX - minX) * (area.scaleX || 1);
    const h = (maxY - minY) * (area.scaleY || 1);

    return { cx, cy, w, h, minX, maxX, minY, maxY };
}

export function getTransformHandles(area: AreaShape, scale: number) {
    const { cx, cy, w, h } = getShapeBounds(area);
    const rot = area.rotation || 0;

    const corners = [
        { x: -w / 2, y: -h / 2, id: 'tl' },
        { x: w / 2, y: -h / 2, id: 'tr' },
        { x: -w / 2, y: h / 2, id: 'bl' },
        { x: w / 2, y: h / 2, id: 'br' }
    ];

    const worldCorners = corners.map(c => {
        // Here we first place it relative to center, then add center, then rotate around center
        return {
            ...rotatePoint(c.x + cx, c.y + cy, cx, cy, rot),
            id: c.id
        };
    });

    const rotHandleDist = 24 / scale;
    const rotHandleWorld = rotatePoint(0 + cx, -h / 2 - rotHandleDist + cy, cx, cy, rot);

    return { corners: worldCorners, rotate: rotHandleWorld, rotHandleDist };
}

/**
 * Check if a point is inside a polygon using ray casting.
 */
function isPointInPolygon(px: number, py: number, points: Point[]): boolean {
    let inside = false;
    for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
        const xi = points[i].x, yi = points[i].y;
        const xj = points[j].x, yj = points[j].y;

        const intersect = ((yi > py) !== (yj > py))
            && (px < (xj - xi) * (py - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    return inside;
}

/**
 * Check if a point is inside an area shape (considering rotation and scale).
 */
export function isPointInArea(px: number, py: number, area: AreaShape): boolean {
    if (area.type === 'free' && area.points && area.points.length > 2) {
        // Free shape uses precise point in polygon calculation
        // Find center of polygon to apply rotation/scale inversely
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        area.points.forEach(pt => {
            if (pt.x < minX) minX = pt.x;
            if (pt.y < minY) minY = pt.y;
            if (pt.x > maxX) maxX = pt.x;
            if (pt.y > maxY) maxY = pt.y;
        });
        const cx = (minX + maxX) / 2;
        const cy = (minY + maxY) / 2;

        let targetX = px, targetY = py;
        // Inverse rotation and scale on the cursor point relative to the polygon center
        if (area.rotation || area.scaleX !== undefined || area.scaleY !== undefined) {
            const rot = rotatePoint(px, py, cx, cy, -(area.rotation || 0));
            const rotDx = rot.x - cx;
            const rotDy = rot.y - cy;
            targetX = cx + (rotDx / (area.scaleX || 1));
            targetY = cy + (rotDy / (area.scaleY || 1));
        }

        return isPointInPolygon(targetX, targetY, area.points);
    }

    // Rectangle shape
    const cx = area.x + area.w / 2;
    const cy = area.y + area.h / 2;

    // Rotate the point BACKWARDS to align with the un-rotated rectangle
    const unrotated = rotatePoint(px, py, cx, cy, -(area.rotation || 0));

    // Calculate the scaled width and height
    const sw = area.w * (area.scaleX || 1);
    const sh = area.h * (area.scaleY || 1);

    // Check against the unrotated, scaled bounds
    const minX = cx - sw / 2;
    const maxX = cx + sw / 2;
    const minY = cy - sh / 2;
    const maxY = cy + sh / 2;

    return unrotated.x >= minX && unrotated.x <= maxX && unrotated.y >= minY && unrotated.y <= maxY;
}
