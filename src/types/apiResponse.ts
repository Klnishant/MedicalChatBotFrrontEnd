import { History } from "@/model/history";

export interface apiResponse {
    success: boolean;
    message: string;
    messages?: Array<History>;
};