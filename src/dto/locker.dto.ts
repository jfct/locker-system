import { LockerStatus } from "../types/locker";

export interface LockerDto {
    id: string;
    bloqId: string;
    status: LockerStatus;
    isOccupied?: boolean;
};
export interface CreateLockerDto extends Omit<LockerDto, 'id'> { };
