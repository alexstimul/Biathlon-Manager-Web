export const formatMilliseconds = (ms: number, withoutHours = true): string => {
  if (ms < 0) {
    throw new Error('Отрицательные значения не поддерживаются')
  }

  // Вычисляем компоненты времени
  const minutes = Math.floor((ms % 3600000) / 60000)
  const seconds = Math.floor((ms % 60000) / 1000)
  const milliseconds = Math.floor(ms % 1000)

  // Форматируем каждую часть с ведущими нулями
  const formattedMinutes = minutes.toString().padStart(2, '0')
  const formattedSeconds = seconds.toString().padStart(2, '0')
  const formattedMilliseconds = milliseconds.toString().slice(0, 2)

  const formattedTime = `${formattedMinutes}:${formattedSeconds}.${formattedMilliseconds}`

  if (withoutHours) {
    return formattedTime
  }

  const hours = Math.floor(ms / 3600000)
  const formattedHours = hours.toString().padStart(2, '0')
  return `${formattedHours}:` + formattedTime
}