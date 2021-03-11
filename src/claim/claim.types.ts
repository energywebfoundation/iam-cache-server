export const NATS_EXCHANGE_TOPIC = 'claim.exchange';

export interface IMessage {
  id: string;
  requester: string;
  claimIssuer: string[];
}

export interface IClaimRequest extends IMessage {
  token: string;
  claimType: string;
  claimTypeVersion: string;
}

export interface IClaimIssuance extends IMessage {
  issuedToken: string;
  acceptedBy: string;
}

export interface IClaimRejection extends IMessage {
  isRejected: boolean;
}

export type DecodedClaimToken = {
  claimData: { claimType: string; claimTypeVersion: string };
};

export interface IClaim {
  id: string;
  requester: string;
  claimIssuer: string[];
  claimType: string;
  claimTypeVersion: string;
  token: string;
  issuedToken?: string;
  isAccepted: boolean;
  createdAt: string;
  acceptedBy?: string;
  isRejected?: boolean;
  parentNamespace: string;
}
