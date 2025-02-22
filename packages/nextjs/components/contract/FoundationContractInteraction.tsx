"use client";

import { useAccount } from "@starknet-react/core";
import { useDeployedContractInfo } from "~~/hooks/scaffold-stark";
import { useTargetNetwork } from "~~/hooks/scaffold-stark/useTargetNetwork";
import { useScaffoldReadContract } from "~~/hooks/scaffold-stark/useScaffoldReadContract";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-stark/useScaffoldWriteContract";
import { ETHToPrice } from "~~/components/contract/ETHToPrice";
import { Address } from "~~/components/scaffold-stark";
import humanizeDuration from "humanize-duration";
import { useScaffoldMultiWriteContract } from "~~/hooks/scaffold-stark/useScaffoldMultiWriteContract";
import useScaffoldEthBalance from "~~/hooks/scaffold-stark/useScaffoldEthBalance";
import { id } from "ethers";

import { use, useEffect, useRef, useState } from "react";

function formatEther(weiValue: number) {
  const etherValue = weiValue / 1e18;
  return etherValue.toFixed(1);
}

export const FoundationContractInteraction = ({ address }: { address?: string }) => {
  const { address: connectedAddress } = useAccount();
  const { data: EaprotocolContract } = useDeployedContractInfo("Eaprotocol");
  const [loading, setLoading] = useState(false);

  const [foundationName, setFoundationName] = useState("");
  const [foundationId, setFoundationId] = useState(0);//useState<bigint>(0n);


  const [tempFoundation, setTempFoundation] = useState<Foundation>({
    id: 0,
    name: "",
    address_account: null,
    description: "",
    email: "",
    web_url: "",
    collected_funds: 0,
    active: false,
    projects_count: 0,
    created_at: 0,
  });

  const [tempProject, setTempProject] = useState<Project>({
    id: 0,
    id_by_foundation: 0,
    name: "",
    foundation_id: 0,
    description: "",
    goal: 0,
    balance: 0,
    remaining_amount: 0,
    contributions: 0,
    status_project: "",
    changed_name: 0,
    created_at: 0,
  });

  //const [projectId, setProjectId] = useState({});

  let project_id = 0;

  interface Foundation {
    id: number,
    name: string,
    address_account: unknown,
    description: string,
    email: string,
    web_url: string,
    collected_funds: number,
    active: boolean,
    projects_count: number,
    created_at: number,
  }

  interface Project {
    id: number;
    id_by_foundation: number;
    name: string;
    foundation_id: number;
    description: string;
    goal: number;
    balance: number;
    remaining_amount: number;
    contributions: number;
    status_project: string;
    changed_name: number;
    created_at: number;
  }


  enum status_project {published, closed, withdrawn, paused, refunded}

   /* const projectStatus = {
        0: <Message severity="info" text="Published" />,
        1: <Message severity="success" text="Closed" />,
        2: <Message severity="success" text="Withdrawn" />,
        3: <Message severity="warn" text="Paused" />,
        4: <Message severity="error" text="Refunded" />
    } */

  
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

  // Contract Read Actions
  const { data: get_foundation_by_address } = useScaffoldReadContract({
    contractName: "Eaprotocol",
    functionName: "get_foundation_by_address",
    args: [connectedAddress],
    watch: true,
  })as unknown as { data: Foundation };

  const { data: get_project_by_foundation } = useScaffoldReadContract({
    contractName: "Eaprotocol",
    functionName: "get_project_by_foundation",
    args: [Number(foundationId)],
    watch: true,
  })as unknown as { data: Project[] }; 

  const getFoundationInfo = async () => {
    try {
      setFoundationName(get_foundation_by_address?.name)
      setFoundationId(get_foundation_by_address?.id)
    } catch (err) {
      //alert(err);
      console.error(err);
    }

  }

   
   /* const { data: get_foundation_by_id } = useScaffoldReadContract({
    contractName: "Eaprotocol",
    functionName: "get_foundation_by_id",
    args: [connectedAddress ?? ""],
    watch: true,
  }); */ 

  /* const { data: isStakingCompleted } = useScaffoldReadContract({
    contractName: "Eaprotocol",
    functionName: "completed",
    watch: true,
  });

  const { data: myStake } = useScaffoldReadContract({
    contractName: "Eaprotocol",
    functionName: "balances",
    args: [connectedAddress ?? ""],
    watch: true,
  });

  

  const { sendAsync: withdrawETH } = useScaffoldWriteContract({
    contractName: "Eaprotocol",
    functionName: "withdraw",
  });

  const { sendAsync: stakeEth } = useScaffoldMultiWriteContract({
    calls: [
       {
        contractName: "Eth",
        functionName: "approve",
        args: [EaprotocolContract?.address ?? "", 5 * 10 ** 17],
      }, 
      {
        contractName: "Eaprotocol",
        functionName: "stake",
        args: [5 * 10 ** 17],
      },
    ],
  }); */

  const { sendAsync: add_foundation } = useScaffoldWriteContract({
    contractName: "Eaprotocol",
    functionName: "add_foundation",
    args: [
      tempFoundation.name, 
      tempFoundation.description,
      tempFoundation.email,
      tempFoundation.web_url,],
  });

  

  const { sendAsync: add_project } = useScaffoldWriteContract({
    contractName: "Eaprotocol",
    functionName: "add_project",
    args: [
      tempProject.name, 
      foundationId,
      tempProject.description,
      tempProject.goal,],
  });

  const { sendAsync: withdraw_project } = useScaffoldWriteContract({
    contractName: "Eaprotocol",
    functionName: "withdraw_project",
    args: [
      Number(foundationId),
      Number(project_id)
    ],
  });

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
  }, [foundationName, add_foundation]);

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

  const renderRegisterFoundation = () => {
    if (connectedAddress) {
      if(get_foundation_by_address){
        if (get_foundation_by_address.id.toString() != "0") {
          return (
            <div>
              <div className="py-5 space-y-3 first:pt-0 last:pb-1">{get_foundation_by_address.name}</div>
              <div className="py-5 space-y-3 first:pt-0 last:pb-1">{get_foundation_by_address.id}</div>
            </div>
          );
        }
        else {
          return (
                  <div className="py-5 space-y-3 first:pt-0 last:pb-1">
                    <div className="flex flex-col my-6">
                      <div className="w-24 mb-2 font-medium break-words text-function">
                          Name
                      </div>
                      <input
                        onChange={(e) =>{
                          let name = {name: e.target.value};
                          setTempFoundation( tempFoundation => ({...tempFoundation, ...name}))
                          }
                        }
                        //list="symbols"
                        className="input bg-input input-ghost focus-within:border-transparent focus:outline-none h-[2.2rem] min-h-[2.2rem] px-4 border w-full text-sm placeholder:text-[#9596BF] text-neutral"
                        placeholder="Enter foundation name"
                      />

                      <div className="w-24 mb-2 font-medium break-words text-function">
                        Description
                      </div>
                      <input
                        onChange={(e) =>{
                          let description = {description: e.target.value};
                          setTempFoundation( tempFoundation => ({...tempFoundation, ...description}))
                          }
                        }
                        className="input bg-input input-ghost focus-within:border-transparent focus:outline-none h-[2.2rem] min-h-[2.2rem] px-4 border w-full text-sm placeholder:text-[#9596BF] text-neutral"
                        placeholder="Enter description"
                        />
                      <div className="w-24 mb-2 font-medium break-words text-function">
                        WEB
                      </div>
                      <input
                        onChange={(e) =>{
                          let web = {web: e.target.value};
                          setTempFoundation( tempFoundation => ({...tempFoundation, ...web}))
                          }
                        }
                        className="input bg-input input-ghost focus-within:border-transparent focus:outline-none h-[2.2rem] min-h-[2.2rem] px-4 border w-full text-sm placeholder:text-[#9596BF] text-neutral"
                        placeholder="Enter WEB url"
                        />
                      <div className="w-24 mb-2 font-medium break-words text-function">
                        Email
                      </div>
                      <input
                        onChange={(e) =>{
                          let email = {email: e.target.value};
                          setTempFoundation( tempFoundation => ({...tempFoundation, ...email}))
                          }
                        }
                        className="input bg-input input-ghost focus-within:border-transparent focus:outline-none h-[2.2rem] min-h-[2.2rem] px-4 border w-full text-sm placeholder:text-[#9596BF] text-neutral mb-4"
                        placeholder="Enter EMAIL"
                        />
                    </div>
                    <div className="flex flex-col space-y-5">
                      <button
                        className="btn btn-secondary uppercase text-white"
                        onClick={wrapInTryCatch(add_foundation, "add_foundation")} >
                          Register Foundation
                      </button>
                    </div>
                    
                  </div>
        );
        }
      
      }
    } else {
      return (
        <p></p>//<button label="Connect your wallet" onClick={connectWallet}/>
      );
    }
  };


  const renderRegisterProject = () => {
    if (connectedAddress) {
      /* if(get_foundation_by_address){
        if (get_foundation_by_address.id.toString() != 0) {
          return (
            <div>
              <div className="py-5 space-y-3 first:pt-0 last:pb-1">{get_foundation_by_address.name}</div>
              <div className="py-5 space-y-3 first:pt-0 last:pb-1">{get_foundation_by_address.id}</div>
            </div>
          );
        }
        else { */
          return (
                  <div className="py-5 space-y-3 first:pt-0 last:pb-1">
                    Register new Project
                    <div className="flex flex-col my-6">
                      <div className="w-24 mb-2 font-medium break-words text-function">
                          Name
                      </div>
                      <input
                        onChange={(e) =>{
                          let name = {name: e.target.value};
                          setTempProject( tempProject => ({...tempProject, ...name}))
                          }
                        }
                        //list="symbols"
                        className="input bg-input input-ghost focus-within:border-transparent focus:outline-none h-[2.2rem] min-h-[2.2rem] px-4 border w-full text-sm placeholder:text-[#9596BF] text-neutral"
                        placeholder="Project Name"
                      />

                      <div className="w-24 mb-2 font-medium break-words text-function">
                        Description
                      </div>
                      <input
                        onChange={(e) =>{
                          let description = {description: e.target.value};
                          setTempProject( tempProject => ({...tempProject, ...description}))
                          }
                        }
                        className="input bg-input input-ghost focus-within:border-transparent focus:outline-none h-[2.2rem] min-h-[2.2rem] px-4 border w-full text-sm placeholder:text-[#9596BF] text-neutral"
                        placeholder="Describe the project"
                        />
                      <div className="w-24 mb-2 font-medium break-words text-function">
                        Goal
                      </div>
                      <input
                        onChange={(e) =>{
                          let goal = {goal: Number(e.target.value)};
                          setTempProject( tempProject => ({...tempProject, ...goal}))
                          }
                        }
                        className="tooltip before:content-[attr(data-tip)] before:right-[-10px] before:left-auto before:transform-none input bg-input input-ghost focus-within:border-transparent focus:outline-none h-[2.2rem] min-h-[2.2rem] px-4 border w-full text-sm placeholder:text-[#9596BF] text-neutral mb-4"
                        placeholder="Enter Goal in weis"
                        />
                    <div className="flex flex-col space-y-5">
                      <button
                        className="btn btn-secondary uppercase text-white"
                        onClick={wrapInTryCatch(add_project, "add_project")} >
                          Register Project
                      </button>
                    </div>                    
                  </div>
                  </div>
        );
    } 
  };

  const calculateValueBar = (goal: number, remaining: number) => {
    let value = Math.floor(100 - (remaining * 100 / goal));
    return value;
  }

  const renderEditWhitdrawButton = (status: string, id: number) => {
    if(status == "Closed" ){
      project_id = id;
      return <button onClick={wrapInTryCatch(withdraw_project, "withdraw_project")}>Withdraw</button>
    }else if(status == "Withdrawn"){
      return (
          <>
            <button>Edit</button>
            <button>Pause</button>
            <button>Refund</button>
          </>)
    }else if(status == "Paused"){
      return (
          <>
            <button>Edit</button>
            <button>Resume</button>
            <button>Refund</button>
          </>)
    }
  }

  const formatDate = (value: number) => {
    const myDate = new Date(Number(value) * 1000);
    return myDate.toLocaleDateString('en-US', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
  };
  //console.log(get_project_by_foundation[0]);
  const renderProjects = () => {
    if (connectedAddress) {
      return (
        <div>
        {get_project_by_foundation && get_project_by_foundation.map((project: Project, index) => (
        <div className="collapse collapse-plus bg-base-200 mb-4" key={index}>
          <input type="radio" name="my-accordion-3" defaultChecked key={index}/>
          <div className="collapse-title text-xl font-medium flex justify-between">
            {project["name"]}<span className="badge badge-accent">{project["status_project"]}</span>
          </div>
          <div className="collapse-content">
            <p>{project["description"]}</p>
            <p className=""><span>Goal: </span>{project["goal"].toString()} wei - {formatEther(Number(project["goal"]))} ETH</p>
            <p className=""><span>Created: </span> {formatDate(project["created_at"])}</p>
            <p className=""><span>Balance: </span>{project["balance"].toString()} wei - {formatEther(Number(project["balance"]))} ETH</p>
            <p className=""><span>Remaining: </span>{Number(project["remaining_amount"])} wei- {formatEther(Number(project["remaining_amount"]))} ETH</p>
            <progress className="progress progress-success" value={calculateValueBar(Number(project["goal"]), Number(project["remaining_amount"]))} max="100"></progress>
            <p>{renderEditWhitdrawButton(project["status_project"], project["id"])}</p>
          </div>
        </div>
        ))}
        </div>
              );
            }
          };


  return (
    
    <div>    
     <div className="flex items-center flex-col flex-grow w-full px-4 gap-12 text-neutral justify-center">
      
     {/*  {true && (
        <div className="flex flex-col items-center gap-2 bg-base-100 border-8 border-secondary  rounded-xl p-6 mt-12 w-full max-w-lg">
          <p className="block m-0 font-semibold text-neutral">
            🎉 &nbsp; Staking App triggered `ExampleExternalContract` &nbsp; 🎉{" "}
          </p>
          <div className="flex items-center">
            <ETHToPrice
             // value={
             //   exampleExternalContractBalance != null
             //     ? `${formatEther(Number(exampleExternalContractBalance))}${targetNetwork.nativeCurrency.symbol}`
             //     : undefined
             // }
              className="text-[1rem]"
            />
            <p className="block m-0 text-lg -ml-1 text-neutral">staked !!</p>
          </div>
        </div>
      )} */}
      <div
        className="flex flex-col items-center space-y-8 bg-base-100  border-8 border-secondary rounded-xl p-6 w-full max-w-full text-neutral"
      >
        <div className="flex flex-col w-full items-center">
          <p className="block text-2xl mt-0 mb-2 font-semibold">
            Foundation Form
          </p>
          <Address address={connectedAddress} size="xl" />
        </div>
        {/* <div>{renderRegisterFoundation()}</div>
        <div>{renderRegisterProject()}</div>
        <div>{renderProjects()}</div>  */}      

        <div className="">
          <h1 className="">{connectedAddress ? (!foundationName && "Address Doesn't have a Foundation, please register one.") : "Please connect your wallet first"}</h1>
          {renderRegisterFoundation()}
          {foundationName && renderRegisterProject()}
          <div className="">
            {renderProjects()}
          </div>
        </div>     
      </div>
    </div>
    
    </div>
  );
};
