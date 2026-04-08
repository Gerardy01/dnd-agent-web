

// interface
import type { ErrorResponse } from "@/models/globalInterfaces";
import type {
    Area,
    AreaShape,
    UpdateAreaPayload
} from "@/models/mapInterfaces";

export class MapApi {

    async createArea(shape: AreaShape): Promise<[undefined, Area] | [ErrorResponse]> {
        // TODO: replace with real fetch call
        return [
            undefined,
            {
                areaId: crypto.randomUUID(),
                name: 'Area 1',
                description: 'Area 1',
                shape: shape
            }
        ]
    }

    async updateArea(data: UpdateAreaPayload): Promise<[undefined, Area] | [ErrorResponse]> {
        // TODO: replace with real fetch call
        return [
            undefined,
            {
                areaId: data.areaId,
                name: data.name,
                description: data.description,
                shape: data.shape
            }
        ]
    }

    async bulkUpdateArea(data: Area[]): Promise<[undefined, Area[]] | [ErrorResponse]> {
        // TODO: replace with real fetch call
        return [
            undefined,
            data
        ]
    }

}