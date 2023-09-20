interface IQuestion {
  answers: { id: string; text: string }[]
  id: string
  wording: string
}

interface ICourseInfo {
  contentInHours: number
  questions: IQuestion[]
  description: string
  level: string
  thumbnailURL: string
  contentURL: string
  title: string
}

interface ICourse {
  portugueseInfo?: ICourseInfo
  englishInfo?: ICourseInfo
}

export type { ICourse }
