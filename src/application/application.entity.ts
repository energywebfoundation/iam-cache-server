import {
  Column,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEnsDefinition, BaseEnsEntity } from '../shared/ENSBaseEntity';
import { Organization } from '../organization/organization.entity';
import { Role } from '../role/role.entity';

interface ApplicationDefinition extends BaseEnsDefinition {
  appName: string;
}

@Entity()
export class Application implements BaseEnsEntity {
  static create(data: Partial<Application>): Application {
    const entity = new Application();
    Object.assign(entity, data);
    return entity;
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Index()
  @Column()
  owner: string;

  @Index()
  @Column()
  namespace: string;

  @Column({ type: 'jsonb' })
  definition: ApplicationDefinition;

  @ManyToOne(
    () => Organization,
    org => org.apps,
  )
  parentOrg: Organization;

  @OneToMany(
    () => Role,
    role => role.parentApp,
  )
  roles: Role[];
}
