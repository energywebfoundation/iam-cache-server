export interface BaseEnsEntity {
  name: string;
  owner: string;
  namespace: string;
  definition: any;
}

export interface BaseEnsDefinition {
  description?: string;
  websiteUrl?: string;
  logoUrl?: string;
  others?: Record<string, unknown>;
}
