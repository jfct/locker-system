import { Rent } from "../models/rent.model";

export interface CreateRentDto extends Omit<Rent, "status" | "size" | "lockerId"> { };
export interface UpdateRentDto extends Omit<Rent, "size"> { }