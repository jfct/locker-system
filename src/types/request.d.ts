import { Request } from "express"

export interface RequestWithBody<T> extends Request {
    body: T
}

export interface RequestWithQuery<T> extends Request {
    query: T
}

export interface RequestWithParams<T> extends Request {
    params: T
}

export interface RequestWithBodyAndParams<T, U> extends Request {
    body: T,
    params: U
}
