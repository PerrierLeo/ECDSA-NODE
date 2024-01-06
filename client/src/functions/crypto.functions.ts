import { keccak256 } from "ethereum-cryptography/keccak";
import { secp256k1 } from "ethereum-cryptography/secp256k1.js";
import { toHex, hexToBytes } from "ethereum-cryptography/utils";
import { Hex, PrivKey } from "@noble/curves/abstract/utils";



export function hashMessage(message: string | Uint8Array): Uint8Array {
  //hexToBytes(message) => string to Uint8Array 
  if (typeof message == "string") {
    return keccak256(hexToBytes(message))
  }
  return keccak256(message);
}

export function getAddress(publicKey: string | Uint8Array): Uint8Array {
  //utf8ToBytes(message) => string to Uint8Array
  return hashMessage(publicKey).slice(-20);
}

export function signMessage(message: string | Uint8Array, privateKey: PrivKey): Hex | {
  r: bigint;
  s: bigint;
} {
  return secp256k1.sign(toHex(hashMessage(message)), privateKey);
}

export function verifyKey(signature: Hex | {
  r: bigint;
  s: bigint;
}, msgHash: Hex, publicKey: Hex): boolean {
  return secp256k1.verify(signature, msgHash, publicKey);
}


