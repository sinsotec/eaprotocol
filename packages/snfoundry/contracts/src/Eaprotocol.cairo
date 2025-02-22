use starknet::{ContractAddress};
use openzeppelin_token::erc20::interface::{IERC20Dispatcher, IERC20DispatcherTrait};

#[starknet::interface]
pub trait IEaprotocol<TContractState> {
    fn add_foundation(
        ref self: TContractState,
        name: ByteArray,
        description: ByteArray,
        email: ByteArray,
        web_url: ByteArray,
        //country: country_code_iso2,
        //tags: Array<ByteArray>,
        ) -> u64;
    fn get_foundation_by_address(self: @TContractState, account: ContractAddress) -> Foundation;
    fn get_foundation_by_id(self: @TContractState, foundation_id: u64) -> Foundation;
    fn get_all_foundations(self: @TContractState) -> Array<Foundation>;
    fn add_project(
        ref self: TContractState,
        name: ByteArray,
        foundation_id: u64,
        description: ByteArray,
        goal: u256,
        );
    fn get_project_by_id(self: @TContractState, project_id: u64) -> Project;
    fn get_project_by_foundation_by_id(self: @TContractState, foundation_id: u64, project_id: u64) -> Project;
    fn get_project_by_foundation(self: @TContractState, foundation_id: u64) -> Array<Project>;
    fn add_contribution(
        ref self: TContractState,
        foundation_id: u64,
        project_id: u64,
        amount: u256,
        toke: ByteArray,
        );
    fn withdraw_project(ref self: TContractState, foundation_id: u64, project_id: u64);
    fn token_dispatcher(self: @TContractState, token: felt252) -> IERC20Dispatcher;
    //fn get_contribution_by_donor(self: @TContractState, donor_address: ContractAddress) -> Contribution;
    //fn get_contribution_by_foundation(self: @TContractState, foundation_id: u64) -> Contribution;
    //fn get_contribution_by_project(self: @TContractState, project_id: u64) -> Contribution;
    //fn get_contribution_by_foundation_by_project(self: @TContractState, foundation_id: u64, project_id: u64) -> Contribution;
    //fn get_contribution_by_foundation_by_donor(self: @TContractState, foundation_id: u64, donor_address: ContractAddress) -> Contribution;
    //fn get_contribution_by_project_by_donor(self: @TContractState, project_id: u64, donor_address: ContractAddress) -> Contribution;
    //fn get_contribution_by_foundation_by_project_by_donor(self: @TContractState, foundation_id: u64, project_id: u64, donor_address: ContractAddress) -> Contribution;
}

#[derive(Drop, Serde, Clone, starknet::Store)]
#[allow(starknet::store_no_default_variant)]
enum country_code_iso2 {
    AF,AL,DE,AD,AO,AI,AQ,AG,SA,DZ,AR,AM,AW,AU,AT,AZ,BE,BS,BH,BD,BB,BZ,BJ,BT,BY,MM,BO,BA,BW,BR,BN,BG,BF,BI,CV,KH,CM,CA,TD,CL,CN,CY,VA,CO,KM,CG,CD,KP,KR,CI,CR,HR,CU,CW,DK,DM,EC,EG,SV,AE,ER,SK,SI,ES,US,EE,ET,PH,FI,FJ,FR,GA,GM,GE,GH,GI,GD,GR,GL,GP,GU,GT,GF,GG,GN,GQ,GW,GY,HT,HN,HK,HU,IN,ID,IR,IQ,IE,BV,IM,CX,NF,IS,BM,KY,CC,CK,AX,FO,GS,HM,MV,FK,MP,MH,PN,SB,TC,UM,VG,VI,IL,IT,JM,JP,JE,JO,KZ,KE,KG,KI,KW,LB,LA,LS,LV,LR,LY,LI,LT,LU,MX,MC,MO,MK,MG,MY,MW,ML,MT,MA,MQ,MU,MR,YT,FM,MD,MN,ME,MS,MZ,NA,NR,NP,NI,NE,NG,NU,NO,NC,NZ,OM,NL,PK,PW,PS,PA,PG,PY,PE,PF,PL,PT,PR,QA,GB,CF,CZ,DO,SS,RE,RW,RO,RU,EH,WS,AS,BL,KN,SM,MF,PM,VC,SH,LC,ST,SN,RS,SC,SL,SG,SX,SY,SO,LK,ZA,SD,SE,CH,SR,SJ,SZ,TJ,TH,TW,TZ,IO,TF,TL,TG,TK,TO,TT,TN,TM,TR,TV,UA,UG,UY,UZ,VU,VE,VN,WF,YE,DJ,ZM,ZW
}

#[derive(Drop, Serde, Clone, PartialEq, starknet::Store)]
#[allow(starknet::store_no_default_variant)]
enum status_project {
    published, 
    closed, 
    withdrawn, 
    paused, 
    refunded
}

