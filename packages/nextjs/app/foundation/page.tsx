"use client";

import type { NextPage } from "next";
import { FoundationContractInteraction } from "~~/components/contract/FoundationContractInteraction";
import { useDeployedContractInfo } from "~~/hooks/scaffold-stark";

const FoundationUI: NextPage = () => {
  const { data: EaprotocolContract } = useDeployedContractInfo("Eaprotocol");

  return (
    <FoundationContractInteraction
      key={EaprotocolContract?.address}
      address={EaprotocolContract?.address}
    />
  );
};

export default FoundationUI;
