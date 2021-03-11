export interface Fields {
  fieldType: string;
  label: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  minValue?: number;
  maxValue?: number;
  minDate?: Date;
  maxDate?: Date;
}

export interface Issuer {
  issuerType: string;
  did: string[];
  roleName?: string;
}

export interface EnrolmentPrecondition {
  type: string;
  conditions: string[];
}

/**
 * Interface describing generic Role's Definition model
 */
export interface RoleDefinition {
  roleType: string;
  roleName: string;
  fields?: Fields[];
  metadata?: Record<string, unknown>;
  issuer: Issuer;
  version: string;
  enrolmentPreconditions?: EnrolmentPrecondition[];
}
