import {
  Transaction,
  SystemProgram,
  Connection,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import { getKeypairFromEnvironment } from "@solana-developers/node-helpers";

import dotenv from "dotenv";
dotenv.config();

// Import our dev wallet keypair from the wallet file
const from = getKeypairFromEnvironment("DEV_WALLET");

// Our WBA public key
const to = getKeypairFromEnvironment("WBA_WALLET");

const connection = new Connection("https://api.devnet.solana.com");

const balance = await connection.getBalance(from.publicKey);

try {
  // Create a test transaction to calculate fees
  let testInstruction = SystemProgram.transfer({
    fromPubkey: from.publicKey,
    toPubkey: to.publicKey,
    lamports: balance,
  });
  const transaction = new Transaction();
  const blockhash = (await connection.getLatestBlockhash("confirmed"))
    .blockhash;

  transaction.instructions = [testInstruction];
  transaction.recentBlockhash = blockhash;
  transaction.feePayer = from.publicKey;

  // Calculate exact fee rate to transfer entire SOL amount out of account minus fees
  const feeForThisTransaction = await connection.getFeeForMessage(
    transaction.compileMessage(),
    "confirmed"
  );
  const fee = feeForThisTransaction.value || 0;

  // Remove our transfer instruction to replace it
  transaction.instructions.pop();

  // Replace it with the real instruction
  const realInstruction = SystemProgram.transfer({
    fromPubkey: from.publicKey,
    toPubkey: to.publicKey,
    lamports: balance - fee,
  });
  transaction.instructions = [realInstruction];

  // Sign transaction, broadcast, and confirm
  const signature = await sendAndConfirmTransaction(connection, transaction, [
    from,
  ]);
  console.log(`Success! Check out your TX here:
        https://explorer.solana.com/tx/${signature}?cluster=devnet`);
} catch (error) {
  console.error(`Oops, something went wrong: ${error.message}`);
}
