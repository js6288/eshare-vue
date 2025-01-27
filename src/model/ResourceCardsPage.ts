import {ResourceCard} from "./ResourceCard";

export type ResourceCardsPage={
    total: number,
    pageNum: number,
    curPage: number,
    resourceESList: ResourceCard[]
}
