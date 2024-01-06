import { useState } from "react";
import server from "./server";
import { Data } from "./data";
import { signMessage, getAddress, hashMessage } from "./functions/crypto.functions";
import { toHex } from "ethereum-cryptography/utils";
import { utf8ToBytes } from "ethereum-cryptography/utils";



function Transfer({ setBalance, privateKey, publicKey }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    const tx = {
        from: publicKey,
        to: recipient,
        amount: parseInt(sendAmount),
      }

    //Sign transaction
    const sig = signMessage(Uint8Array.from(tx), privateKey.slice(1));
    console.log("sig",sig);
    const sigParsed = JSON.parse(JSON.stringify(sig, (key, value) =>
            typeof value === 'bigint'
                ? value.toString()
                : value 
    ));
    
    //send transaction
    const tmp = {
      tx, sigParsed
    }

    try {
      const {
        data: { balance },
      } = await server.post(`send`, tmp);
      setBalance(balance);
      alert("done !")
    } catch (e) {
      alert(e.response.data.msg);
    }
  }


  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <select value={recipient} onChange={setValue(setRecipient)}>
          <option value={null}>--Please choose an recipient--</option>
          {Data.address.map((e, i) => e.publicKey != publicKey ?
          <option key={i} value={e.publicKey}>{e.name}</option> : null
          )};
        </select>

        <label>
          Recipient Address
        </label>
    
        <input
          disabled
          placeholder="Recipient Address" 
          value={recipient ? toHex(getAddress(recipient)) : ''}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
