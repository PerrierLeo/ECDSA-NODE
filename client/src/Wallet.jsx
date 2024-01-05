import server from "./server";
import { keccak256 } from "ethereum-cryptography/keccak";
import { utf8ToBytes } from "ethereum-cryptography/utils";
import { toHex } from "ethereum-cryptography/utils";
import { secp256k1 } from "ethereum-cryptography/secp256k1.js";
import { Data } from "./data";


function hashMessage(data) {
  //return hash message
  return keccak256(utf8ToBytes(data));
}

function signMessage(dataToSign, privateKey) {
  //return signature
  return secp256k1.sign(hashMessage(dataToSign), privateKey, { recovery: 1 });
}


function recoveryKey(privateKey, signature, msgHash) {
  //return publicKey from privateKey
  const publicKey = secp256k1.getPublicKey(privateKey, false);
  //verify if publicKey from hashData match with publicKey from privateKey;
  const recovered = secp256k1.verify(signature, msgHash, toHex(publicKey));
  return recovered;
}

function getAddress(publicKey) {
  //convert publicKey into wallet Address
  return toHex(keccak256(publicKey).slice(-20));
}


function Wallet({ address, setAddress, balance, setBalance, privateKey, setPrivateKey }) {

  async function onChange(evt) {
    const privateKey = evt.target.value;
    setPrivateKey(privateKey);
    //convert private to public
    const publicKey = secp256k1.getPublicKey(privateKey.slice(1));
    //convet public to address
    const address = toHex(keccak256(publicKey).slice(-20));
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
