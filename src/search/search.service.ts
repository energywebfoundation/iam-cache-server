import { Injectable } from '@nestjs/common';
import { NamespaceEntities } from './search.types';

// const fields = ['name', 'namespace', 'websiteUrl', 'description'];

@Injectable()
export class SearchService {
  /**
   * returns App/Org/Role with namespace matching or similar to provided text
   * @param text fragment of namespace string
   * @return Array of Apps, Orgs and Roles
   */
  public async searchByText(text: string, types?: NamespaceEntities[]) {
    //TO-DO
    return [text, types];
  }
}
