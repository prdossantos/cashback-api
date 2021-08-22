export interface ResponseError {
    success: boolean,
    error: string
}

export interface ResponseSuccess<T> {
    success: boolean,
    data: T
}
