import { Request } from 'express';

export type RequestWithUser = Request & { user: { _id: string } };
