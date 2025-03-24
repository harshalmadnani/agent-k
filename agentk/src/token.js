const Pact = require('pact-lang-api');

const NETWORK = "https://api.testnet.chainweb.com";
const CHAIN_ID = "1";
const API_HOST = `${NETWORK}/chainweb/0.0/testnet04/chain/${CHAIN_ID}/pact`;
const PUBLIC_KEY = "your-public-key"; // Replace with your public key

async function createUnsignedDeployment() {
    // Define the token code
    const tokenCode = `(namespace 'test007)
(define-keyset 'test007-keyset (read-keyset 'test007-keyset))
(module test007-token GOVERNANCE
    (implements fungible-v2)
    (use fungible-util)
    (defschema entry balance:decimal guard:guard)
    (deftable ledger:{entry})
    (defcap GOVERNANCE () (enforce-guard (keyset-ref-guard 'test007-keyset)))
    (defcap DEBIT (sender:string) (enforce-guard (at 'guard (read ledger sender))))
    (defcap CREDIT (receiver:string) true)
    (defcap TRANSFER:bool (sender:string receiver:string amount:decimal)
        @managed amount TRANSFER-mgr
        (enforce-valid-transfer sender receiver (precision) amount)
        (compose-capability (DEBIT sender))
        (compose-capability (CREDIT receiver)))
    (defun TRANSFER-mgr:decimal (managed:decimal requested:decimal)
        (let ((newbal (- managed requested)))
            (enforce (>= newbal 0.0) (format "TRANSFER exceeded for balance {}" [managed]))
            newbal))
    (defconst MINIMUM_PRECISION 8)
    (defun create-account:string (account:string guard:guard)
        (enforce-valid-account account)
        (insert ledger account { "balance": 0.0, "guard": guard }))
    (defun get-balance:decimal (account:string) (at 'balance (read ledger account)))
    (defun precision:integer () MINIMUM_PRECISION)
    (defun transfer:string (sender:string receiver:string amount:decimal)
        (enforce (!= sender receiver) "sender cannot be the receiver of a transfer")
        (enforce-valid-amount (precision) amount)
        (with-capability (TRANSFER sender receiver amount)
            (with-read ledger sender { "balance" := from-bal }
                (with-read ledger receiver { "balance" := to-bal }
                    (update ledger sender { "balance": (- from-bal amount) })
                    (update ledger receiver { "balance": (+ to-bal amount) }))))))`; // Note: this is all one string

    const cmd = {
        type: "exec",
        code: tokenCode, // Use 'code' instead of 'pactCode'
        data: {
            "test007-keyset": {
                "keys": [PUBLIC_KEY],
                "pred": "keys-any"
            },
            "ns": "test007",
            "upgrade": false
        },
        networkId: "testnet04",
        chainId: CHAIN_ID,
        gasLimit: 100000,
        gasPrice: 0.000001,
        ttl: 28800,
        sender: "",
        caps: []
    };

    try {
        // Create the command for signing
        const commandToSign = {
            networkId: cmd.networkId,
            payload: {
                exec: {
                    data: cmd.data,
                    code: cmd.code,
                }
            },
            signers: [
                {
                    pubKey: PUBLIC_KEY,
                    clist: [
                        { name: "coin.GAS", args: [] }
                    ]
                }
            ],
            meta: {
                chainId: cmd.chainId,
                gasLimit: cmd.gasLimit,
                gasPrice: cmd.gasPrice,
                sender: cmd.sender,
                ttl: cmd.ttl
            },
            nonce: "test007-deployment-" + Math.random()
        };

        console.log("\n=== UNSIGNED TRANSACTION ===");
        console.log(JSON.stringify(commandToSign, null, 2));
        
        // Create Chainweaver preview URL
        const chainweaverUrl = `https://chainweaver.kadena.network/transaction-preview?cmd=${encodeURIComponent(JSON.stringify(cmd))}`;
        
        console.log("\n=== CHAINWEAVER PREVIEW URL ===");
        console.log(chainweaverUrl);
        
        return { commandToSign, chainweaverUrl };
    } catch (error) {
        console.error("Error preparing transaction:", error);
        throw error;
    }
}

async function main() {
    try {
        console.log("Creating unsigned deployment transaction...");
        const deployment = await createUnsignedDeployment();
        console.log("\nInstructions:");
        console.log("1. Use the Chainweaver Preview URL to review and sign the transaction");
        console.log("2. Deploy the token contract");
    } catch (error) {
        console.error("Failed to create unsigned transactions:", error);
    }
}

main();