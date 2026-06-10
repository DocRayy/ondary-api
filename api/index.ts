import type { IncomingMessage, ServerResponse } from 'http';
import { createApp } from '../src/bootstrap';

let server: ((req: IncomingMessage, res: ServerResponse) => void) | undefined;

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (!server) {
    const app = await createApp();
    await app.init();
    server = app.getHttpAdapter().getInstance();
  }

  const requestHandler = server!;
  return requestHandler(req, res);
}
