import { Rent } from "../models/rent.model";

export interface CreateRentDto extends Omit<Rent, "status" | "size" | "lockerId"> { };

// I assume the size cannot be changed once we created the rent
export interface UpdateRentDto extends Omit<Partial<Rent>, "size"> { }