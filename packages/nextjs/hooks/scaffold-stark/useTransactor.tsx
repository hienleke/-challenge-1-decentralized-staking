import { publicProvider, useAccount, useProvider } from "@starknet-react/core";
import { WalletProvider } from "get-starknet-core";
import {
  AccountInterface,
  InvokeFunctionResponse,
  RpcProvider,
} from "starknet";
import {
  getBlockExplorerTxLink,
  // getParsedError,
  notification,
} from "~~/utils/scaffold-stark";
import { useTargetNetwork } from "./useTargetNetwork";

type TransactionFunc = (
  tx: () => Promise<InvokeFunctionResponse> | Promise<string>,
  // | SendTransactionParameters,
) => Promise<string | undefined>;

/**
 * Custom notification content for TXs.
 */
const TxnNotification = ({
  message,
  blockExplorerLink,
}: {
  message: string;
  blockExplorerLink?: string;
}) => {
  return (
    <div className={`flex flex-col ml-1 cursor-default`}>
      <p className="my-0">{message}</p>
      {blockExplorerLink && blockExplorerLink.length > 0 ? (
        <a
          href={blockExplorerLink}
          target="_blank"
          rel="noreferrer"
          className="block link text-md"
        >
          check out transaction
        </a>
      ) : null}
    </div>
  );
};

/**
 * Runs Transaction passed in to returned function showing UI feedback.
 * @param _walletClient - Optional wallet client to use. If not provided, will use the one from useWalletClient.
 * @returns function that takes in transaction function as callback, shows UI feedback for transaction and returns a promise of the transaction hash
 */
export const useTransactor = (
  _walletClient?: AccountInterface,
): TransactionFunc => {
  let walletClient = _walletClient;
  const { account } = useAccount();
  const { targetNetwork } = useTargetNetwork();
  if (walletClient === undefined && account) {
    walletClient = account;
  }

  const result: TransactionFunc = async (tx) => {
    if (!walletClient) {
      notification.error("Cannot access account");
      console.error("⚡️ ~ file: useTransactor.tsx ~ error");
      return;
    }

    let notificationId = null;
    let transactionHash:
      | Awaited<InvokeFunctionResponse>["transaction_hash"]
      | undefined = undefined;
    try {
      const networkId = await walletClient.getChainId();
      // Get full transaction from public client
      const publicClient = new RpcProvider({
        nodeUrl: targetNetwork.rpcUrls.public.http[0],
      });

      notificationId = notification.loading(
        <TxnNotification message="Awaiting for user confirmation" />,
      );
      if (typeof tx === "function") {
        // Tx is already prepared by the caller
        const result = await tx();
        if (typeof result === "string") {
          transactionHash = result;
        } else {
          transactionHash = result.transaction_hash;
        }
      } else if (tx != null) {
        transactionHash = (await walletClient.execute(tx)).transaction_hash;
      } else {
        throw new Error("Incorrect transaction passed to transactor");
      }
      notification.remove(notificationId);

      const blockExplorerTxURL = networkId
        ? getBlockExplorerTxLink(targetNetwork.network, transactionHash)
        : "";

      notificationId = notification.loading(
        <TxnNotification
          message="Waiting for transaction to complete."
          blockExplorerLink={blockExplorerTxURL}
        />,
      );

      notification.remove(notificationId);

      notification.success(
        <TxnNotification
          message="Transaction completed successfully!"
          blockExplorerLink={blockExplorerTxURL}
        />,
        {
          icon: "🎉",
        },
      );
    } catch (error: any) {
      if (notificationId) {
        notification.remove(notificationId);
      }
      console.error("⚡️ ~ file: useTransactor.ts ~ error", error);
      const message = error.toString();
      notification.error(message);
      throw error;
    }

    return transactionHash;
  };

  return result;
};
