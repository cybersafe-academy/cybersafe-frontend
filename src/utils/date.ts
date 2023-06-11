function parseDateFormatToString(dateString: string): string {
    const dateObj: Date = new Date(Date.parse(dateString))

    const parsedDate: string = dateObj.toLocaleDateString(
      'en-GB',
      { year: 'numeric', month: '2-digit', day: '2-digit' }
    )

    return parsedDate
}

export default parseDateFormatToString