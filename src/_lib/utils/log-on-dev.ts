export function logOnDev(...message: any[]) {
  if (process.env.NODE_ENV === 'development') {
    console.log(...message)
  }
}
