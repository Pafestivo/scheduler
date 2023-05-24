import { Request } from 'express';
//
export interface UserRequest extends Request {
  user?: {
    hash: string;
    type: string;
  };
}
