const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "04a87effb1073ca076de6549515b816336ec6ab7cb2db4619d2ac5ec87aab875141ca3906589d4452fb33da9312dc2f078bd2d056901ba9e29ebb5041584d6a82e": 150,
  "043adac8071dafbfda62cf74a9ebec714f4585476c8592a6709359f7daef76fba22d29e1c88ff1ea71fc913bf3dff80c47df504a82df6fd85dd9c3f7e579d845ce": 100,
  "04a8c659b7284c06a37c9f9654249972c7b112c8580367444b7be4fc8c2f17504e5e55bd0321c28121cd0a36769fcf2ef300c05b2f86f8a495b6210353715d64f3": 50,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount } = req.body;

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
