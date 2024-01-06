import server from "./server";
import { getAddress } from "./functions/crypto.functions";
import { toHex } from "ethereum-cryptography/utils";
import { secp256k1 } from "ethereum-cryptography/secp256k1.js";
import { Data } from "./data";

function Wallet({ publicKey, setPublicKey, balance, setBalance, privateKey, setPrivateKey }) {
  async function onChange(evt) {
    const privateKey = evt.target.value;
    setPrivateKey(privateKey);

    //convert private to public
    const publicKey = toHex(secp256k1.getPublicKey(privateKey.slice(1), false));
    setPublicKey(publicKey);
    if (publicKey) {
      const {
        data: { balance },
      } = await server.get(`balance/${publicKey}`);
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
          value={ publicKey ? toHex(getAddress(publicKey)) : ''}
        />

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
