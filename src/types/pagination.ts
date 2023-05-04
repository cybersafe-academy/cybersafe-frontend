interface IPagination {
  limit: number
  page: number
  offset: number
  data: any[]
}

export type { IPagination }
