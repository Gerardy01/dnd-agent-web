import { axiosPrivate } from "@/config/axiosConfig";

// utils
import { catchFetchError } from "@/utils/utility";

// interfaces
import type { FetchResponse, ErrorResponse } from "@/models/globalInterfaces";
import type {
    CreateFactionDTO,
    UpdateWorkshopFactionDTO,
    WorkshopFactionReturn
} from "@/models/factionInterfaces";

export class WorkshopFactionApi {
    async getFactions(): Promise<[undefined, WorkshopFactionReturn[]] | [ErrorResponse]> {
        const [error, res] = await catchFetchError(axiosPrivate.get<FetchResponse<WorkshopFactionReturn[]>>(
            '/workshop-faction'
        ));

        if (error) return [error];
        return [error, res.data.data];
    }

    async getOneFaction(id: number | string): Promise<[undefined, WorkshopFactionReturn] | [ErrorResponse]> {
        const [error, res] = await catchFetchError(axiosPrivate.get<FetchResponse<WorkshopFactionReturn>>(
            `/workshop-faction/${id}`
        ));

        if (error) return [error];
        return [error, res.data.data];
    }

    async createFaction(data: CreateFactionDTO): Promise<[undefined, WorkshopFactionReturn] | [ErrorResponse]> {
        const [error, res] = await catchFetchError(axiosPrivate.post<FetchResponse<WorkshopFactionReturn>>(
            '/workshop-faction',
            data,
        ));

        if (error) return [error];
        return [error, res.data.data];
    }

    async editFaction(data: UpdateWorkshopFactionDTO): Promise<[undefined, WorkshopFactionReturn] | [ErrorResponse]> {
        const [error, res] = await catchFetchError(axiosPrivate.put<FetchResponse<WorkshopFactionReturn>>(
            '/workshop-faction',
            data,
        ));

        if (error) return [error];
        return [error, res.data.data];
    }

    async deleteFaction(id: number | string): Promise<[undefined, boolean] | [ErrorResponse]> {
        const [error] = await catchFetchError(axiosPrivate.delete<FetchResponse<boolean>>(
            `/workshop-faction/${id}`
        ));

        if (error) return [error];
        return [error, true];
    }
}