#[derive(Drop, Serde, Clone, PartialEq, starknet::Store)]
#[allow(starknet::store_no_default_variant)]
enum tokens {ETH, STRK, USDC}

/// @dev Foundations
/// @dev A foundation is an entity that creates projects.
#[derive(Drop, Serde, Clone, starknet::Store )]
struct Foundation {
    id: u64,
    name: ByteArray,
    address_account: ContractAddress,
    description: ByteArray,
    email: ByteArray,
    web_url: ByteArray,
    //country: country_code_iso2,
    collected_funds: u256,
    //tags: [felt252; 10],
    active: bool,
    projects_count: u64,
    created_at: u64,
    //projects: [felt252; 99],
}

/// @dev Projects
    /// @dev A project is a campaign created by a foundation to raise funds.
    #[derive(Drop, Serde, Clone, starknet::Store)] 
    struct Project {
        id: u64,
        id_by_foundation: u64,
        //address_owner: ContractAddress,
        name: ByteArray,
        foundation_id: u64,
        description: ByteArray,
        goal: u256,
        balance: u256, 
        remaining_amount: u256,
        contributions: u64,
        status_project: ByteArray,
        changed_name: u8,
        created_at: u64,
    }



    /// @dev Contribution 
    /// @dev A contribution is a donation made by a donor to a project.
    #[derive(Drop, Serde, Clone, starknet::Store)]
    struct Contribution {
        donor_address: ContractAddress,
        foundation_id: u64,
        project_id: u64,
        amount: u256,
        created_at: u64, 
    }


#[starknet::contract]
mod Eaprotocol {
    use openzeppelin_access::ownable::OwnableComponent;
    use starknet::storage::{
        Map, StorageMapReadAccess, StorageMapWriteAccess, Vec, VecTrait, MutableVecTrait,
        StoragePathEntry
    };
    use starknet::{get_caller_address, get_contract_address, get_block_timestamp, contract_address_const};
    use super::{ContractAddress, IERC20Dispatcher, IERC20DispatcherTrait, IEaprotocol, country_code_iso2, Foundation, Project, status_project, Contribution};

    component!(path: OwnableComponent, storage: ownable, event: OwnableEvent);

    #[abi(embed_v0)]
    impl OwnableImpl = OwnableComponent::OwnableImpl<ContractState>;
    impl OwnableInternalImpl = OwnableComponent::InternalImpl<ContractState>;

    const ETH_CONTRACT_ADDRESS: felt252 =
        0x49d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7;

    const STR_CONTRACT_ADDRESS: felt252 =
        0x04718f5a0Fc34cC1AF16A1cdee98fFB20C31f5cD61D6Ab07201858f4287c938D;
    
