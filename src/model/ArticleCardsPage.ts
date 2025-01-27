import {ArticleCard} from "./ArticleCard";

export type ArticleCardsPage = {
    total: number,
    pageNum: number,
    curPage: number,
    articleCardESList: ArticleCard[]
}
