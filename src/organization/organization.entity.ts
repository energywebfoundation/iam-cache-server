import {
  Column,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Application } from '../application/application.entity';
import { BaseEnsDefinition, BaseEnsEntity } from '../shared/ENSBaseEntity';
import { Role } from '../role/role.entity';

interface OrganizationDefinition extends BaseEnsDefinition {
  orgName: string;
}

@Entity()
export class Organization implements BaseEnsEntity {
  static create(data: Partial<Organization>): Organization {
    const entity = new Organization();
    Object.assign(entity, data);
    return entity;
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Index()
  @Column()
  namespace: string;

  @Index()
  @Column()
  owner: string;

  @Column({ type: 'jsonb' })
  definition: OrganizationDefinition;

  @OneToMany(
    () => Application,
    app => app.parentOrg,
  )
  apps: Application[];

  @ManyToOne(
    () => Organization,
    org => org.subOrgs,
  )
  parentOrg: Organization;

  @OneToMany(
    () => Organization,
    org => org.parentOrg,
  )
  subOrgs: Organization[];

  @OneToMany(
    () => Role,
    role => role.parentOrg,
  )
  roles: Role[];
}
