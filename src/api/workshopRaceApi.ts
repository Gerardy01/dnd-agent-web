import { axiosPrivate } from "@/config/axiosConfig";

// utils
import { catchFetchError } from "@/utils/utility";

// interfaces
import type { FetchResponse, ErrorResponse } from "@/models/globalInterfaces";
import type { 
    RaceWrite, 
    UpdateWorkshopRaceDTO, 
    WorkshopRaceDetailReturn, 
    WorkshopRaceReturn, 
    AddTraitPayload, 
    EditTraitPayload, 
    DeleteTraitPayload
} from "@/models/raceInterfaces";

export class WorkshopRaceApi {
    async getRaces(): Promise<[undefined, WorkshopRaceReturn[]] | [ErrorResponse]> {
        const [error, res] = await catchFetchError(axiosPrivate.get<FetchResponse<WorkshopRaceReturn[]>>(
            '/workshop-race',
        ));

        if (error) return [error];
        return [error, res.data.data];
    }

    async createRace(data: RaceWrite): Promise<[undefined, WorkshopRaceReturn] | [ErrorResponse]> {
        const [error, res] = await catchFetchError(axiosPrivate.post<FetchResponse<WorkshopRaceReturn>>(
            '/workshop-race',
            data
        ));

        if (error) return [error];
        return [error, res.data.data];
    }

    async getOneRace(workshopRaceId: number): Promise<[undefined, WorkshopRaceReturn] | [ErrorResponse]> {
        const [error, res] = await catchFetchError(axiosPrivate.get<FetchResponse<WorkshopRaceReturn>>(
            `/workshop-race/${workshopRaceId}`,
        ));

        if (error) return [error];
        return [error, res.data.data];
    }

    async getDetailedRace(workshopRaceId: number): Promise<[undefined, WorkshopRaceDetailReturn] | [ErrorResponse]> {
        const [error, res] = await catchFetchError(axiosPrivate.get<FetchResponse<WorkshopRaceDetailReturn>>(
            `/workshop-race/${workshopRaceId}/detailed`,
        ));

        if (error) return [error];
        return [error, res.data.data];
    }

    async editRace(data: UpdateWorkshopRaceDTO): Promise<[undefined, WorkshopRaceReturn] | [ErrorResponse]> {
        const [error, res] = await catchFetchError(axiosPrivate.put<FetchResponse<WorkshopRaceReturn>>(
            '/workshop-race',
            data
        ));

        if (error) return [error];
        return [error, res.data.data];
    }

    async deleteRace(workshopRaceId: number): Promise<[undefined, void] | [ErrorResponse]> {
        const [error] = await catchFetchError(axiosPrivate.delete(
            `/workshop-race/${workshopRaceId}`,
        ));

        if (error) return [error];
        return [error, undefined];
    }

    async addTrait(data: AddTraitPayload): Promise<[undefined, WorkshopRaceReturn] | [ErrorResponse]> {
        const [error, res] = await catchFetchError(axiosPrivate.post<FetchResponse<WorkshopRaceReturn>>(
            '/workshop-race/action/trait',
            data
        ));

        if (error) return [error];
        return [error, res.data.data];
    }

    async editTrait(data: EditTraitPayload): Promise<[undefined, WorkshopRaceReturn] | [ErrorResponse]> {
        const [error, res] = await catchFetchError(axiosPrivate.put<FetchResponse<WorkshopRaceReturn>>(
            '/workshop-race/action/trait',
            data
        ));

        if (error) return [error];
        return [error, res.data.data];
    }

    async deleteTrait(data: DeleteTraitPayload): Promise<[undefined, WorkshopRaceReturn] | [ErrorResponse]> {
        const [error, res] = await catchFetchError(axiosPrivate.delete<FetchResponse<WorkshopRaceReturn>>(
            '/workshop-race/action/trait',
            { data }
        ));

        if (error) return [error];
        return [error, res.data.data];
    }


}
