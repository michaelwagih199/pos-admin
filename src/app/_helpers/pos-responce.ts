export interface POS_Response<T> {
    code: string
    message: string
    data: T
}