import * as anchor from "@project-serum/anchor";
import { GifProject } from "../target/types/gif_project";

const { SystemProgram } = anchor.web3;

const main = async () => {
  console.log("Iniciando testes...");
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.GifProject as anchor.Program<GifProject>;
  const baseAccount = anchor.web3.Keypair.generate();

  const tx = await program.methods
    .initialize()
    .accounts({
      baseAccount: baseAccount.publicKey,
      user: provider.wallet.publicKey,
      systemProgram: SystemProgram.programId,
    })
    .signers([baseAccount])
    .rpc();

  console.log("Sua assinatura de transação", tx);

  let account = await (program.account as any).baseAccount.fetch(
    baseAccount.publicKey
  );
  console.log("👀 GIF Count", account.totalGifs.toString());

  await program.methods
    .addGif("https://c.tenor.com/OT8xEFxko88AAAAC/solana-stakefish.gif")
    .accounts({ baseAccount: baseAccount.publicKey, user: provider.wallet.publicKey, })
    .rpc();

  account = await program.account.baseAccount.fetch(baseAccount.publicKey);
  console.log("👀 GIF Count", account.totalGifs.toString());
  console.log("👀 GIF List", account.gifList);

  await program.methods
  .voteGif(0)
  .accounts({ baseAccount: baseAccount.publicKey, })
  .rpc();

  account = await program.account.baseAccount.fetch(baseAccount.publicKey);
  console.log("👀 GIF List", account.gifList);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

runMain();
