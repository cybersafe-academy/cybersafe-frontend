interface ILogin {
  cpf: string
  password: string
}

interface ILoginResponse {
  accessToken: string
  expiresIn: number
  tokenType: string
}

export type { ILogin, ILoginResponse }
