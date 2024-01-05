const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "2bc4a6ba61d45978aef5fe9b43aa23715fde6aec": 150,
  "29a725e6f6ac1c343f39e2d2c7a9ddf85a9ceb41": 100,
  f4d7a283621854fe7a174715bc9d4d1ff05faf4f: 50,
};

//think to convert recipient address into publicKey if we can?

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { transaction } = req.body;
  const { amount, to, from } = transaction;
  const TARGET_DIFFICULTY =
    BigInt(0x0fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffn);

  //Création du block penser a verifier avant la signature

  let block = { transaction };
  block.nonce = 0;
  let hash;
  while (true) {
    hash = SHA256(JSON.stringify(block)).toString();
    if (BigInt(`0x${hash}`) < TARGET_DIFFICULTY) {
      break;
    }
    block.nonce++;
  }
  // transaction.nonce = 0;
  // let hash;

  // hash = SHA256(JSON.stringify(transaction)).toString();

  // console.log(hash);

  // while (true) {}

  // setInitialBalance(transaction.from);
  // setInitialBalance(transaction.to);

  // if (balances[from] < amount) {
  //   res.status(400).send({ message: "Not enough funds!" });
  // } else {
  //   balances[from] -= amount;
  //   balances[to] += amount;
  //   res.send({ balance: balances[from] });
  // }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
