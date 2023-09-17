interface IQuestion {
  question: string
  answer: string
}

interface ICourseInfo {
  contentInHours: number
  questions: IQuestion[]
  description: string
  level: string
  thumbnailURL: string
  videoURL: string
  title: string
}

interface ICourse {
  portugueseInfo?: ICourseInfo
  englishInfo?: ICourseInfo
}

export type { ICourse }
