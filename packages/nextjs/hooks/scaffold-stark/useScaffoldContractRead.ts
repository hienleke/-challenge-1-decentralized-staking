import { useTargetNetwork } from "./useTargetNetwork";
import { useContractRead } from "@starknet-react/core";
import { ExtractAbiFunctionNames } from "abi-wan-kanabi/dist/kanabi";
import { BlockIdentifier, BlockNumber, BlockTag } from "starknet";
import { useDeployedContractInfo } from "~~/hooks/scaffold-stark";
import {
  AbiFunctionOutputs,
  ContractAbi,
  ContractName,
  ExtractAbiFunctionNamesScaffold,
  UseScaffoldReadConfig,
} from "~~/utils/scaffold-stark/contract";

export const useScaffoldContractRead = <
  TContractName extends ContractName,
  TFunctionName extends ExtractAbiFunctionNamesScaffold<
    ContractAbi<TContractName>,
    "view"
  >,
>({
  contractName,
  functionName,
  args,
  ...readConfig
}: UseScaffoldReadConfig<TContractName, TFunctionName>) => {
  const { data: deployedContract } = useDeployedContractInfo(contractName);
  const { targetNetwork } = useTargetNetwork();

  return useContractRead({
    chainId: targetNetwork.id,
    functionName,
    address: deployedContract?.address,
    abi: deployedContract?.abi,
    watch: true,
    args,
    enabled: !Array.isArray(args) || !args.some((arg) => arg === undefined),
    blockIdentifier: "pending" as BlockNumber,
    ...(readConfig as any),
  }) as Omit<ReturnType<typeof useContractRead>, "data" | "refetch"> & {
    data: AbiFunctionOutputs<ContractAbi, TFunctionName> | undefined;
    // refetch: (options?: {
    //   throwOnError: boolean;
    //   cancelRefetch: boolean;
    // }) => Promise<AbiFunctionOutputs<ContractAbi, TFunctionName>>;
  };
};
