interface ICourse {
  title: string
  description: string
  level: string
  thumbnailURL: string
  contentInHours: number
  contents: IContent[]
}

interface IContent {
  title: string
  contentType: string
  imageURL: string
  youtubeURL: string
  PDFURL: string
}

interface ICourseResponse {
  id: string
  title: string
  description: string
  level: string
  thumbnailURL: string
  contentInHours: number
  contents: IContent[]
}

export type { ICourse, IContent, ICourseResponse }
