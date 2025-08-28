import type { User } from "@prisma/client"

export type PaginationDto = { 
  data: User[], 
  total: number,
  page: number,
  pageSize: number
}
