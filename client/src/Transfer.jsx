import { useState } from "react";
import server from "./server";
import { Data } from "./data";
import {  signMessage } from "./functions/crypto.functions";

function Transfer({ address, setBalance, privateKey }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    const transaction = {
        from: address,
        to: recipient,
        amount: parseInt(sendAmount),
      }

    //Sign transaction
    const sig = signMessage(Uint8Array.from(transaction), privateKey.slice(1));
    const sigParsed = JSON.parse(JSON.stringify(sig, (value) =>
            typeof value === 'bigint'
                ? value.toString()
                : value // return everything else unchanged
        ));
    
    //send transaction
    const signedTransaction = {
      transaction, sigParsed
    }


    try {
      const {
        data: { balance },
      } = await server.post(`send`, signedTransaction);
      setBalance(balance);
      alert("done !")
    } catch (e) {
      alert(e);
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
          {Data.address.map((e) => e.address != address ?
          <option  key={e.address} value={e.address}>{e.name}</option> : null
          )};
        </select>

        <label>
          Recipient Address
        </label>
    
        <input
          disabled
          placeholder="Recipient Address"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
