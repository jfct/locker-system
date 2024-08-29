import { Bloq } from "../models/bloq.model";

export interface CreateBloqDto extends Bloq { };
export interface UpdateBloqDto extends Omit<Partial<Bloq>, 'id'> { };
