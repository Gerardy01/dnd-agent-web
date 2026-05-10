import { axiosPrivate } from "@/config/axiosConfig";

// utils
import { catchFetchError } from "@/utils/utility";

// interfaces
import type { FetchResponse, ErrorResponse } from "@/models/globalInterfaces";
import type { CreateClassDTO, UpdateWorkshopClassDTO, WorkshopClassDetailReturn, WorkshopClassReturn, AddFeaturePayload, EditFeaturePayload, DeleteFeaturePayload, AddResourcePayload, EditResourcePayload, DeleteResourcePayload, ClassResourceReturn, CreateClassSubDTO, WorkshopClassSubDataReturn, WorkshopClassSubDetailDataReturn, UpdateClassSubDTO } from "@/models/classInterfaces";

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

    async addFeature(data: AddFeaturePayload): Promise<[undefined, WorkshopClassReturn] | [ErrorResponse]> {
        const [error, res] = await catchFetchError(axiosPrivate.post<FetchResponse<WorkshopClassReturn>>(
            '/workshop-class/action/feature',
            data
        ));

        if (error) return [error];
        return [error, res.data.data];
    }

    async editFeature(data: EditFeaturePayload): Promise<[undefined, WorkshopClassReturn] | [ErrorResponse]> {
        const [error, res] = await catchFetchError(axiosPrivate.put<FetchResponse<WorkshopClassReturn>>(
            '/workshop-class/action/feature',
            data
        ));

        if (error) return [error];
        return [error, res.data.data];
    }

    async deleteFeature(data: DeleteFeaturePayload): Promise<[undefined, WorkshopClassReturn] | [ErrorResponse]> {
        const [error, res] = await catchFetchError(axiosPrivate.delete<FetchResponse<WorkshopClassReturn>>(
            '/workshop-class/action/feature',
            { data }
        ));

        if (error) return [error];
        return [error, res.data.data];
    }

    async addResource(data: AddResourcePayload): Promise<[undefined, ClassResourceReturn] | [ErrorResponse]> {
        const [error, res] = await catchFetchError(axiosPrivate.post<FetchResponse<ClassResourceReturn>>(
            '/workshop-class/action/resource',
            data
        ));

        if (error) return [error];
        return [error, res.data.data];
    }

    async editResource(data: EditResourcePayload): Promise<[undefined, ClassResourceReturn] | [ErrorResponse]> {
        const [error, res] = await catchFetchError(axiosPrivate.put<FetchResponse<ClassResourceReturn>>(
            '/workshop-class/action/resource',
            data
        ));

        if (error) return [error];
        return [error, res.data.data];
    }

    async deleteResource(data: DeleteResourcePayload): Promise<[undefined, ClassResourceReturn] | [ErrorResponse]> {
        const [error, res] = await catchFetchError(axiosPrivate.delete<FetchResponse<ClassResourceReturn>>(
            '/workshop-class/action/resource',
            { data }
        ));

        if (error) return [error];
        return [error, res.data.data];
    }

    async getSubclasses(parentClassId: number): Promise<[undefined, WorkshopClassSubDataReturn[]] | [ErrorResponse]> {
        const [error, res] = await catchFetchError(axiosPrivate.get<FetchResponse<WorkshopClassSubDataReturn[]>>(
            `/workshop-class/subclass?parentClassId=${parentClassId}`,
        ));

        if (error) return [error];
        return [error, res.data.data];
    }

    async createSubclass(data: CreateClassSubDTO): Promise<[undefined, WorkshopClassSubDataReturn] | [ErrorResponse]> {
        const [error, res] = await catchFetchError(axiosPrivate.post<FetchResponse<WorkshopClassSubDataReturn>>(
            '/workshop-class/subclass',
            data
        ));

        if (error) return [error];
        return [error, res.data.data];
    }

    async deleteSubclass(subclassId: number): Promise<[undefined, void] | [ErrorResponse]> {
        const [error] = await catchFetchError(axiosPrivate.delete(
            `/workshop-class/subclass/${subclassId}`,
        ));

        if (error) return [error];
        return [error, undefined];
    }

    async getSubclass(subclassId: number): Promise<[undefined, WorkshopClassSubDetailDataReturn] | [ErrorResponse]> {
        const [error, res] = await catchFetchError(axiosPrivate.get<FetchResponse<WorkshopClassSubDetailDataReturn>>(
            `/workshop-class/subclass/${subclassId}/detailed`,
        ));

        if (error) return [error];
        return [error, res.data.data];
    }

    async editSubclass(data: UpdateClassSubDTO): Promise<[undefined, WorkshopClassSubDataReturn] | [ErrorResponse]> {
        const [error, res] = await catchFetchError(axiosPrivate.put<FetchResponse<WorkshopClassSubDataReturn>>(
            '/workshop-class/subclass',
            data
        ));

        if (error) return [error];
        return [error, res.data.data];
    }
}
