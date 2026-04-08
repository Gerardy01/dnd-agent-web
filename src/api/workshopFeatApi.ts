import { axiosPrivate } from "@/config/axiosConfig";

// utils
import { catchFetchError } from "@/utils/utility";

// interfaces
import type { FetchResponse, ErrorResponse } from "@/models/globalInterfaces";
import type {
    CreateFeatDTO,
    UpdateWorkshopFeatDTO,
    WorkshopFeatReturn
} from "@/models/featInterfaces";

export class WorkshopFeatApi {
    async getFeats(): Promise<[undefined, WorkshopFeatReturn[]] | [ErrorResponse]> {
        const [error, res] = await catchFetchError(axiosPrivate.get<FetchResponse<WorkshopFeatReturn[]>>(
            '/workshop-feat'
        ));

        if (error) return [error];
        return [error, res.data.data];
    }

    async getOneFeat(id: number | string): Promise<[undefined, WorkshopFeatReturn] | [ErrorResponse]> {
        const [error, res] = await catchFetchError(axiosPrivate.get<FetchResponse<WorkshopFeatReturn>>(
            `/workshop-feat/${id}`
        ));

        if (error) return [error];
        return [error, res.data.data];
    }

    async createFeat(data: CreateFeatDTO): Promise<[undefined, WorkshopFeatReturn] | [ErrorResponse]> {
        const [error, res] = await catchFetchError(axiosPrivate.post<FetchResponse<WorkshopFeatReturn>>(
            '/workshop-feat',
            data,
        ));

        if (error) return [error];
        return [error, res.data.data];
    }

    async editFeat(data: UpdateWorkshopFeatDTO): Promise<[undefined, WorkshopFeatReturn] | [ErrorResponse]> {
        const [error, res] = await catchFetchError(axiosPrivate.put<FetchResponse<WorkshopFeatReturn>>(
            '/workshop-feat',
            data,
        ));

        if (error) return [error];
        return [error, res.data.data];
    }

    async deleteFeat(id: number | string): Promise<[undefined, boolean] | [ErrorResponse]> {
        const [error] = await catchFetchError(axiosPrivate.delete<FetchResponse<boolean>>(
            `/workshop-feat/${id}`
        ));

        if (error) return [error];
        return [error, true];
    }
}
