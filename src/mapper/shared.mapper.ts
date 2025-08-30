import CryptoJs from "crypto-js";


const cryptoKey = process.env.CRYPTO_KEY || "mysecretkey";

export class SharedMapper {

  static getDecryptedValue = (encryptedValue: string) => {
    const bytes = CryptoJs.AES.decrypt(encryptedValue, cryptoKey);
    return bytes.toString(CryptoJs.enc.Utf8);
  };


  static convertId = (id: string): bigint => {
    return BigInt(this.getDecryptedValue(id));
  }
}
