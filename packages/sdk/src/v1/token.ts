// Mintbase token contract JS implementation

import { TransactionArgs } from '../execute';
import {
  DEFAULT_MB_LOGO,
  TOKEN_METHOD_NAMES,
  Network,
  MB_TOKEN_FACTORY_ADDRESS,
} from '../constants';
import {
  DeployTokenContractArgs,
  AccountId,
  TransferTokenContractOwnership,
  MintArgs,
  AddRemoveMinterArgs,
  BatchChangeMinters,
  RevokeAccountArgs,
} from './token.types';

  const { symbol, icon, baseUri, reference, referenceHash } = metadata;

  const data = {
    // eslint-disable-next-line @typescript-eslint/camelcase
    owner_id: ownerId,
    metadata: {
      spec: 'nft-1.0.0',
      name: name.replace(/[^a-z0-9]+/gim, '').toLowerCase(),
      symbol: symbol.replace(/[^a-z0-9]+/gim, '').toLowerCase(),
      icon: icon ?? DEFAULT_MB_LOGO,
      // eslint-disable-next-line @typescript-eslint/camelcase
      base_uri: baseUri ?? null,
      reference: reference ?? null,
      // eslint-disable-next-line @typescript-eslint/camelcase
      reference_hash: referenceHash ?? null,
    },
  };

  return {
    contractAddress: factoryContractId || MB_TOKEN_FACTORY_ADDRESS,
    methodName: TOKEN_METHOD_NAMES.DEPLOY_TOKEN_CONTRACT,
    args: data,
  };
};

export const transferContractOwnership = (
  args: TransferTokenContractOwnership,
): TransactionArgs => {
  const { nftContractId, nextOwner, options } = args;
  const { keepMinters = true } = options;

  return {
    contractAddress: nftContractId,
    args: {
      // eslint-disable-next-line @typescript-eslint/camelcase
      new_owner: nextOwner,
      // eslint-disable-next-line @typescript-eslint/camelcase
      keep_old_minters: keepMinters,
    },
    methodName: TOKEN_METHOD_NAMES.TRANSFER_TOKEN_CONTRACT_OWNERSHIP,
  };
};

export const mint = (args: MintArgs): TransactionArgs => {
  const { nftContractId, options } = args;

  return {
    contractAddress: nftContractId,
    args: {},
    methodName: TOKEN_METHOD_NAMES.MINT,
  };
};

// TODO: do we want this method? How can we reuse `mint` instead of having an extra method
export const mintMore = (): void => {
  return;
};

export const addMinter = (args: AddRemoveMinterArgs): TransactionArgs => {
  const { minterId, nftContractId } = args;

  return {
    contractAddress: nftContractId,
    args: {
      // eslint-disable-next-line @typescript-eslint/camelcase
      account_id: minterId,
    },
    methodName: TOKEN_METHOD_NAMES.ADD_MINTER,
  };
};

export const removeMinter = (args: AddRemoveMinterArgs): TransactionArgs => {
  const { minterId, nftContractId } = args;

  return {
    contractAddress: nftContractId,
    args: {
      // eslint-disable-next-line @typescript-eslint/camelcase
      account_id: minterId,
    },
    methodName: TOKEN_METHOD_NAMES.REMOVE_MINTER,
  };
};

export const batchChangeMinters = (
  args: BatchChangeMinters,
): TransactionArgs => {
  const { addMinters, removeMinters, nftContractId } = args;

  return {
    contractAddress: nftContractId,
    args: {
      grant: addMinters.length > 0 ? addMinters : undefined,
      revoke: removeMinters.length > 0 ? removeMinters : undefined,
    },
    methodName: TOKEN_METHOD_NAMES.BATCH_CHANGE_MINTERS,
  };
};

export const revoke = (args: RevokeAccountArgs): TransactionArgs => {
  const { nftContractId, tokenId, accountToRevokeId } = args;

  if (accountToRevokeId) {
    return {
      contractAddress: nftContractId,
      args: {
        // eslint-disable-next-line @typescript-eslint/camelcase
        token_id: tokenId,
        // eslint-disable-next-line @typescript-eslint/camelcase
        account_id: accountToRevokeId,
      },
      methodName: TOKEN_METHOD_NAMES.TOKEN_ACCOUNT_REVOKE,
    };
  } else {
    return {
      contractAddress: nftContractId,
      args: {
        // eslint-disable-next-line @typescript-eslint/camelcase
        token_id: tokenId,
      },
      methodName: TOKEN_METHOD_NAMES.TOKEN_ACCOUNT_REVOKE_ALL,
    };
  }
};
