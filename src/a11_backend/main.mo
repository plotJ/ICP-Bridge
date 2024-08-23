import EvmRpc "canister:evm_rpc";

import Debug "mo:base/Debug";
import Cycles "mo:base/ExperimentalCycles";

import Text "mo:base/Text";

import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";

actor {

    let _nonce = 0;
    var _nonces : [Nat] = [];
    let eligibilityMap = HashMap.HashMap<Principal, Nat>(10, Principal.equal, Principal.hash);
    let _targetContractAddress = "0x87B99eE721a226503Ae9f2F822aad2e044fc28c6";

    public query func greet(name : Text) : async Text {
        return "Hello, " # name # "!";
    };

    public shared func BridgeETHToICP(TransactionData : Text, ICPaddress : Principal) : async Text {

        // Select RPC services
        let services : EvmRpc.RpcServices = #EthSepolia(?[#PublicNode]);

        // Call eth_getBlockByNumber RPC method (unused cycles will be refunded)
        Cycles.add<system>(1_400_000_000);

        let result = await EvmRpc.eth_getTransactionReceipt(services, null, TransactionData);

        // implement the logs.
        switch result {
            // Consistent, successful results
            case (#Consistent(#Ok value)) {
                // Output the success result
                let receiptText = debug_show (value);
                eligibilityMap.put(ICPaddress, 1);

                return "success: " # receiptText;
            };
            // Consistent error message
            case (#Consistent(#Err error)) {
                Debug.trap("Error: " # debug_show error);

            };
            // Inconsistent results between RPC providers
            case (#Inconsistent(results)) {
                Debug.trap("Inconsistent results");

            };
        };
    };


    public shared func checkEligibility(principal : Principal) : async Nat {
        // Check if the provided principal is in the eligibility map
        switch (eligibilityMap.get(principal)) {
            case (?allocation) {
                return allocation;
            };
            case null {
                return 0; // Return 0 if the principal is not found or not eligible
            };
        };
    };
};