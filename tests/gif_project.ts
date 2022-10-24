import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { GifProject } from "../target/types/gif_project";

describe("gif_project", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.GifProject as Program<GifProject>;

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods.initialize().rpc();
    console.log("Your transaction signature", tx);
  });
});
