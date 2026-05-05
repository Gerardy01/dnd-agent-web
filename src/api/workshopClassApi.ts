import { axiosPrivate } from "@/config/axiosConfig";

// utils
import { catchFetchError } from "@/utils/utility";

// interfaces
import type { FetchResponse, ErrorResponse } from "@/models/globalInterfaces";
import type { CreateClassDTO, UpdateWorkshopClassDTO, WorkshopClassDetailReturn, WorkshopClassReturn } from "@/models/classInterfaces";

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

    async getOneClass(workshopClassId: number): Promise<[undefined, WorkshopClassReturn] | [ErrorResponse]> {
        const [error, res] = await catchFetchError(axiosPrivate.get<FetchResponse<WorkshopClassReturn>>(
            `/workshop-class/${workshopClassId}`,
        ));

        if (error) return [error];
        return [error, res.data.data];
    }

    async getDetailedClass(workshopClassId: number): Promise<[undefined, WorkshopClassDetailReturn] | [ErrorResponse]> {
        const [error, res] = await catchFetchError(axiosPrivate.get<FetchResponse<WorkshopClassDetailReturn>>(
            `/workshop-class/${workshopClassId}/detailed`,
        ));

        if (error) return [error];
        return [error, res.data.data];
    }

    async editClass(data: UpdateWorkshopClassDTO): Promise<[undefined, WorkshopClassReturn] | [ErrorResponse]> {
        const [error, res] = await catchFetchError(axiosPrivate.put<FetchResponse<WorkshopClassReturn>>(
            '/workshop-class',
            data
        ));

        if (error) return [error];
        return [error, res.data.data];
    }

    async deleteClass(workshopClassId: number): Promise<[undefined, void] | [ErrorResponse]> {
        const [error] = await catchFetchError(axiosPrivate.delete(
            `/workshop-class/${workshopClassId}`,
        ));

        if (error) return [error];
        return [error, undefined];
    }
}
