import { Connection, Keypair, SystemProgram, PublicKey } from "@solana/web3.js";
import { Program, Wallet, AnchorProvider, Address } from "@coral-xyz/anchor";
import { WbaPrereq, IDL } from "./programs/wba_prereq";
import dotenv from "dotenv";
import { getKeypairFromEnvironment } from "@solana-developers/node-helpers";
dotenv.config();

const keypair = getKeypairFromEnvironment("WBA_WALLET");

const connection = new Connection("https://api.devnet.solana.com");

const ENROLL_PROGRAM_ID =
  "HC2oqz2p6DEWfrahenqdq2moUcga9c9biqRBcdK3XKU1" as Address;

// Github account
const github = Buffer.from("mikemaccana", "utf8");

// Create our anchor provider
const anchorProvider = new AnchorProvider(connection, new Wallet(keypair), {
  commitment: "confirmed",
});

// Create our program
const program = new Program<WbaPrereq>(IDL, ENROLL_PROGRAM_ID, anchorProvider);

// Create the PDA for our enrollment account
const enrollmentSeeds = [Buffer.from("prereq"), keypair.publicKey.toBuffer()];

const [enrollmentKey, _bump] = PublicKey.findProgramAddressSync(
  enrollmentSeeds,
  program.programId
);

try {
  const transactionHash = await program.methods
    .complete(github)
    .accounts({
      signer: keypair.publicKey,
      prereq: enrollmentKey,
      systemProgram: SystemProgram.programId,
    })
    .signers([keypair])
    .rpc();
  console.log(`Success! Check out your TX here:
    https://explorer.solana.com/tx/${transactionHash}?cluster=devnet`);
} catch (error) {
  console.error(`Oops, something went wrong: ${error}`);
}
