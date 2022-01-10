import ColourMapper from '@src/mappers/colour/colour.mapper';
import Colour from '@src/models/Colour.model';

import { HEX_COLOUR_CONTRACT_ABI, HEX_COLOUR_CONTRACT_ADDRESS } from '../data/contracts';
import { OwnableContractService } from './ownable-contract.service';

export class HexColourContractService extends OwnableContractService {
  constructor() {
    super(HEX_COLOUR_CONTRACT_ABI as any, HEX_COLOUR_CONTRACT_ADDRESS);
  }

  public async doesColourExist(hexCode: string): Promise<boolean> {
    return this.contract.methods.doesColourExist(hexCode).call();
  }

  public async mint(hexCode: string, userAccount: string): Promise<any> {
    return this.contract.methods.mint(hexCode).send({ from: userAccount });
  }

  public async fetchColour(id: number): Promise<Colour> {
    return this.contract.methods
      .colours(id - 1)
      .call()
      .then((colourData: Record<string, any>) => {
        return ColourMapper.transform(colourData);
      });
  }

  public async approve(
    addressToApprove: string,
    tokenId: number,
    userAccount: string
  ): Promise<void> {
    return this.contract.methods
      .approve(addressToApprove, tokenId)
      .send({ from: userAccount });
  }

  public get address(): string {
    return HEX_COLOUR_CONTRACT_ADDRESS;
  }
}
