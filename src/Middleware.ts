import { Injectable, NestMiddleware } from '@nestjs/common';

import xss from 'xss';

@Injectable()
export class XssMiddleware implements NestMiddleware {
  private clean(value: any): any {
    if (typeof value === 'string') {
      return xss(value);
    }

    if (Array.isArray(value)) {
      return value.map((v) => this.clean(v));
    }

    if (typeof value === 'object' && value !== null) {
      Object.keys(value).forEach((key) => {
        value[key] = this.clean(value[key]);
      });
    }

    return value;
  }

  use(req: any, res: any, next: () => void) {
    if (req.body) this.clean(req.body);
    if (req.query) this.clean(req.query);
    if (req.params) this.clean(req.params);

    next();
  }
}
