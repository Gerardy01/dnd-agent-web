import { axiosPrivate } from "@/config/axiosConfig";

// utils
import { catchFetchError } from "@/utils/utility";

// interfaces
import type { FetchResponse, ErrorResponse } from "@/models/globalInterfaces";
import type { ItemOptionsReturn, EffectOptionsReturn, FeatOptionsReturn } from "@/models/referenceInterfaces";

export class ReferenceApi {
    async getItemOptions(): Promise<[undefined, ItemOptionsReturn] | [ErrorResponse]> {
        const [error, res] = await catchFetchError(axiosPrivate.get<FetchResponse<ItemOptionsReturn>>(
            '/reference/item-options',
        ));

        if (error) return [error];
        return [error, res.data.data];
    }

    async getEffectOptions(): Promise<[undefined, EffectOptionsReturn] | [ErrorResponse]> {
        const [error, res] = await catchFetchError(axiosPrivate.get<FetchResponse<EffectOptionsReturn>>(
            '/reference/effect-options',
        ));

        if (error) return [error];
        return [error, res.data.data];
    }

    async getFeatOptions(): Promise<[undefined, FeatOptionsReturn] | [ErrorResponse]> {
        const [error, res] = await catchFetchError(axiosPrivate.get<FetchResponse<FeatOptionsReturn>>(
            '/reference/feat-options',
        ));

        if (error) return [error];
        return [error, res.data.data];
    }
}
