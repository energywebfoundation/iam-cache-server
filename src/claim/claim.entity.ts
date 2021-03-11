import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';
import { IClaim } from './claim.types';

@Entity()
export class Claim implements IClaim {
  static create(data: Partial<Claim>): Claim {
    const entity = new Claim();
    Object.assign(entity, data);
    return entity;
  }

  @PrimaryColumn()
  id: string;

  @Column()
  requester: string;

  @Column({ type: 'text', array: true })
  claimIssuer: string[];

  @Column()
  claimType: string;

  @Column()
  claimTypeVersion: string;

  @Column()
  token: string;

  @Column({ nullable: true })
  issuedToken: string | null;

  @Column({ type: 'bool', default: false })
  isAccepted: boolean;

  @CreateDateColumn()
  createdAt: string;

  @Column({ nullable: true })
  acceptedBy: string | null;

  @Column({ nullable: true, type: 'bool', default: false })
  isRejected: boolean | null;

  @Column()
  parentNamespace: string;
}
