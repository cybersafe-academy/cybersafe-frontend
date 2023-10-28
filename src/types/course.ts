interface IQuestion {
  answers: { id: string; text: string }[]
  id: string
  wording: string
}

interface ICourseInfo {
  questions: IQuestion[]
  descriptionPtBr: string
  description: string
  thumbnailURL: string
  contentURL: string
  titlePtBr: string
  title: string
}

interface ICourse {
  level: string
  thumbnailURL: string
  contentURL: string
  portugueseInfo?: ICourseInfo
  englishInfo?: ICourseInfo
}

export type { ICourse, ICourseInfo, IQuestion }
