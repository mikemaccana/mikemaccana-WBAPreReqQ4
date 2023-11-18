import { Keypair } from "@solana/web3.js";
import { addKeypairToEnvFile } from "@solana-developers/node-helpers";
const log = console.log;

log(`Generating a new Solana wallet...`);

const keypair = Keypair.generate();
log(`You've generated a new Solana wallet: ${keypair.publicKey.toBase58()}`);
await addKeypairToEnvFile(keypair, "DEV_WALLET");
