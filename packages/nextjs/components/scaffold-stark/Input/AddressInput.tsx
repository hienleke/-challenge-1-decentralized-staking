import { useCallback } from "react";
import { blo } from "blo";
import { useDebounceValue } from "usehooks-ts";
import { CommonInputProps, InputBase } from "~~/components/scaffold-stark";
import { Address } from "@starknet-react/chains";
import { isAddress } from "~~/utils/scaffold-stark/common";
import Image from "next/image";

/**
 * Address input with ENS name resolution
 */
export const AddressInput = ({
  value,
  name,
  placeholder,
  onChange,
  disabled,
}: CommonInputProps<Address | string>) => {
  // Debounce the input to keep clean RPC calls when resolving ENS names
  // If the input is an address, we don't need to debounce it
  const [_debouncedValue] = useDebounceValue(value, 500);
  //const debouncedValue = isAddress(value) ? value : _debouncedValue;
  //const isDebouncedValueLive = debouncedValue === value;

  // If the user changes the input after an ENS name is already resolved, we want to remove the stale result
  //const settledValue = isDebouncedValueLive ? debouncedValue : undefined;

  // const {
  //   data: ensAddress,
  //   isLoading: isEnsAddressLoading,
  //   isError: isEnsAddressError,
  //   isSuccess: isEnsAddressSuccess,
  // } = useEnsAddress({
  //   name: settledValue,
  //   enabled: isDebouncedValueLive && isENS(debouncedValue),
  //   chainId: 1,
  //   cacheTime: 30_000,
  // });
  //
  //const [enteredEnsName, setEnteredEnsName] = useState<string>();
  // const {
  //   data: ensName,
  //   isLoading: isEnsNameLoading,
  //   isError: isEnsNameError,
  //   isSuccess: isEnsNameSuccess,
  // } = useEnsName({
  //   address: settledValue as Address,
  //   enabled: isAddress(debouncedValue),
  //   chainId: 1,
  //   cacheTime: 30_000,
  // });
  //
  // const { data: ensAvatar, isLoading: isEnsAvtarLoading } = useEnsAvatar({
  //   name: ensName,
  //   enabled: Boolean(ensName),
  //   chainId: 1,
  //   cacheTime: 30_000,
  // });

  // ens => address
  // useEffect(() => {
  //   if (!ensAddress) return;
  //
  //   // ENS resolved successfully
  //   setEnteredEnsName(debouncedValue);
  //   onChange(ensAddress);
  // }, [ensAddress, onChange, debouncedValue]);

  const handleChange = useCallback(
    (newValue: Address) => {
      //setEnteredEnsName(undefined);
      onChange(newValue);
    },
    [onChange],
  );

  // const reFocus =
  //   isEnsAddressError ||
  //   isEnsNameError ||
  //   isEnsNameSuccess ||
  //   isEnsAddressSuccess ||
  //   ensName === null ||
  //   ensAddress === null;

  return (
    <InputBase<Address>
      name={name}
      placeholder={placeholder}
      // error={ensAddress === null}
      value={value as Address}
      onChange={handleChange}
      // disabled={isEnsAddressLoading || isEnsNameLoading || disabled}
      disabled={disabled}
      // reFocus={reFocus}
      prefix={
        null
        // ensName ? (
        //   <div className="flex bg-base-300 rounded-l-full items-center">
        //     {isEnsAvtarLoading && <div className="skeleton bg-base-200 w-[35px] h-[35px] rounded-full shrink-0"></div>}
        //     {ensAvatar ? (
        //       <span className="w-[35px]">
        //         {
        //           // eslint-disable-next-line
        //           <img className="w-full rounded-full" src={ensAvatar} alt={`${ensAddress} avatar`} />
        //         }
        //       </span>
        //     ) : null}
        //     <span className="text-accent px-2">{enteredEnsName ?? ensName}</span>
        //   </div>
        // ) : (
        //   (isEnsNameLoading || isEnsAddressLoading) && (
        //     <div className="flex bg-base-300 rounded-l-full items-center gap-2 pr-2">
        //       <div className="skeleton bg-base-200 w-[35px] h-[35px] rounded-full shrink-0"></div>
        //       <div className="skeleton bg-base-200 h-3 w-20"></div>
        //     </div>
        //   )
        // )
      }
      suffix={
        // Don't want to use nextJS Image here (and adding remote patterns for the URL)
        // eslint-disable-next-line @next/next/no-img-element
        value && (
          <Image
            alt=""
            className="!rounded-full"
            src={blo(value as `0x${string}`)}
            width="35"
            height="35"
          />
        )
      }
    />
  );
};
