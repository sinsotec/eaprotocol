import Link from "next/link";
import Image from "next/image";
import { ConnectedAddress } from "~~/components/ConnectedAddress";




const Home = () => {
  return (
     <div className="flex items-center flex-col flex-grow pt-10">
      <div className="px-5">
        <h1 className="text-center">
          <span className="block text-2xl mb-2">Welcome to</span>
          <span className="block text-4xl font-bold">Enhanced Altruism Protocol</span>
        </h1>
        <ConnectedAddress />
        <p className="text-center text-lg">
        DECENTRALIZING PHILANTROPY
        </p>
          <p className=" italic text-base font-bold  text-center ">
          Making It Posible!
          </p>
          
          <p className=" italic text-base font-bold max-w-full break-words break-all inline-block">
          A set of WEB3 tools that change the way donors and organizations interact. It increases transparency for organizations and gives donors more decision-making power, as well as rewards them for their actions.
          </p>
        
      </div>

      <div className="bg-container flex-grow w-full mt-16 px-8 py-12">
        <div className="flex justify-center items-center gap-12 flex-col sm:flex-row">
          <Link href="/contribute">
            <div className="flex flex-col bg-base-100 relative text-[16px] px-10 py-10 text-center items-center max-w-xs rounded-3xl border border-gradient">
              <div className="trapeze"></div>
              
              <p>I want to contribute
                {/* Tinker with your smart contract using the{" "}
                <Link href="/debug" passHref className="link">
                  Debug Contracts
                </Link>{" "}
                tab. */}
              </p>
            </div>
          </Link>
          
          <Link href="/foundation">
            <div className="flex flex-col bg-base-100 relative text-[16px] px-10 py-10 text-center items-center max-w-xs rounded-3xl border border-gradient">
              <div className="trapeze"></div>
              <p>
                Foundation Dashboard
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  ); 
 
};

export default Home;
