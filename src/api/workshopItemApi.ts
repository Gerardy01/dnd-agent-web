import { axiosPrivate } from "@/config/axiosConfig";

// utils
import { catchFetchError } from "@/utils/utility";

// interfaces
import type { FetchResponse, ErrorResponse } from "@/models/globalInterfaces";
import type {
    CreateWorkshopItemDTO,
    UpdateWorkshopItemDTO,
    WorkshopItemReturn
} from "@/models/itemInterfaces";

export class WorkshopItemApi {
    async getItems(): Promise<[undefined, WorkshopItemReturn[]] | [ErrorResponse]> {
        const [error, res] = await catchFetchError(axiosPrivate.get<FetchResponse<WorkshopItemReturn[]>>(
            '/workshop-item'
        ));

        if (error) return [error];
        return [error, res.data.data];
    }

    async getOneItem(id: number | string): Promise<[undefined, WorkshopItemReturn] | [ErrorResponse]> {
        const [error, res] = await catchFetchError(axiosPrivate.get<FetchResponse<WorkshopItemReturn>>(
            `/workshop-item/${id}`
        ));

        if (error) return [error];
        return [error, res.data.data];
    }

    async createItem(data: CreateWorkshopItemDTO): Promise<[undefined, WorkshopItemReturn] | [ErrorResponse]> {
        const [error, res] = await catchFetchError(axiosPrivate.post<FetchResponse<WorkshopItemReturn>>(
            '/workshop-item',
            data,
        ));

        if (error) return [error];
        return [error, res.data.data];
    }

    async editItem(data: UpdateWorkshopItemDTO): Promise<[undefined, WorkshopItemReturn] | [ErrorResponse]> {
        const [error, res] = await catchFetchError(axiosPrivate.put<FetchResponse<WorkshopItemReturn>>(
            '/workshop-item',
            data,
        ));

        if (error) return [error];
        return [error, res.data.data];
    }

    async deleteItem(id: number | string): Promise<[undefined, boolean] | [ErrorResponse]> {
        const [error] = await catchFetchError(axiosPrivate.delete<FetchResponse<boolean>>(
            `/workshop-item/${id}`
        ));

        if (error) return [error];
        return [error, true];
    }
}