import server from "./server";
import { keccak256 } from "ethereum-cryptography/keccak";
import { utf8ToBytes } from "ethereum-cryptography/utils";
import { toHex } from "ethereum-cryptography/utils";
import { secp256k1 } from "ethereum-cryptography/secp256k1.js";


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
  console.log(toHex(keccak256(publicKey).slice(-20)));
}



function Wallet({ address, setAddress, balance, setBalance, privateKey, setPrivateKey }) {
  
  async function onChange(evt) {
    console.log(evt.target.value);
    setPrivateKey(evt.target.value);
    const address = toHex(secp256k1.getPublicKey(privateKey.slice(1), false));
    setAddress(address.slice(-20));
     if (address) {
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
       setBalance(balance);
       console.log('aaa', balance);
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
          <option value="06c912fd37cdf5c81d4c0adb1ab7fa822ed253ab0ad9aa18d77257c88b29b718e">John Doe</option>
          <option value="06c912fd37cdf5c81d4c0adb1ab7fa822ed253ab0ad9aa18d77257c88b29b718f">Max Erman</option>
          <option value="06c912fd37cdf5c81d4c0adb1ab7fa822ed253ab0ad9aa18d77257c88b29b718g">Leo Leon</option>
        </select>
      </label>

      <label>
        Wallet Address
        <input disabled placeholder="Type an address, for example: 0x1" value={address.slice(-20)} ></input>
      </label>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
