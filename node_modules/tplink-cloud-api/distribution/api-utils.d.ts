import { AxiosResponse } from "axios";
export declare function checkError(response: AxiosResponse<any>): void;
export declare class ResponseError extends Error {
    errorCode: number;
    response: AxiosResponse<any>;
    constructor(response: AxiosResponse<any>);
    isTokenExpired(): boolean;
}
