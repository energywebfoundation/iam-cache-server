**[iam-cache-server](../README.md)**

# Class: PublicResolverFactory

## Hierarchy

* ContractFactory

  ↳ **PublicResolverFactory**

## Index

### Constructors

* [constructor](publicresolverfactory.md#constructor)

### Properties

* [bytecode](publicresolverfactory.md#bytecode)
* [interface](publicresolverfactory.md#interface)
* [signer](publicresolverfactory.md#signer)

### Methods

* [attach](publicresolverfactory.md#attach)
* [connect](publicresolverfactory.md#connect)
* [deploy](publicresolverfactory.md#deploy)
* [getDeployTransaction](publicresolverfactory.md#getdeploytransaction)
* [connect](publicresolverfactory.md#connect)
* [fromSolidity](publicresolverfactory.md#fromsolidity)

## Constructors

### constructor

\+ **new PublicResolverFactory**(`signer?`: Signer): [PublicResolverFactory](publicresolverfactory.md)

*Overrides void*

#### Parameters:

Name | Type |
------ | ------ |
`signer?` | Signer |

**Returns:** [PublicResolverFactory](publicresolverfactory.md)

## Properties

### bytecode

• `Readonly` **bytecode**: string

*Inherited from [PublicResolverFactory](publicresolverfactory.md).[bytecode](publicresolverfactory.md#bytecode)*

___

### interface

• `Readonly` **interface**: Interface

*Inherited from [PublicResolverFactory](publicresolverfactory.md).[interface](publicresolverfactory.md#interface)*

___

### signer

• `Readonly` **signer**: Signer

*Inherited from [PublicResolverFactory](publicresolverfactory.md).[signer](publicresolverfactory.md#signer)*

## Methods

### attach

▸ **attach**(`address`: string): PublicResolver

*Overrides void*

#### Parameters:

Name | Type |
------ | ------ |
`address` | string |

**Returns:** PublicResolver

___

### connect

▸ **connect**(`signer`: Signer): [PublicResolverFactory](publicresolverfactory.md)

*Overrides void*

#### Parameters:

Name | Type |
------ | ------ |
`signer` | Signer |

**Returns:** [PublicResolverFactory](publicresolverfactory.md)

___

### deploy

▸ **deploy**(`_ens`: string, `overrides?`: TransactionOverrides): Promise<PublicResolver\>

*Overrides void*

#### Parameters:

Name | Type |
------ | ------ |
`_ens` | string |
`overrides?` | TransactionOverrides |

**Returns:** Promise<PublicResolver\>

___

### getDeployTransaction

▸ **getDeployTransaction**(`_ens`: string, `overrides?`: TransactionOverrides): UnsignedTransaction

*Overrides void*

#### Parameters:

Name | Type |
------ | ------ |
`_ens` | string |
`overrides?` | TransactionOverrides |

**Returns:** UnsignedTransaction

___

### connect

▸ `Static`**connect**(`address`: string, `signerOrProvider`: Signer \| Provider): PublicResolver

#### Parameters:

Name | Type |
------ | ------ |
`address` | string |
`signerOrProvider` | Signer \| Provider |

**Returns:** PublicResolver

___

### fromSolidity

▸ `Static`**fromSolidity**(`compilerOutput`: any, `signer?`: Signer): ContractFactory

*Inherited from [PublicResolverFactory](publicresolverfactory.md).[fromSolidity](publicresolverfactory.md#fromsolidity)*

#### Parameters:

Name | Type |
------ | ------ |
`compilerOutput` | any |
`signer?` | Signer |

**Returns:** ContractFactory
