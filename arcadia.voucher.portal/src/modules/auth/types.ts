export interface IOperatorData {
  name: string
  id: number
}

export interface IAuthReducer {
  readonly isLoading: boolean
  readonly token: string | null
  readonly operator: IOperatorData
}

export interface IAuthStoreSlice {
  authReducer: IAuthReducer
}

export interface ISignInRequestBody {
  username: string
  password: string
}

export interface ISignInResponseBody {
  token: string
  operator: IOperatorData
}
