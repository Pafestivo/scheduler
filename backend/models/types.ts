import { IntegrationType } from '@prisma/client';
import { Request } from 'express';
//
export interface UserRequest extends Request {
  user?: {
    hash: string;
    type: string;
  };
}

export interface IntegrationRequest extends Request {
  body: {
    hash: string;
    token: string;
    refreshToken: string;
    expiresAt: number;
    userEmail: string;
    googleEventId: string;
    provider: IntegrationType;
    googleReadFrom: string;
    googleWriteInto: string;
    summary: string;
    date: string;
    startTime: string;
    endTime: string;
    eventId: string;
  };
}
