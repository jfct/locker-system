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

// The logic is that the number is the limit for the size
// until 2 it's XS
// until 5 it's S
// until 7 is M, and so on
export enum RentSizeLimits {
    XS = 2,
    S = 5,
    M = 7,
    L = 10,
    XL = 30
}