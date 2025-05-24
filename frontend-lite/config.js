const CONTRACT_ADDRESS = "0xFcDdCAAC4206D8A7084bF905866a9cD3DA61F9b9";

const ABI = [{
    "anonymous": false,
    "inputs": [
        {
            "indexed": false,
            "internalType": "uint256",
            "name": "pollId",
            "type": "uint256"
        },
        {
            "indexed": false,
            "internalType": "string",
            "name": "question",
            "type": "string"
        },
        {
            "indexed": false,
            "internalType": "string[]",
            "name": "options",
            "type": "string[]"
        },
        {
            "indexed": false,
            "internalType": "uint256",
            "name": "deadline",
            "type": "uint256"
        },
        {
            "indexed": false,
            "internalType": "address",
            "name": "owner",
            "type": "address"
        }
    ],
    "name": "PollCreated",
    "type": "event"
},
{
    "anonymous": false,
    "inputs": [
        {
            "indexed": false,
            "internalType": "uint256",
            "name": "pollId",
            "type": "uint256"
        },
        {
            "indexed": false,
            "internalType": "address",
            "name": "voter",
            "type": "address"
        },
        {
            "indexed": false,
            "internalType": "uint256",
            "name": "optionIndex",
            "type": "uint256"
        }
    ],
    "name": "Voted",
    "type": "event"
},
{
    "inputs": [
        {
            "internalType": "string",
            "name": "q",
            "type": "string"
        },
        {
            "internalType": "string[]",
            "name": "opts",
            "type": "string[]"
        },
        {
            "internalType": "uint256",
            "name": "dur",
            "type": "uint256"
        }
    ],
    "name": "createPoll",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
},
{
    "inputs": [
        {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
        }
    ],
    "name": "getPollDetails",
    "outputs": [
        {
            "internalType": "string",
            "name": "question",
            "type": "string"
        },
        {
            "internalType": "string[]",
            "name": "options",
            "type": "string[]"
        },
        {
            "internalType": "uint256",
            "name": "deadline",
            "type": "uint256"
        },
        {
            "internalType": "address",
            "name": "owner",
            "type": "address"
        }
    ],
    "stateMutability": "view",
    "type": "function"
},
{
    "inputs": [
        {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
        }
    ],
    "name": "getResults",
    "outputs": [
        {
            "internalType": "uint256[]",
            "name": "",
            "type": "uint256[]"
        }
    ],
    "stateMutability": "view",
    "type": "function"
},
{
    "inputs": [],
    "name": "pollCount",
    "outputs": [
        {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
        }
    ],
    "stateMutability": "view",
    "type": "function"
},
{
    "inputs": [
        {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
        }
    ],
    "name": "polls",
    "outputs": [
        {
            "internalType": "string",
            "name": "question",
            "type": "string"
        },
        {
            "internalType": "uint256",
            "name": "deadline",
            "type": "uint256"
        },
        {
            "internalType": "address",
            "name": "owner",
            "type": "address"
        }
    ],
    "stateMutability": "view",
    "type": "function"
},
{
    "inputs": [
        {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
        },
        {
            "internalType": "uint256",
            "name": "opt",
            "type": "uint256"
        }
    ],
    "name": "vote",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
},
{
    "inputs": [
        {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
        },
        {
            "internalType": "address",
            "name": "",
            "type": "address"
        }
    ],
    "name": "voted",
    "outputs": [
        {
            "internalType": "bool",
            "name": "",
            "type": "bool"
        }
    ],
    "stateMutability": "view",
    "type": "function"
}];