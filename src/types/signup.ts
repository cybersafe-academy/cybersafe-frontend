interface ISignup {
  name: string
  cpf: string
  age: number
  email: string
  password: string
  passwordConfirmation: string
}

interface ISignupResponse {
  id: string
  name: string
  cpf: string
  age: number
  email: string
  role: string
}

export type { ISignup, ISignupResponse }
