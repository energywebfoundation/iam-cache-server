export const address = '0xd7CeF70Ba7efc2035256d828d5287e2D285CD1ac';

export const abi = {
  contractName: 'EthereumDIDRegistry',
  abi: [
    {
      constant: true,
      inputs: [
        {
          name: '',
          type: 'address',
        },
      ],
      name: 'owners',
      outputs: [
        {
          name: '',
          type: 'address',
        },
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [
        {
          name: '',
          type: 'address',
        },
        {
          name: '',
          type: 'bytes32',
        },
        {
          name: '',
          type: 'address',
        },
      ],
      name: 'delegates',
      outputs: [
        {
          name: '',
          type: 'uint256',
        },
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [
        {
          name: '',
          type: 'address',
        },
      ],
      name: 'nonce',
      outputs: [
        {
          name: '',
          type: 'uint256',
        },
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [
        {
          name: '',
          type: 'address',
        },
      ],
      name: 'changed',
      outputs: [
        {
          name: '',
          type: 'uint256',
        },
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          name: 'identity',
          type: 'address',
        },
        {
          indexed: false,
          name: 'owner',
          type: 'address',
        },
        {
          indexed: false,
          name: 'previousChange',
          type: 'uint256',
        },
      ],
      name: 'DIDOwnerChanged',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          name: 'identity',
          type: 'address',
        },
        {
          indexed: false,
          name: 'delegateType',
          type: 'bytes32',
        },
        {
          indexed: false,
          name: 'delegate',
          type: 'address',
        },
        {
          indexed: false,
          name: 'validTo',
          type: 'uint256',
        },
        {
          indexed: false,
          name: 'previousChange',
          type: 'uint256',
        },
      ],
      name: 'DIDDelegateChanged',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          name: 'identity',
          type: 'address',
        },
        {
          indexed: false,
          name: 'name',
          type: 'bytes32',
        },
        {
          indexed: false,
          name: 'value',
          type: 'bytes',
        },
        {
          indexed: false,
          name: 'validTo',
          type: 'uint256',
        },
        {
          indexed: false,
          name: 'previousChange',
          type: 'uint256',
        },
      ],
      name: 'DIDAttributeChanged',
      type: 'event',
    },
    {
      constant: true,
      inputs: [
        {
          name: 'identity',
          type: 'address',
        },
      ],
      name: 'identityOwner',
      outputs: [
        {
          name: '',
          type: 'address',
        },
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [
        {
          name: 'identity',
          type: 'address',
        },
        {
          name: 'delegateType',
          type: 'bytes32',
        },
        {
          name: 'delegate',
          type: 'address',
        },
      ],
      name: 'validDelegate',
      outputs: [
        {
          name: '',
          type: 'bool',
        },
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        {
          name: 'identity',
          type: 'address',
        },
        {
          name: 'newOwner',
          type: 'address',
        },
      ],
      name: 'changeOwner',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        {
          name: 'identity',
          type: 'address',
        },
        {
          name: 'sigV',
          type: 'uint8',
        },
        {
          name: 'sigR',
          type: 'bytes32',
        },
        {
          name: 'sigS',
          type: 'bytes32',
        },
        {
          name: 'newOwner',
          type: 'address',
        },
      ],
      name: 'changeOwnerSigned',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        {
          name: 'identity',
          type: 'address',
        },
        {
          name: 'delegateType',
          type: 'bytes32',
        },
        {
          name: 'delegate',
          type: 'address',
        },
        {
          name: 'validity',
          type: 'uint256',
        },
      ],
      name: 'addDelegate',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        {
          name: 'identity',
          type: 'address',
        },
        {
          name: 'sigV',
          type: 'uint8',
        },
        {
          name: 'sigR',
          type: 'bytes32',
        },
        {
          name: 'sigS',
          type: 'bytes32',
        },
        {
          name: 'delegateType',
          type: 'bytes32',
        },
        {
          name: 'delegate',
          type: 'address',
        },
        {
          name: 'validity',
          type: 'uint256',
        },
      ],
      name: 'addDelegateSigned',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        {
          name: 'identity',
          type: 'address',
        },
        {
          name: 'delegateType',
          type: 'bytes32',
        },
        {
          name: 'delegate',
          type: 'address',
        },
      ],
      name: 'revokeDelegate',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        {
          name: 'identity',
          type: 'address',
        },
        {
          name: 'sigV',
          type: 'uint8',
        },
        {
          name: 'sigR',
          type: 'bytes32',
        },
        {
          name: 'sigS',
          type: 'bytes32',
        },
        {
          name: 'delegateType',
          type: 'bytes32',
        },
        {
          name: 'delegate',
          type: 'address',
        },
      ],
      name: 'revokeDelegateSigned',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        {
          name: 'identity',
          type: 'address',
        },
        {
          name: 'name',
          type: 'bytes32',
        },
        {
          name: 'value',
          type: 'bytes',
        },
        {
          name: 'validity',
          type: 'uint256',
        },
      ],
      name: 'setAttribute',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        {
          name: 'identity',
          type: 'address',
        },
        {
          name: 'sigV',
          type: 'uint8',
        },
        {
          name: 'sigR',
          type: 'bytes32',
        },
        {
          name: 'sigS',
          type: 'bytes32',
        },
        {
          name: 'name',
          type: 'bytes32',
        },
        {
          name: 'value',
          type: 'bytes',
        },
        {
          name: 'validity',
          type: 'uint256',
        },
      ],
      name: 'setAttributeSigned',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        {
          name: 'identity',
          type: 'address',
        },
        {
          name: 'name',
          type: 'bytes32',
        },
        {
          name: 'value',
          type: 'bytes',
        },
      ],
      name: 'revokeAttribute',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        {
          name: 'identity',
          type: 'address',
        },
        {
          name: 'sigV',
          type: 'uint8',
        },
        {
          name: 'sigR',
          type: 'bytes32',
        },
        {
          name: 'sigS',
          type: 'bytes32',
        },
        {
          name: 'name',
          type: 'bytes32',
        },
        {
          name: 'value',
          type: 'bytes',
        },
      ],
      name: 'revokeAttributeSigned',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
  ],
  bytecode: '0x608060405234801561001057600080fd5b50612273806100206000396000f3006080604052600436106100e5576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff168062c023da146100ea578063022914a7146101815780630d44625b14610204578063123b5e9814610289578063240cf1fa14610353578063622b2a3c146103df57806370ae92d2146104685780637ad4b0a4146104bf57806380b29f7c146105605780638733d4e8146105d157806393072684146106545780639c2c1b2b146106ee578063a7068d6614610792578063e476af5c1461080d578063f00d4b5d146108cd578063f96d0f9f14610930575b600080fd5b3480156100f657600080fd5b5061017f600480360381019080803573ffffffffffffffffffffffffffffffffffffffff1690602001909291908035600019169060200190929190803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509192919290505050610987565b005b34801561018d57600080fd5b506101c2600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610998565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34801561021057600080fd5b50610273600480360381019080803573ffffffffffffffffffffffffffffffffffffffff1690602001909291908035600019169060200190929190803573ffffffffffffffffffffffffffffffffffffffff1690602001909291905050506109cb565b6040518082815260200191505060405180910390f35b34801561029557600080fd5b50610351600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803560ff169060200190929190803560001916906020019092919080356000191690602001909291908035600019169060200190929190803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509192919290803590602001909291905050506109fd565b005b34801561035f57600080fd5b506103dd600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803560ff16906020019092919080356000191690602001909291908035600019169060200190929190803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610c72565b005b3480156103eb57600080fd5b5061044e600480360381019080803573ffffffffffffffffffffffffffffffffffffffff1690602001909291908035600019169060200190929190803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610ec1565b604051808215151515815260200191505060405180910390f35b34801561047457600080fd5b506104a9600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610f86565b6040518082815260200191505060405180910390f35b3480156104cb57600080fd5b5061055e600480360381019080803573ffffffffffffffffffffffffffffffffffffffff1690602001909291908035600019169060200190929190803590602001908201803590602001908080601f016020809104026020016040519081016040528093929190818152602001838380828437820191505050505050919291929080359060200190929190505050610f9e565b005b34801561056c57600080fd5b506105cf600480360381019080803573ffffffffffffffffffffffffffffffffffffffff1690602001909291908035600019169060200190929190803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610fb1565b005b3480156105dd57600080fd5b50610612600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610fc2565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34801561066057600080fd5b506106ec600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803560ff169060200190929190803560001916906020019092919080356000191690602001909291908035600019169060200190929190803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050611058565b005b3480156106fa57600080fd5b50610790600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803560ff169060200190929190803560001916906020019092919080356000191690602001909291908035600019169060200190929190803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803590602001909291905050506112b9565b005b34801561079e57600080fd5b5061080b600480360381019080803573ffffffffffffffffffffffffffffffffffffffff1690602001909291908035600019169060200190929190803573ffffffffffffffffffffffffffffffffffffffff16906020019092919080359060200190929190505050611524565b005b34801561081957600080fd5b506108cb600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803560ff169060200190929190803560001916906020019092919080356000191690602001909291908035600019169060200190929190803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509192919290505050611537565b005b3480156108d957600080fd5b5061092e600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803573ffffffffffffffffffffffffffffffffffffffff1690602001909291905050506117a2565b005b34801561093c57600080fd5b50610971600480360381019080803573ffffffffffffffffffffffffffffffffffffffff1690602001909291905050506117b1565b6040518082815260200191505060405180910390f35b610993833384846117c9565b505050565b60006020528060005260406000206000915054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600160205282600052604060002060205281600052604060002060205280600052604060002060009250925050505481565b600060197f01000000000000000000000000000000000000000000000000000000000000000260007f01000000000000000000000000000000000000000000000000000000000000000230600360008c73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020548b88888860405180897effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff19167effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff19168152600101887effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff19167effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff191681526001018773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166c010000000000000000000000000281526014018681526020018573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166c01000000000000000000000000028152601401807f7365744174747269627574650000000000000000000000000000000000000000815250600c01846000191660001916815260200183805190602001908083835b602083101515610c135780518252602082019150602081019050602083039250610bee565b6001836020036101000a0380198251168184511680821785525050505050509050018281526020019850505050505050505060405180910390209050610c6888610c608a8a8a8a8761196c565b868686611a90565b5050505050505050565b600060197f01000000000000000000000000000000000000000000000000000000000000000260007f0100000000000000000000000000000000000000000000000000000000000000023060036000610cca8b610fc2565b73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054898660405180877effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff19167effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff19168152600101867effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff19167effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff191681526001018573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166c010000000000000000000000000281526014018481526020018373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166c01000000000000000000000000028152601401807f6368616e67654f776e6572000000000000000000000000000000000000000000815250600b018273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166c01000000000000000000000000028152601401965050505050505060405180910390209050610eb986610eb3888888888761196c565b84611c35565b505050505050565b600080600160008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008560405180826000191660001916815260200191505060405180910390206000191660001916815260200190815260200160002060008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205490504281119150509392505050565b60036020528060005260406000206000915090505481565b610fab8433858585611a90565b50505050565b610fbd83338484611e02565b505050565b6000806000808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905060008173ffffffffffffffffffffffffffffffffffffffff1614151561104e57809150611052565b8291505b50919050565b600060197f01000000000000000000000000000000000000000000000000000000000000000260007f01000000000000000000000000000000000000000000000000000000000000000230600360006110b08c610fc2565b73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020548a878760405180887effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff19167effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff19168152600101877effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff19167effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff191681526001018673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166c010000000000000000000000000281526014018581526020018473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166c01000000000000000000000000028152601401807f7265766f6b6544656c6567617465000000000000000000000000000000000000815250600e0183600019166000191681526020018273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166c01000000000000000000000000028152601401975050505050505050604051809103902090506112b0876112a9898989898761196c565b8585611e02565b50505050505050565b600060197f01000000000000000000000000000000000000000000000000000000000000000260007f01000000000000000000000000000000000000000000000000000000000000000230600360006113118d610fc2565b73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020548b88888860405180897effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff19167effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff19168152600101887effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff19167effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff191681526001018773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166c010000000000000000000000000281526014018681526020018573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166c01000000000000000000000000028152601401807f61646444656c6567617465000000000000000000000000000000000000000000815250600b0184600019166000191681526020018373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166c01000000000000000000000000028152601401828152602001985050505050505050506040518091039020905061151a886115128a8a8a8a8761196c565b868686612022565b5050505050505050565b6115318433858585612022565b50505050565b600060197f01000000000000000000000000000000000000000000000000000000000000000260007f01000000000000000000000000000000000000000000000000000000000000000230600360008b73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020548a878760405180887effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff19167effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff19168152600101877effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff19167effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff191681526001018673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166c010000000000000000000000000281526014018581526020018473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166c01000000000000000000000000028152601401807f7265766f6b654174747269627574650000000000000000000000000000000000815250600f01836000191660001916815260200182805190602001908083835b60208310151561174c5780518252602082019150602081019050602083039250611727565b6001836020036101000a0380198251168184511680821785525050505050509050019750505050505050506040518091039020905061179987611792898989898761196c565b85856117c9565b50505050505050565b6117ad823383611c35565b5050565b60026020528060005260406000206000915090505481565b83836117d482610fc2565b73ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1614151561180d57600080fd5b8573ffffffffffffffffffffffffffffffffffffffff167f18ab6b2ae3d64306c00ce663125f2bd680e441a098de1635bd7ad8b0d44965e485856000600260008c73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205460405180856000191660001916815260200180602001848152602001838152602001828103825285818151815260200191508051906020019080838360005b838110156118e35780820151818401526020810190506118c8565b50505050905090810190601f1680156119105780820380516001836020036101000a031916815260200191505b509550505050505060405180910390a243600260008873ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550505050505050565b600080600183878787604051600081526020016040526040518085600019166000191681526020018460ff1660ff1681526020018360001916600019168152602001826000191660001916815260200194505050505060206040516020810390808403906000865af11580156119e6573d6000803e3d6000fd5b5050506020604051035190506119fb87610fc2565b73ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16141515611a3457600080fd5b600360008873ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600081548092919060010191905055508091505095945050505050565b8484611a9b82610fc2565b73ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16141515611ad457600080fd5b8673ffffffffffffffffffffffffffffffffffffffff167f18ab6b2ae3d64306c00ce663125f2bd680e441a098de1635bd7ad8b0d44965e48686864201600260008d73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205460405180856000191660001916815260200180602001848152602001838152602001828103825285818151815260200191508051906020019080838360005b83811015611bab578082015181840152602081019050611b90565b50505050905090810190601f168015611bd85780820380516001836020036101000a031916815260200191505b509550505050505060405180910390a243600260008973ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000208190555050505050505050565b8282611c4082610fc2565b73ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16141515611c7957600080fd5b826000808773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508473ffffffffffffffffffffffffffffffffffffffff167f38a5a6e68f30ed1ab45860a4afb34bcb2fc00f22ca462d249b8a8d40cda6f7a384600260008973ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054604051808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018281526020019250505060405180910390a243600260008773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055505050505050565b8383611e0d82610fc2565b73ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16141515611e4657600080fd5b42600160008873ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008660405180826000191660001916815260200191505060405180910390206000191660001916815260200190815260200160002060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508573ffffffffffffffffffffffffffffffffffffffff167f5a5084339536bcab65f20799fcc58724588145ca054bd2be626174b27ba156f7858542600260008c73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020546040518085600019166000191681526020018473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200183815260200182815260200194505050505060405180910390a243600260008873ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550505050505050565b848461202d82610fc2565b73ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1614151561206657600080fd5b824201600160008973ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008760405180826000191660001916815260200191505060405180910390206000191660001916815260200190815260200160002060008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508673ffffffffffffffffffffffffffffffffffffffff167f5a5084339536bcab65f20799fcc58724588145ca054bd2be626174b27ba156f78686864201600260008d73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020546040518085600019166000191681526020018473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200183815260200182815260200194505050505060405180910390a243600260008973ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550505050505050505600a165627a7a72305820ce15794c08edea0fae7ce9c85210f71a312b60c8d5cb2e5fd716c2adcd7403c70029',
  compiler: {
    name: 'solc',
    version: '0.4.24+commit.e67f0147.Emscripten.clang',
  },
  schemaVersion: '2.0.0',
  updatedAt: '2019-06-00T00:00:00.000Z',
};