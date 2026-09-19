import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common'
import { Response } from 'express'
import { QueryFailedError } from 'typeorm'

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name)

  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()

    if (exception instanceof HttpException) {
      const status = exception.getStatus()
      const body = exception.getResponse()
      response.status(status).json(typeof body === 'string' ? { message: body } : body)
      return
    }

    if (exception instanceof QueryFailedError) {
      this.logger.error(exception.message, exception.stack)
      response.status(HttpStatus.BAD_REQUEST).json({ message: 'Database query failed' })
      return
    }

    this.logger.error(exception.message, exception.stack)
    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' })
  }
}
