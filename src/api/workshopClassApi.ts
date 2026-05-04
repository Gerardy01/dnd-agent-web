import { axiosPrivate } from "@/config/axiosConfig";

// utils
import { catchFetchError } from "@/utils/utility";

// interfaces
import type { FetchResponse, ErrorResponse } from "@/models/globalInterfaces";
import type { CreateClassDTO, WorkshopClassReturn } from "@/models/classInterfaces";

export class WorkshopClassApi {
    async getClasses(): Promise<[undefined, WorkshopClassReturn[]] | [ErrorResponse]> {
        const [error, res] = await catchFetchError(axiosPrivate.get<FetchResponse<WorkshopClassReturn[]>>(
            '/workshop-class',
        ));

        if (error) return [error];
        return [error, res.data.data];
    }

    async createClass(data: CreateClassDTO): Promise<[undefined, WorkshopClassReturn] | [ErrorResponse]> {
        const [error, res] = await catchFetchError(axiosPrivate.post<FetchResponse<WorkshopClassReturn>>(
            '/workshop-class',
            data
        ));

        if (error) return [error];
        return [error, res.data.data];
    }
}
