import { Account } from "../../../domain/Account.ts";

const formatAccountResponse = (account: Account) => ({
  username: account.username,
  _id: account.id.value,
});

const formatAccountList = (accountList: Account[]) =>
  accountList.map((account) => formatAccountResponse(account));

export { formatAccountResponse, formatAccountList };
