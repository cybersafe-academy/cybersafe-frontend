interface IUserData {
  id: string
  name: string
  email: string
  cpf: string
  profilePictureURL: string
  age: number
  role: string
  mbtiType: string
  company: ICompanyData
}

interface ICompanyData {
  id: string
  legalName: string
  tradeName: string
  cnpj: string
  email: string
  phone: string
}

export type { IUserData }
