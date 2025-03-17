import { Magic } from "magic-sdk";
import { KadenaExtension } from "@magic-ext/kadena";
import { DEFAULT_CHAIN_ID, NETWORK_ID } from "./utils/constants";
import { ChainId } from "@kadena/types";
import { getRpcUrl } from "./utils/get-rpc-url";

export const createMagic = (chainId?: ChainId) => {
  const magicApiKey = process.env.MAGIC_API_KEY || "pk_live_E758CF81CD61BB40";
  
  return new Magic(magicApiKey, {
    extensions: [
      new KadenaExtension({
        rpcUrl: getRpcUrl(chainId),
        chainId: chainId || DEFAULT_CHAIN_ID,
        networkId: NETWORK_ID,
        createAccountsOnChain: true,
      }),
    ],
  });
};
