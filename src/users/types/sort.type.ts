import { SortOrder } from "mongoose";

export type FindOptions = {
    sortOption?: Record<string, SortOrder>;
};