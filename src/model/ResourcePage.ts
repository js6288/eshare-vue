import {Resource} from "./Resource";

export type ResourcePage = {
    total: number,
    size: number,
    current: number,
    records: Resource[],
}
