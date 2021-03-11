import {
  documentFromLogs,
  mergeLogs,
} from '@ew-did-registry/did-ethr-resolver';
import {
  IDIDDocument,
  IDIDLogData,
} from '@ew-did-registry/did-resolver-interface';
import { IDidStore } from '@ew-did-registry/did-store-interface';
import { bigNumberify } from 'ethers/utils';
import { DIDDocumentDTO, IPFSClaimDTO } from './did.dto';
import { DID } from './did.types';

export const DID_DgraphType = 'DIDDocument';

export class DIDDocumentEntity {
  constructor(did: DID, didDocument?: DIDDocumentDTO) {
    this.id = did.id;
    if (didDocument) {
      this.logData = parseLogs(didDocument.logs);
      this.claims =
        didDocument.claims?.map(
          c => new IPFSClaimDTO(c.jwt, c.serviceEndpoint, c.uid),
        ) ?? new Array<IPFSClaimDTO>();
      this.uid = didDocument.id;
    } else {
      this.claims = new Array<IPFSClaimDTO>();
      this.uid = '_:new';
    }

    function parseLogs(logs: string): IDIDLogData {
      const knownBigNumberProperties = new Set<string>();
      knownBigNumberProperties.add('validity');
      knownBigNumberProperties.add('topBlock');

      // Operations on IDIDLogData expect some properties to be BigNumbers
      const bigNumberReviver = (key: string, value) => {
        if (knownBigNumberProperties.has(key) && '_hex' in value) {
          return bigNumberify(value['_hex']);
        }
        return value;
      };
      return JSON.parse(logs, bigNumberReviver) as IDIDLogData;
    }
  }

  /**
   * DID value, i.e. 'did:ethr:{address}'
   */
  readonly id: string;

  /**
   * Using IDIDLogData so that new log data can be incrementally added
   */
  private logData: IDIDLogData;

  /**
   * IPFS Claims corresponding to service endpoint data
   */
  private claims: IPFSClaimDTO[];

  readonly uid: string;
  readonly 'dgraph.type' = DID_DgraphType;

  /**
   * Resolves a DIDDocument from the entity's logs
   * @returns {IDIDDocument} Resolved DID Document
   */
  async getResolvedDIDDocument(): Promise<IDIDDocument> {
    return await documentFromLogs(this.id, Array(this.logData));
  }

  getDTO(): DIDDocumentDTO {
    const serializedLogs = JSON.stringify(this.logData);
    return {
      id: this.id,
      logs: serializedLogs,
      claims: this.claims,
    };
  }

  getLogData(): IDIDLogData {
    return this.logData;
  }

  /**
   * Add new log data to existing logs
   * @param newLogData Log data to merge in
   */
  updateLogData(newLogData: IDIDLogData): void {
    const logsToMerge = new Array<IDIDLogData>();
    if (this.logData) {
      logsToMerge.push(this.logData);
    }
    logsToMerge.push(newLogData);
    const mergedLogs = mergeLogs(logsToMerge);
    mergedLogs.topBlock = newLogData.topBlock;
    this.logData = mergedLogs;
  }

  /**
   * Sets logData to new data
   * Note: cached claims are maintained
   * @param newLogData Log data to set
   */
  setLogData(newLogData: IDIDLogData): void {
    this.logData = newLogData;
  }

  /**
   * Gets claims in Map format
   * @returns {Map<string, string>} A map of serviceEnpoints to jwt
   */
  getCachedClaimsMap(): Map<string, string> {
    return new Map(this.claims.map(c => [c.serviceEndpoint, c.jwt]));
  }

  /**
   * Caches all claims from IPFS which aren't yet cached
   * @param resolver
   * @param ipfsStore
   */
  async cacheIPFSClaims(ipfsStore: IDidStore) {
    const resolvedDocument = await this.getResolvedDIDDocument();
    const endpoints = this.getUncachedServiceEndpoints(resolvedDocument);
    await Promise.all(
      endpoints.map(async endpoint => {
        const jwt = await ipfsStore.get(endpoint);
        this.claims.push(new IPFSClaimDTO(jwt, endpoint));
      }),
    );
  }

  /**
   * Gets claims which are present in the targetDocument but not in the entity
   * @param targetDocument
   * @returns {string[]} serviceEndpoints of missing claims
   */
  private getUncachedServiceEndpoints(targetDocument: IDIDDocument): string[] {
    const cachedClaims = this.getCachedClaimsMap();
    if (!targetDocument.service) {
      return new Array<string>();
    } else {
      return targetDocument.service
        ?.filter(s => !cachedClaims.has(s.serviceEndpoint))
        .map(s => s.serviceEndpoint);
    }
  }
}