    const USDC_CONTRACT_ADDRESS: felt252 =
        0x053b40A647CEDfca6cA84f542A0fe36736031905A9639a7f19A3C1e66bFd5080;

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        #[flat]
        OwnableEvent: OwnableComponent::Event,
    //    GreetingChanged: GreetingChanged,
    }

    //#[derive(Drop, starknet::Event)]
    //struct GreetingChanged {
    //    #[key]
    //    greeting_setter: ContractAddress,
    //    #[key]
    //    new_greeting: ByteArray,
    //    premium: bool,
    //    value: u256,
    //}


    /// @dev Donors
    /// @dev A donor is a person or entity that donates to a project.
    #[derive(Drop)]
    struct Donor {
        address_account: ContractAddress,
        balance: u256,
    }

    
    #[storage]
    struct Storage {

        eth_token_dispatcher: IERC20Dispatcher,
        str_token_dispatcher: IERC20Dispatcher,
        usdc_token_dispatcher: IERC20Dispatcher,
        
        /// @dev Total of the contributions.
        total_contributions: u256,
        /// @dev Balance of contract
        contract_balance: u256,
        
        /// @dev Identifier for each foundation
        foundation_id: u64,
        /// @dev Identifier for each project
        project_id: u64,

        foundations: Vec<Foundation>,

        projects_by_id: Map<u64, Project>,
        projects_id: Vec<u64>,

        /// @dev Register each foundation with an address
        foundation_id_by_address: Map<ContractAddress, u64>,

        last_project_id_by_foundation: Map<u64, u64>,

        projects_by_foundation: Map<u64, Map<u64, Project>>,
        
        /// @dev Register donors account
        donors_by_address: Map<ContractAddress, Donor>,

        /// @dev Asociatte project.id to an array of contributions;
        contributions_by_projects: Map<u64, Map<u64,  Contribution>>,

        /// @dev Associate project to donor
        //projects_by_donors: Map<ContractAddress, Projects>,

        #[substorage(v0)]
        ownable: OwnableComponent::Storage,

    }

    #[constructor]
    fn constructor(ref self: ContractState, owner: ContractAddress) {
        self.ownable.initializer(owner);
        self.eth_token_dispatcher.write(IERC20Dispatcher { contract_address: contract_address_const::<ETH_CONTRACT_ADDRESS>() });
        self.str_token_dispatcher.write(IERC20Dispatcher { contract_address: contract_address_const::<STR_CONTRACT_ADDRESS>() });
        self.usdc_token_dispatcher.write(IERC20Dispatcher { contract_address: contract_address_const::<USDC_CONTRACT_ADDRESS>() });
        let foundation_0 = Foundation {
            id: 0,
            name: "",
            address_account: contract_address_const::<0>(),
            description: "",
            email: "",
            web_url: "",
            //country: country_code_iso2::AF,
            collected_funds: 0,
            //tags: [ByteArray::new(); 10],
            active: false,
            projects_count: 0,
            created_at: 0,
            //projects: [ByteArray::new(); 99],
        };
        self.foundations.append().write(foundation_0);
        
    }


    #[abi(embed_v0)]
    impl EaprotocolImpl of IEaprotocol<ContractState> {
        /// @dev Add new foundation only if address has no one. 
        /// @param _name The Foundation's name.
        /// @param _description The Foundation's description.
        /// @param _email The Foundation's email.
        /// @param _webUrl The Foundation's web url.
        fn add_foundation(
            ref self: ContractState,
            name: ByteArray,
            description: ByteArray,
            email: ByteArray,
            web_url: ByteArray,
            //country: country_code_iso2,
            //tags: [felt252],
        ) -> u64 {
                //let f = self.foundation_by_address.read(get_caller_address());
                //assert!(self.foundation_by_address.read(get_caller_address()), "Foundation already exists");
                self.foundation_id.write(self.foundation_id.read() + 1);
                let foundation_id = self.foundation_id.read();
                let foundation = Foundation {
                    id: foundation_id,
                    name: name,
                    address_account: get_caller_address(),
                    description: description,
                    email: email,
                    web_url: web_url,
                    //country: country,
                    collected_funds: 0,
                    //tags: tags,
                    active: false,
                    projects_count: 0,
                    created_at: get_block_timestamp(),
                    //projects: Array::new(),
                };
                self.foundations.append().write(foundation);
                self.foundation_id_by_address.write(get_caller_address(), foundation_id); 
                foundation_id
        }
        
        /// @return Type Foundation corresponding to that address.
        fn get_foundation_by_address(self: @ContractState, account: ContractAddress) -> Foundation {
            let id = self.foundation_id_by_address.read(account);
            self.get_foundation_by_id(id)
        }

        /// @dev _id is the same that foundation_id
        /// @param _id Id of a foundation.
        /// @return Type Foundation corresponding to that address.
        fn get_foundation_by_id(self: @ContractState, foundation_id: u64) -> Foundation {
            if let Option::Some(storage_ptr) = self.foundations.get(foundation_id) {
                return Option::Some(storage_ptr.read()).unwrap();
            } else {
                self.foundations.at(0).read()
            }
        }

        fn get_all_foundations(self: @ContractState) -> Array<Foundation> {
            let mut foundations: Array<Foundation> = ArrayTrait::new();
            for i in 1..self.foundations.len() {
                foundations.append(self.foundations.at(i).read());
            };
            foundations
        }

        fn add_project(
            ref self: ContractState,
            name: ByteArray,
            foundation_id: u64,
            description: ByteArray,
            goal: u256,
        ){
            assert!(self.get_foundation_by_id(foundation_id).address_account == get_caller_address(), "Must be owner");
            self.project_id.write(self.project_id.read() + 1);
            let last_project = self.last_project_id_by_foundation.read(foundation_id) + 1;
            let project = Project {
                id: self.project_id.read(),
                id_by_foundation: last_project,
                name: name,
                foundation_id: foundation_id,
                description: description,
                goal: goal,
                balance: 0,
                remaining_amount: goal,
                contributions: 0,
                status_project: "Published",
                changed_name: 0,
                created_at: get_block_timestamp(),
            };
            self.update_foundations_count(foundation_id);
            self.projects_id.append().write(project.id);
            self.projects_by_id.write(project.id, project.clone());
            self.projects_by_foundation.entry(foundation_id).write(project.id_by_foundation, project);//TODO
            let last_project = self.last_project_id_by_foundation.read(foundation_id);
            self.last_project_id_by_foundation.entry(foundation_id).write(last_project + 1);
        }

        fn get_project_by_id(self: @ContractState, project_id: u64) -> Project {
            self.projects_by_id.read(project_id)
        }

        fn get_project_by_foundation_by_id(self: @ContractState, foundation_id: u64, project_id: u64) -> Project{
            self.projects_by_foundation.entry(foundation_id).entry(project_id).read()
        }

        fn get_project_by_foundation(self: @ContractState, foundation_id: u64) -> Array<Project> {
            let mut projects: Array<Project> = ArrayTrait::new();
            let last_project = self.last_project_id_by_foundation.read(foundation_id) + 1;
            for project in 1..last_project {
                projects.append(self.projects_by_foundation.entry(foundation_id).entry(project).read());
            };
            projects
        }

        fn add_contribution(
            ref self: ContractState,
            foundation_id: u64,
            project_id: u64,
            amount: u256,
            toke: ByteArray,){
                assert!(amount > 0, "Amount must be greater than 0");
                assert!(self.foundation_id_by_address.read(get_caller_address()) != foundation_id, "You can't contribute to your own project");
                assert!(
                    self.projects_by_foundation.entry(foundation_id).entry(project_id).read().status_project == "Published", 
                    "Project is not published");
                assert!(
                    self.projects_by_foundation.entry(foundation_id).entry(project_id).read().remaining_amount >= amount, 
                    "Amount is greater than remaining amount");
                assert!(
                    self.token_dispatcher('ETH').balance_of(get_caller_address()) >= amount, 
                    "Insufficient balance");
                assert!(
                    self.token_dispatcher('ETH').allowance(get_caller_address(), get_contract_address()) >= amount, 
                    "Insufficient allowance");
                self.token_dispatcher('ETH').transfer_from(get_caller_address(), get_contract_address(), amount);
                self.contract_balance.write(self.contract_balance.read() + amount);
                self.total_contributions.write(self.total_contributions.read() + amount);
                let mut contribution = Contribution {
                    donor_address: get_caller_address(),
                    foundation_id: foundation_id,
                    project_id: project_id,
                    amount: amount,
                    created_at: get_block_timestamp(),
                };
                self.update_foundations_collected(foundation_id, amount);
                let mut project = self.update_project(foundation_id, project_id, ref contribution);
                if(project.remaining_amount == 0){
                    project = self.update_project_status(foundation_id, project_id, "Closed");
                }
                self.contributions_by_projects.entry(project_id).entry(project.contributions).write(contribution);

                
        }

        fn withdraw_project(ref self: ContractState, foundation_id: u64, project_id: u64){
            let mut project = self.get_project_by_foundation_by_id(foundation_id, project_id);
            let amount = project.goal;
            self.token_dispatcher('ETH').transfer(self.get_foundation_by_id(foundation_id).address_account, amount);
            project = self.update_project_status(foundation_id, project_id, "Withdrawn");
        }


        fn token_dispatcher(self: @ContractState, token: felt252) -> IERC20Dispatcher {
            self.eth_token_dispatcher.read()
        }

    }

    #[generate_trait]
    impl Private of PrivateTrait {
        fn update_foundations_count(ref self: ContractState, foundation_id: u64) {
            let foundation = self.foundations.at(foundation_id).read();
            self.foundations.at(foundation_id).write(Foundation {
                id: foundation.id,
                name: foundation.name,
                address_account: foundation.address_account,
                description: foundation.description,
                email: foundation.email,
                web_url: foundation.web_url,
                //country: foundation.country,
                collected_funds: foundation.collected_funds,
                //tags: foundation.tags,
                active: foundation.active,
                projects_count: foundation.projects_count + 1,
                created_at: foundation.created_at,
                //projects: foundation.projects,
            });
        }

        fn update_foundations_collected(ref self: ContractState, foundation_id: u64, amount: u256) {
            let foundation = self.foundations.at(foundation_id).read();
            self.foundations.at(foundation_id).write(Foundation {
                id: foundation.id,
                name: foundation.name,
                address_account: foundation.address_account,
                description: foundation.description,
                email: foundation.email,
                web_url: foundation.web_url,
                //country: foundation.country,
                collected_funds: foundation.collected_funds + amount,
                //tags: foundation.tags,
                active: foundation.active,
                projects_count: foundation.projects_count,
                created_at: foundation.created_at,
                //projects: foundation.projects,
            });
        }

        fn update_project(ref self: ContractState, foundation_id: u64, project_id: u64, ref contribution: Contribution) -> Project {
            let mut project = self.projects_by_foundation.entry(foundation_id).entry(project_id).read();
            project.balance += contribution.amount;
            project.remaining_amount -= contribution.amount;
            project.contributions += 1;
            self.projects_by_foundation.entry(foundation_id).entry(project_id).write(project.clone());
            project
        }

        fn update_project_status(ref self: ContractState, foundation_id: u64, project_id: u64, status: ByteArray) -> Project {
            let mut project = self.projects_by_foundation.entry(foundation_id).entry(project_id).read();
            if status == "Withdrawn" {
                project.balance = 0;
            }
            project.status_project = status;
            self.projects_by_foundation.entry(foundation_id).entry(project_id).write(project.clone());
            project
        }


    }
}
