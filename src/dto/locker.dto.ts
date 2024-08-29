import { Locker } from "../models/locker.model";

export interface CreateLockerDto extends Locker { };
export interface UpdateLockerDto extends Omit<Locker, "bloqId"> { };
