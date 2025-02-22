"use client";

import { useAccount } from "@starknet-react/core";
import { useDeployedContractInfo } from "~~/hooks/scaffold-stark";
import { useTargetNetwork } from "~~/hooks/scaffold-stark/useTargetNetwork";
import { useScaffoldReadContract } from "~~/hooks/scaffold-stark/useScaffoldReadContract";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-stark/useScaffoldWriteContract";
import { ETHToPrice } from "~~/components/contract/ETHToPrice";
import { Address } from "~~/components/scaffold-stark";
import { Address as AddressType } from "@starknet-react/chains";
import humanizeDuration from "humanize-duration";
import { useScaffoldMultiWriteContract } from "~~/hooks/scaffold-stark/useScaffoldMultiWriteContract";
import useScaffoldEthBalance from "~~/hooks/scaffold-stark/useScaffoldEthBalance";
import { id } from "ethers";
import Link from "next/link";


import { use, useEffect, useRef, useState } from "react";

function formatEther(weiValue: number) {
  const etherValue = weiValue / 1e18;
  return etherValue.toFixed(10);
}

export const ContributionContractInteraction = ({ address }: { address?: string }) => {
  const { address: connectedAddress } = useAccount();
  const { data: EaprotocolContract } = useDeployedContractInfo("Eaprotocol");
  const [loading, setLoading] = useState(false);

  const [foundationName, setFoundationName] = useState("");
  const [foundationId, setFoundationId] = useState(0);//useState<bigint>(0n);


  const [tempFoundation, setTempFoundation] = useState({});

  const [tempProject, setTempProject] = useState({});

  enum status_project {published, closed, withdrawn, paused, refunded}

  
  //const { data: ExampleExternalContact } = useDeployedContractInfo(
  //  "ExampleExternalContract",
  //);
  const { value: EapContractBalance } = useScaffoldEthBalance({
    address: EaprotocolContract?.address,
  });
  //const { value: exampleExternalContractBalance } = useScaffoldEthBalance({
  //  address: ExampleExternalContact?.address,
  //});

  const { targetNetwork } = useTargetNetwork();

  interface Foundation {
    id: number,
    name: string,
    address_account: AddressType,
    description: String,
    email: String,
    web_url: String,
    collected_funds: number,
    active: boolean,
    projects_count: number,
    created_at: number,
  }

  // Contract Read Actions
  const { data: get_foundation_by_address } = useScaffoldReadContract({
    contractName: "Eaprotocol",
    functionName: "get_foundation_by_address",
    args: [connectedAddress],
    watch: true,
  }) as unknown as { data: Foundation }; 

  const { data: get_project_by_foundation } = useScaffoldReadContract({
    contractName: "Eaprotocol",
    functionName: "get_project_by_foundation",
    args: [Number(foundationId)],
    watch: true,
  });  

  const { data: get_all_foundations } = useScaffoldReadContract({
    contractName: "Eaprotocol",
    functionName: "get_all_foundations",
    args: [],
    watch: true,
  }) as unknown as { data: Foundation[] };

  const getFoundationInfo = async () => {
    try {
      setFoundationName(get_foundation_by_address?.name)
      setFoundationId(get_foundation_by_address?.id)
    } catch (err) {
      //alert(err);
      console.error(err);
    }
  }
  
  const renderFoundations = () => {
    if (connectedAddress) {
      return (
        <div className="overflow-x-auto">
            <table className="table-md table-zebra">
              {/* head */}
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Projects Count</th>
                  <th>Collectec Funds</th>
                </tr>
              </thead>
              <tbody>
                {get_all_foundations?.map((foundation: Foundation, index) => (
                  //index ?
                  <>
                  
                  <tr className="hover">
                  
                    <th><Link href={`/contribute/${foundation.id}`}>{Number(foundation.id)}</Link></th>
                  
                    <td><Link href={`/contribute/${foundation.id}`}>{foundation.name}</Link></td>
                    <td><Link href={`/contribute/${foundation.id}`}>{foundation.description}</Link></td>
                    <td><Link href={`/contribute/${foundation.id}`}>{Number(foundation.projects_count)}</Link></td>
                    <td><Link href={`/contribute/${foundation.id}`}>{formatEther(Number(foundation.collected_funds))} ETH</Link></td>
                    {/* <td><Link href={`/contribute/${foundation.id}`}>{foundation.address_account.toString()}</Link></td> */}

                  </tr>
                  
                  </>
                  ))
                }
                
              </tbody>
              <tfoot>
                <tr>
                  <th></th>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Projects Count</th>
                  <th>Collectec Funds</th>
                </tr>
              </tfoot>
            </table>
          </div>
          
        
      );
    }
  };
  


  // In this case, whenever the value of `walletConnected` changes - this effect will be called
  useEffect(() => {
    // if wallet is not connected, create a new instance of Web3Modal and connect the MetaMask wallet
    /* if (!connectedAddress) {
      // Assign the Web3Modal class to the reference object by setting it's `current` value
      // The `current` value is persisted throughout as long as this page is open
      web3ModalRef.current = new Web3Modal({
        network: "Amoy",
        providerOptions: {},
        disableInjectedProvider: false,
      });
      //connectWallet();
      console.log("asdfasdf")

    }else  */
    if(connectedAddress){
      getFoundationInfo();
    }
  }, [foundationName]);

  const wrapInTryCatch =
    (fn: () => Promise<any>, errorMessageFnDescription: string) => async () => {
      try {
        await fn();
      } catch (error) {
        console.error(
          `Error calling ${errorMessageFnDescription} function`,
          error,
        );
      }
    };

  

  const calculateValueBar = (goal: number, remaining: number) => {
    let value = Math.floor(100 - (remaining * 100 / goal));
    return value;
  }

  


  return (
    
    <div>    
     <div className="flex items-center flex-col flex-grow w-full px-4 gap-12 text-neutral justify-center">
      
     
      <div
        className="flex flex-col items-center space-y-8 bg-base-100  border-8 border-secondary rounded-xl p-6 w-full max-w-full text-neutral"
      >
          <h1 className="">{connectedAddress || "Please connect your wallet first"}</h1>
          
         {renderFoundations()}
      </div>
    </div>
    
    </div>
  );
};
