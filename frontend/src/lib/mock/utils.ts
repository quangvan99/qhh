export const delay = (ms: number = 300) =>
  new Promise(resolve => setTimeout(resolve, ms + Math.random() * 200))

export function paginate<T>(items: T[], page: number = 1, pageSize: number = 20) {
  const start = (page - 1) * pageSize
  return {
    data: items.slice(start, start + pageSize),
    total: items.length,
    page,
    pageSize,
    totalPages: Math.ceil(items.length / pageSize),
  }
}
