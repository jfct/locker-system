import { Locker } from "../models/locker.model";

export interface CreateLockerDto extends Omit<Locker, "status" | "isOccupied"> { };
export interface UpdateLockerDto extends Omit<Partial<Locker>, "bloqId"> { };