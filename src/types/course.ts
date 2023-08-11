interface IContent {
  URL: string
  contentType: string
  title: string
}

interface ICourse {
  contentInHours: number
  contents: IContent[]
  description: string
  level: string
  thumbnailURL: string
  title: string
}

export type { ICourse }
