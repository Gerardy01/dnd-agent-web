import { axiosPrivate } from "@/config/axiosConfig";

// utils
import { catchFetchError } from "@/utils/utility";

// interfaces
import type { FetchResponse, ErrorResponse } from "@/models/globalInterfaces";
import type {
    CreateMonsterDTO,
    UpdateWorkshopMonsterDTO,
    Monster
} from "@/models/monsterInterfaces";

export class WorkshopMonsterApi {
    async getMonsters(): Promise<[undefined, Monster[]] | [ErrorResponse]> {
        const [error, res] = await catchFetchError(axiosPrivate.get<FetchResponse<Monster[]>>(
            '/workshop-monster'
        ));

        if (error) return [error];
        return [error, res.data.data];
    }

    async getOneMonster(id: number | string): Promise<[undefined, Monster] | [ErrorResponse]> {
        const [error, res] = await catchFetchError(axiosPrivate.get<FetchResponse<Monster>>(
            `/workshop-monster/${id}`
        ));

        if (error) return [error];
        return [error, res.data.data];
    }

    async createMonster(data: CreateMonsterDTO): Promise<[undefined, Monster] | [ErrorResponse]> {
        const [error, res] = await catchFetchError(axiosPrivate.post<FetchResponse<Monster>>(
            '/workshop-monster',
            data,
        ));

        if (error) return [error];
        return [error, res.data.data];
    }

    async editMonster(data: UpdateWorkshopMonsterDTO): Promise<[undefined, Monster] | [ErrorResponse]> {
        const [error, res] = await catchFetchError(axiosPrivate.put<FetchResponse<Monster>>(
            '/workshop-monster',
            data,
        ));

        if (error) return [error];
        return [error, res.data.data];
    }

    async deleteMonster(id: number | string): Promise<[undefined, boolean] | [ErrorResponse]> {
        const [error] = await catchFetchError(axiosPrivate.delete<FetchResponse<boolean>>(
            `/workshop-monster/${id}`
        ));

        if (error) return [error];
        return [error, true];
    }
}
