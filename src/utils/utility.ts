
// interfaces
import { type ErrorResponse } from "@/models/globalInterfaces";

export const catchFetchError = <T>(promise: Promise<T>): Promise<[undefined, T] | [ErrorResponse]> => {
    return promise.then(data => {
        return [undefined, data] as [undefined, T]
    }).catch(err => {
        return [err];
    });
}