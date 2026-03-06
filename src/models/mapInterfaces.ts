


export interface Transform {
    x: number;
    y: number;
    scale: number;
}
export interface Point {
    x: number;
    y: number;
}
export interface AreaShape {
    areaId?: string;
    areaName?: string;
    type?: 'rect' | 'free';
    x: number;
    y: number;
    w: number;
    h: number;
    color: string;
    points?: Point[];
    scaleX?: number;
    scaleY?: number;
    rotation?: number;
}

export interface Area {
    areaId: string;
    name: string;
    description: string;
    shape: AreaShape;
}

export interface UpdateAreaPayload {
    areaId: string;
    name: string;
    description: string;
    shape: AreaShape;
}
