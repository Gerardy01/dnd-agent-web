import { axiosPrivate } from "@/config/axiosConfig";

// utils
import { catchFetchError } from "@/utils/utility";

// interfaces
import type { FetchResponse, ErrorResponse } from "@/models/globalInterfaces";
import type {
    CreateSpellDTO,
    UpdateWorkshopSpellDTO,
    WorkshopSpellReturn
} from "@/models/spellInterfaces";

export class WorkshopSpellApi {
    async getSpells(): Promise<[undefined, WorkshopSpellReturn[]] | [ErrorResponse]> {
        const [error, res] = await catchFetchError(axiosPrivate.get<FetchResponse<WorkshopSpellReturn[]>>(
            '/workshop-spell'
        ));

        if (error) return [error];
        return [error, res.data.data];
    }

    async getOneSpell(id: number | string): Promise<[undefined, WorkshopSpellReturn] | [ErrorResponse]> {
        const [error, res] = await catchFetchError(axiosPrivate.get<FetchResponse<WorkshopSpellReturn>>(
            `/workshop-spell/${id}`
        ));

        if (error) return [error];
        return [error, res.data.data];
    }

    async createSpell(data: CreateSpellDTO): Promise<[undefined, WorkshopSpellReturn] | [ErrorResponse]> {
        const [error, res] = await catchFetchError(axiosPrivate.post<FetchResponse<WorkshopSpellReturn>>(
            '/workshop-spell',
            data,
        ));

        if (error) return [error];
        return [error, res.data.data];
    }

    async editSpell(data: UpdateWorkshopSpellDTO): Promise<[undefined, WorkshopSpellReturn] | [ErrorResponse]> {
        const [error, res] = await catchFetchError(axiosPrivate.put<FetchResponse<WorkshopSpellReturn>>(
            '/workshop-spell',
            data,
        ));

        if (error) return [error];
        return [error, res.data.data];
    }

    async deleteSpell(id: number | string): Promise<[undefined, boolean] | [ErrorResponse]> {
        const [error] = await catchFetchError(axiosPrivate.delete<FetchResponse<boolean>>(
            `/workshop-spell/${id}`
        ));

        if (error) return [error];
        return [error, true];
    }
}
