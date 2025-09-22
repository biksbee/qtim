import { Request } from 'express';

export interface ParsedToken {
  readonly id: number;
  readonly email?: string;
}

export interface AuthRequest extends Request {
  token: ParsedToken
}

export interface FingerprintHashRequest {
  hash: string;
  components: Record<string, any>;
  [key: string]: any;
}

export interface FingerprintRequest extends AuthRequest {
  fingerprint: FingerprintHashRequest;
}
