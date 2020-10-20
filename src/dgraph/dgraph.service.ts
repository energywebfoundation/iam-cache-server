import { Injectable } from '@nestjs/common';
import { DgraphClient, DgraphClientStub, Mutation, Operation } from 'dgraph-js';
import { ConfigService } from '@nestjs/config';
import { Policy } from 'cockatiel';

@Injectable()
export class DgraphService {
  private async getInstance(): Promise<DgraphClient> {
    if (this._instance) {
      return this._instance;
    }
    return this.createInstance();
  }

  private _instance: DgraphClient;
  private _stub: DgraphClientStub;

  constructor(private configService: ConfigService) {
    this.createInstance();
  }

  public async migrate() {
    const schema = `
      type Claim {
        id
        requester
        claimIssuer
        claimType
        token
        parentNamespace
        isAccepted
        createdAt
      }

      token: string .
      isAccepted: bool .
      createdAt: string .
      token: string .
      issuedToken: string .
      parentNamespace: string .
      claimIssuer: string @index(exact) .
      requester: string @index(exact) .
      claimType: string @index(exact) .
      parentNamespace: string @index(exact) .

      type: string @index(exact) .
      namespace: string @index(exact) .
      name: string @index(exact) .
      owner: string @index(exact) .
      id: string @index(exact) .
    `;
    const op = new Operation();
    op.setSchema(schema);
    await this._instance.alter(op);
    console.log('Migration completed');
  }

  public async mutate(data: unknown) {
    const instance = await this.getInstance();
    const txn = await instance.newTxn();
    const mu = new Mutation();
    mu.setSetJson(data);
    mu.setCommitNow(true);
    return txn.mutate(mu);
  }

  public async delete(uid: string) {
    const instance = await this.getInstance();
    const txn = await instance.newTxn();
    const mu = new Mutation();
    mu.setDeleteJson({uid})
    mu.setCommitNow(true);
    return txn.mutate(mu);
  }

  public async query(query: string, params?: Record<string, any>) {
    const instance = await this.getInstance();
    if (params) {
      return instance.newTxn({ readOnly: true }).queryWithVars(query, params);
    }
    return instance.newTxn({ readOnly: true }).query(query);
  }

  private async createInstance() {
    if (this._instance) {
      return this._instance;
    }

    let clientStub: DgraphClientStub;

    const DB_HOST = this.configService.get<string>('DGRAPH_GRPC_HOST');

    const policy = Policy.handleAll()
      .retry()
      .attempts(5)
      .delay(1000);
    return await policy.execute(async () => {
      clientStub = new DgraphClientStub(DB_HOST);
      console.log('connection successfuly');

      this._stub = clientStub;

      this._instance = new DgraphClient(clientStub);

      await this.migrate();

      return this._instance;
    });
  }

  public close() {
    // close existing connection;
    this._stub?.close();

    this._stub = null;
    this._instance = null;
  }
}
