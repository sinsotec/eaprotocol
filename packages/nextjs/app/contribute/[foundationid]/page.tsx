'use client'

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



export default function Page(props: { params: { foundationid: number } })  {
    const params = props.params;
    const id = params.foundationid;

  const { address: connectedAddress } = useAccount();

  const { data: EaprotocolContract } = useDeployedContractInfo("Eaprotocol");

  const [donation, setDonation] = useState("");
  const [projectId, setprojectId] = useState(0);


    
  function formatEther(weiValue: number) {
    const etherValue = weiValue / 1e18;
    return etherValue.toFixed(10);
  }

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

  interface Project {
    id: number;
    id_by_foundation: number;
    name: String;
    foundation_id: number;
    description: String;
    goal: number;
    balance: number;
    remaining_amount: number;
    contributions: number;
    status_project: String;
    changed_name: number;
    created_at: number;
  }

  

    const { data: get_foundation_by_id } = useScaffoldReadContract({
        contractName: "Eaprotocol",
        functionName: "get_foundation_by_id",
        args: [id],
        watch: true,
      }) as unknown as { data: Foundation };

    const { data: get_project_by_foundation } = useScaffoldReadContract({
          contractName: "Eaprotocol",
          functionName: "get_project_by_foundation",
          args: [Number(id)],
          watch: true,
        }) as unknown as { data: Project[] }; 

    const { sendAsync: add_contribution } = useScaffoldMultiWriteContract({
      calls: [
        {
          contractName: "Eth",
          functionName: "approve",
          args: [EaprotocolContract?.address, Number(donation)]
        },
        {
          contractName: "Eaprotocol",
          functionName: "add_contribution",
          args: [
          Number(id), 
          Number(projectId),
          Number(donation),
          "ETH",]
        }
      
      ],
      
      
    });

  
    /* const getFoundationProjects = async () => {
      try {
        // We need a Signer here since this is a 'write' transaction.
        const signer = await getProviderOrSigner(true);
        // Create a new instance of the Contract with a Signer, which allows
        // update methods
        const eapContract = new Contract(EAP_CONTRACT_ADDRESS, EAP_ABI, signer);
        const add = await signer.getAddress();
        const projects = await eapContract.getProjectsbyFoundationId(id);
  
        setLoading(true);
        // wait for the transaction to get mined
        setLoading(false);
        //setFoundationProjects([...projects]);
        setFoundationProjects(projects);
      } catch (err) {
        //alert(err);
        console.error(err);
      }
    }; */

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


  
  /* const formatDate = (value) => {
    const myDate = new Date(value * 1000);
    return myDate.toLocaleDateString('en-US', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
  }; */

    

   /*  const renderDonationGroup = (index, donation) => {
    return(
        <div>
            <InputText
                  placeholder="Donation Amount" 
                  onChange={(e) => {
                    console.log(e.target.value);
                    setDonation(e.target.value);
                    }
                  }
                  />
            <Button label='Contribuir' onClick={() => addContribution(index, donation)}/>
        </div>
    )} */
    /*
    renderButton: Returns a button based on the state of the dapp
  */
    const formatDate = (value: number) => {
      const myDate = new Date(Number(value) * 1000);
      return myDate.toLocaleDateString('en-US', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
      });
    };

    const renderDonationGroup = (project_id: number) => {
      return(
          <div>
              <input
                    placeholder="Donation Amount" 
                    onChange={(e) => {
                      //console.log(e.target.value);
                      setDonation(e.target.value);
                      setprojectId(project_id);
                      }
                    }
                    className="tooltip before:content-[attr(data-tip)] before:right-[-10px] before:left-auto before:transform-none input bg-input input-ghost focus-within:border-transparent focus:outline-none h-[2.2rem] min-h-[2.2rem] px-4 border w-full text-sm placeholder:text-[#9596BF] text-neutral mb-4"
                    />
              <p>
              <button 
                className="btn btn-secondary uppercase text-white"
                onClick={() => add_contribution()}>
                  Contribute
              </button>
              </p>
          </div>
      )}

      

    const renderProjects = () => {
      if (connectedAddress) {
        return (
          <div><h2>{get_foundation_by_id?.name}</h2>
          {get_project_by_foundation && get_project_by_foundation.map((project: Project, index) => (
          <div className="collapse collapse-plus bg-base-200 mb-4" key={index}>
            <input type="radio" name="my-accordion-3" defaultChecked key={index}/>
            <div className="collapse-title text-xl font-medium flex justify-between" key={index}>
              {project.name}<span className={`badge badge-${project["status_project"] == "Published" ? "accent" : "error"}`}>{project["status_project"]}</span>
            </div>
            <div className="collapse-content">
              <p>{project["description"]}</p>
              <p className=""><span>Goal: </span>{project["goal"].toString()} wei - {formatEther(Number(project["goal"]))} ETH</p>
              <p className=""><span>Created: </span> {formatDate(project["created_at"])}</p>
              <p className=""><span>Balance: </span>{project["balance"].toString()} wei - {formatEther(Number(project["balance"]))} ETH</p>
              <p className=""><span>Remaining: </span>{Number(project["remaining_amount"])} wei - {formatEther(Number(project["remaining_amount"]))} ETH</p>
              <progress className="progress progress-success" value={calculateValueBar(Number(project["goal"]), Number(project["remaining_amount"]))} max="100"></progress>
              <p>{project["status_project"] == "Published" && renderDonationGroup(project["id_by_foundation"])}</p>
            </div>
          </div>
          ))}
          </div>
                );
              }
            };



  // In this case, whenever the value of `walletConnected` changes - this effect will be called
 


    return (
        

<div>    
<div className="flex items-center flex-col flex-grow w-full px-4 gap-12 text-neutral justify-center">
 

 <div
   className="flex flex-col items-center space-y-8 bg-base-100  border-8 border-secondary rounded-xl p-6 w-full max-w-full text-neutral"
 >  
    {renderProjects()}
 </div>
 
</div>

</div>
);
    
}

