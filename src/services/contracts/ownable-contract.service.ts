import _ from 'lodash';

import { Web3Service } from '../web3/web3.service';

export abstract class OwnableContractService {
  protected readonly contract: any;

  constructor(CONTRACT_ABI: any, CONTRACT_ADDRESS: string) {
    this.contract = new Web3Service.web3Instance.eth.Contract(
      CONTRACT_ABI,
      CONTRACT_ADDRESS
    );
  }

  public async isOwner(address: string): Promise<boolean> {
    const owner: string = await this.contract.methods.owner().call();
    return _.isEqual(owner, address);
  }
}
