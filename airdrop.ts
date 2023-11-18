import { Connection, LAMPORTS_PER_SOL as SOLANA } from "@solana/web3.js";
import { getKeypairFromEnvironment } from "@solana-developers/node-helpers";
import dotenv from "dotenv";

dotenv.config();

const keypair = getKeypairFromEnvironment("DEV_WALLET");

const connection = new Connection("https://api.devnet.solana.com");

// Claim 2 devnet SOL tokens
try {
  const txhash = await connection.requestAirdrop(keypair.publicKey, 2 * SOLANA);
  console.log(
    `Success! Check out your TX here: https://explorer.solana.com/tx/${txhash}?cluster=devnet`
  );
} catch (error) {
  console.error(`Oops, something went wrong: ${error.message}`);
}
