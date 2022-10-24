use anchor_lang::prelude::*;

declare_id!("8AHx4FJEq4dya3mBHdBajfpTL69MRjUTzzpD8Dwm9uR");

#[program]
pub mod gif_project {
    use super::*;

    pub fn initialize(ctx: Context<StartStuffOff>) -> Result<()> {
        let base_account = &mut ctx.accounts.base_account;
        base_account.total_gifs = 0;
        Ok(())
      }

    pub fn add_gif(ctx: Context<GifAdd>, gif_link: String) -> Result <()> {
        // Obtem a referencia para a conta e incrementa total_gifs.
        let base_account = &mut ctx.accounts.base_account;
        let user = &mut ctx.accounts.user;

        let item = ItemStruct {
            gif_link: gif_link.to_string(),
            user_address: *user.to_account_info().key,
            votes: 0,
        };
        base_account.gif_list.push(item);
        base_account.total_gifs += 1;
        Ok(())
    }

    pub fn vote_gif(ctx: Context<GifVote>, index_gif: u16) -> Result <()> {
      let base_account = &mut ctx.accounts.base_account;
      let index: usize = index_gif as usize;
      base_account.gif_list[index].votes += 1;
      Ok(())
    }
}

#[derive(Accounts)]
pub struct StartStuffOff<'info> {
  #[account(init, payer = user, space = 9000)]
  pub base_account: Account<'info, BaseAccount>,
  #[account(mut)]
  pub user: Signer<'info>,
  pub system_program: Program <'info, System>,
}

#[derive(Accounts)]
pub struct GifAdd<'info> {
  #[account(mut)]
  pub base_account: Account<'info, BaseAccount>,
  #[account(mut)]
  pub user: Signer<'info>,
}

#[derive(Accounts)]
pub struct GifVote<'info> {
  #[account(mut)]
  pub base_account: Account<'info, BaseAccount>,
}

#[derive(Debug, Clone, AnchorSerialize, AnchorDeserialize)]
pub struct ItemStruct {
    pub gif_link: String,
    pub user_address: Pubkey,
    pub votes: u128,
}

#[account]
pub struct BaseAccount {
    pub total_gifs: u64,
    pub gif_list: Vec<ItemStruct>,
}

pub struct Initialize {}
