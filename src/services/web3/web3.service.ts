import Web3 from 'web3';

export class Web3Service {
  public static web3Instance: Web3;

  public static async getWeb3(): Promise<Web3> {
    return new Promise(async (resolve, reject) => {
      try {
        const web3 = new Web3(Web3.givenProvider);
        Web3Service.web3Instance = web3;
        resolve(web3);
      } catch (error) {
        console.log("[Web3Service][getWeb3]:", error);
        reject(error);
      }
    });
  }
}
