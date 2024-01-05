import server from "./server";
import { getAddress } from "./functions/crypto.functions";
import { toHex } from "ethereum-cryptography/utils";
import { secp256k1 } from "ethereum-cryptography/secp256k1.js";
import { Data } from "./data";






function recoveryKey(privateKey, signature, msgHash) {
  //return publicKey from privateKey
  const publicKey = secp256k1.getPublicKey(privateKey);
  //verify if publicKey from hashData match with publicKey from privateKey;
  const recovered = secp256k1.verify(signature, msgHash, toHex(publicKey));
  return recovered;
}




function Wallet({ address, setAddress, balance, setBalance, privateKey, setPrivateKey }) {

  async function onChange(evt) {
    const privateKey = evt.target.value;
    setPrivateKey(privateKey);
    //convert private to public
    const publicKey = secp256k1.getPublicKey(privateKey.slice(1));
    //convert public to address
    const address = toHex(getAddress(publicKey));
    setAddress(address);
    if (address) {
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>
      <label>
        Private Key
        <select value={privateKey} onChange={onChange}>
          <option >--Please choose an identity--</option>
           {Data.client.map((e) => 
          <option key={e.privateKey} value={e.privateKey}>{e.name}</option>
          )};
        </select>
      </label>
      <label>
        Wallet Address
      </label>
      <input
        disabled
          placeholder="Wallet Address"
          value={address}
        />

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
