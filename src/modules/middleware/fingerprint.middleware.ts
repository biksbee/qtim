import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import * as fingerprint from 'express-fingerprint';

@Injectable()
export class FingerprintMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    fingerprint({
      parameters: [
        fingerprint.useragent,
        fingerprint.acceptHeaders,
        fingerprint.geoip,
      ],
    })(req, res, next);
  }
}
