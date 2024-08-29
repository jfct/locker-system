export enum RentStatus {
    CREATED = 'CREATED',
    WAITING_DROPOFF = 'WAITING_DROPOFF',
    WAITING_PICKUP = 'WAITING_PICKUP',
    DELIVERED = 'DELIVERED'
}

export enum RentSize {
    XS = 'XS',
    S = 'S',
    M = 'M',
    L = 'L',
    XL = 'XL'
}

export enum RentSizeLimits {
    XS = 0,
    S = 2,
    M = 5,
    L = 7,
    XL = 10
}