import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import * as morgan from 'morgan';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly filterFields: string[] = [
    'password',
    'token',
    'authorization',
  ]; // Campos que você deseja filtrar

  use(req: Request, res: any, next: NextFunction) {
    // Função para filtrar os campos de um objeto
    const filterObject = (obj: any) => {
      if (typeof obj === 'object' && obj !== null) {
        this.filterFields.forEach((field) => {
          if (obj[field] !== undefined) {
            obj[field] = 'FILTERED'; // Substitui pelo valor "FILTERED"
          }
        });
      }
      return obj;
    };

    // Filtra o corpo da requisição
    const reqBody = filterObject(JSON.parse(JSON.stringify(req.body)));

    // Filtra os cabeçalhos da requisição
    const reqHeaders = filterObject({ ...req.headers });

    // Captura o corpo da resposta
    const originalSend = res.send.bind(res);
    res.send = function (body: any) {
      const resBody = filterObject(JSON.parse(body));

      morgan(
        function (tokens, req, res) {
          return [
            tokens.method(req, res),
            tokens.url(req, res),
            tokens.status(req, res),
            tokens.res(req, res, 'content-length'),
            '-',
            tokens['response-time'](req, res),
            'ms',
            'Request Body:',
            JSON.stringify(reqBody),
            ' | Request Headers:',
            JSON.stringify(reqHeaders),
            ' | Response Body:',
            JSON.stringify(resBody),
          ].join(' ');
        },
        {
          stream: {
            write: (message) => Logger.log(message.trim()), // Use o logger do winston
          },
        },
      )(req, res, () => {
        originalSend(body); // Envia a resposta original
      });
    };

    // Chama o próximo middleware
    next();
  }
}
