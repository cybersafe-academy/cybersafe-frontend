interface ISignup {
  name: string
  cpf: string
  age: string
  email: string
  password: string
  passwordConfirmation: string
}

interface ISignupResponse {
  id: string
  name: string
  cpf: string
  age: string
  email: string
  role: string
}

export type { ISignup, ISignupResponse }
