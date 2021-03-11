import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Application } from '../application/application.entity';
import { BaseEnsEntity } from '../shared/ENSBaseEntity';
import { Organization } from '../organization/organization.entity';
import { RoleDefinition } from './role.types';

@Entity()
export class Role implements BaseEnsEntity {
  static create(data: Partial<Role>): Role {
    const entity = new Role();
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
  definition: RoleDefinition;

  @ManyToOne(
    () => Organization,
    org => org.roles,
  )
  parentOrg: Organization;

  @ManyToOne(
    () => Application,
    app => app.roles,
  )
  parentApp: Application;
}
