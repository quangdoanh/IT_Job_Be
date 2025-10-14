import { Request } from "express";

export interface AccountRequest extends Request {
    account?: any // thêm một field mới tên account, dấu ? nghĩa là có thể có hoặc không.
}
