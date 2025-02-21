"use client";

import type { NextPage } from "next";
import { ContributionContractInteraction } from "~~/components/contract/ContributionContractInteraction";
import { useDeployedContractInfo } from "~~/hooks/scaffold-stark";

const ContributionUI: NextPage = () => {
  const { data: EaprotocolContract } = useDeployedContractInfo("Eaprotocol");

  return (
    <ContributionContractInteraction
      key={EaprotocolContract?.address}
      address={EaprotocolContract?.address}
    />
  );
};

export default ContributionUI;