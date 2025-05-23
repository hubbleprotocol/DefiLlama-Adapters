const { sumTokens2 } = require("../helper/solana");
const { PublicKey } = require("@solana/web3.js");
const { getConnection } = require("../helper/solana");

async function solanaTvl(api) {
  const connection = getConnection();
  const lookupTableAddress = new PublicKey("eP8LuPmLaF1wavSbaB4gbDAZ8vENqfWCL5KaJ2BRVyV");
 
  const lookupTableAccount = (
    await connection.getAddressLookupTable(lookupTableAddress)
  ).value;

  const tokenAccounts = []
  for (let i = 0; i < lookupTableAccount.state.addresses.length; i++) {
    const address = lookupTableAccount.state.addresses[i];
    tokenAccounts.push(address.toBase58());
  }

  return sumTokens2({
    tokenAccounts,
    balances: api.getBalances()
  })
}

async function bscTvl(api) {
  const balance = await api.call({
    target: "0x77c9b49a58325131D08F9dC120388f20c57c2572",
    abi: 'erc20:balanceOf',
    params: ["0xEDBcdD0A45Fd8EBa749fFc10205c65CeA54336D5"],
  });

  api.add("0x77c9b49a58325131D08F9dC120388f20c57c2572", balance);
  return api.getBalances();
}

module.exports = {
  timetravel: false,
  methodology: "TVL is calculated by summing the value of the traders' vault, LP vault, and earn vault.",
  solana: { tvl: solanaTvl },
  bsc: { tvl: bscTvl }
};
