export interface BloqDto {
    id: string;
    title: string;
    address: string;
};
export interface CreateBloqDto extends Omit<BloqDto, 'id'> { };
