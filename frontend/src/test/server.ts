import { setupServer } from 'msw/node'
import { authHandlers } from './handlers/auth.handlers'
import { examHandlers } from './handlers/exam.handlers'
import { lmsHandlers } from './handlers/lms.handlers'
import { libraryHandlers } from './handlers/library.handlers'
import { adminHandlers } from './handlers/admin.handlers'
import { attendanceHandlers } from './handlers/attendance.handlers'

export const server = setupServer(
  ...authHandlers,
  ...examHandlers,
  ...lmsHandlers,
  ...libraryHandlers,
  ...adminHandlers,
  ...attendanceHandlers,
)
