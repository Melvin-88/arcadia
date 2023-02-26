export interface IAPIErrorResponseBody {
  statusMessage: string
  data: {
    statusCode: number
    error: string
    message: string
  }
}
