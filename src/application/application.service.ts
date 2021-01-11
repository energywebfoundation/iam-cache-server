import { Injectable } from '@nestjs/common';
import { DgraphService } from '../dgraph/dgraph.service';
import { roleDefinitionFullQuery } from '../Interfaces/Types';
import {
  ApplicationDefinitionDTO,
  ApplicationDTO,
  CreateApplicationData,
} from './ApplicationDTO';
import { validate } from 'class-validator';
import { Application } from './ApplicationTypes';

const baseQueryFields = `
uid
name
namespace
owner
definition ${roleDefinitionFullQuery}
`;

@Injectable()
export class ApplicationService {
  constructor(private readonly dgraph: DgraphService) {}

  /**
   * retrieves all existing applications
   */
  public async getAll() {
    const res = await this.dgraph.query(`
    query all($i: string){
      Data(func: eq(dgraph.type, "App")) {
        ${baseQueryFields}
      }
    }`);
    return res.getJson();
  }

  /**
   * Returns all Roles belonging to Application with matching namespace
   * @param namespace
   */
  public async getRoles(namespace: string) {
    const res = await this.dgraph.query(
      `
    query all($i: string){
      Data(func: eq(namespace, $i)) @filter(eq(dgraph.type, "App")) {
        namespace
        roles @filter(eq(dgraph.type, "Role")) {
          ${baseQueryFields}
        }
      }
    }`,
      { $i: namespace },
    );
    const app = res.getJson()?.Data[0];
    return app ? { Data: app.roles } : { Data: [] };
  }

  /**
   * returns single App with matching namespace
   * @param {String} namespace
   */
  public async getByNamespace(namespace: string): Promise<Application> {
    const res = await this.dgraph.query(
      `
    query all($i: string){
      Data(func: eq(namespace, $i)) @filter(eq(dgraph.type, "App")) {
        ${baseQueryFields}
      }
    }`,
      { $i: namespace },
    );
    const json = res.getJson();
    return json?.Data?.[0];
  }

  /**
   * return true if App with given namespace exists
   * @param namespace
   */
  public async exists(namespace: string) {
    return (await this.getByNamespace(namespace)) !== undefined;
  }

  /**
   * Method for adding new App to database
   * @param data object containing all needed App properties
   * @return id of newly added App
   */
  public async create(data: CreateApplicationData) {
    const appDefDTO = new ApplicationDefinitionDTO(data.definition);
    const appDTO = new ApplicationDTO(data, appDefDTO);

    const err = await validate(appDTO);

    if (err.length > 0) {
      console.log(err);
      return;
    }

    const queryData = {
      uid: '_:new',
      ...appDTO,
    };

    const res = await this.dgraph.mutate(queryData);

    return res.getUidsMap().get('new');
  }

  /**
   * Update existing App with given namespace
   * @param namespace target App's namespace
   * @param patch
   */
  public async updateNamespace(
    namespace: string,
    patch: CreateApplicationData,
  ) {
    const oldData = await this.getByNamespace(namespace);
    if (!oldData) {
      return;
    }

    const appDefDTO = new ApplicationDefinitionDTO({
      ...patch.definition,
      uid: oldData.definition.uid,
    });
    const appDTO = new ApplicationDTO(patch, appDefDTO);

    const err = await validate(appDTO);

    if (err.length > 0) {
      console.log(err);
      return;
    }

    const data = {
      uid: oldData.uid,
      ...appDTO,
    };

    await this.dgraph.mutate(data);

    return oldData.uid;
  }

  /**
   * Creates connection between Application and Role
   * @param id Id of target organization
   * @param roleId
   */
  public async addRole(id: string, roleId: string) {
    const data = {
      uid: id,
      roles: [
        {
          uid: roleId,
        },
      ],
    };

    await this.dgraph.mutate(data);

    return id;
  }
}
