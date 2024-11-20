![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)

# PumpCLI

```
  ____                                 ____   _       ___ 
 |  _ \   _   _   _ __ ___    _ __    / ___| | |     |_ _|
 | |_) | | | | | | '_ ` _ \  | '_ \  | |     | |      | | 
 |  __/  | |_| | | | | | | | | |_) | | |___  | |___   | | 
 |_|      \__,_| |_| |_| |_| | .__/   \____| |_____| |___|
                             |_|                          
```

With this CLI, the newly created `pump.fun` tokens can be queried via `pumpportal.fun`. This demo application currently maintains the connection for only one minute.

## Features:
The following features are included:
- Input of parameters through an interface
- Simple presentation

## Quickstart

The module is best controlled via the CLI. Use the following:

```
npm i
npm link
pumpfun
```

## Table of Contents
- [PumpCLI](#pumpcli)
  - [Features:](#features)
  - [Quickstart](#quickstart)
  - [Table of Contents](#table-of-contents)
  - [Methods](#methods)
    - [constructor()](#constructor)
    - [init()](#init)
    - [start()](#start)
  - [License](#license)

## Methods

### constructor()

The module is instantiated as a class via the constructor.

**Method**
```js
.constructor(silent)
```

| Key                | Type      | Description                                         | Required |
|--------------------|-----------|-----------------------------------------------------|----------|
| silent             | boolean   | Terminal outputs can be suppressed.                | No       |

**Example**
```js
import { PumpFun } from './src/index.mjs'

const pf = new PumpFun(false)
```

**Returns**
```js
true
```

### init()

This method sets all relevant variables and creates an internal `state`. It can be reset at any time by calling it again.

**Method**
```js
.init({ solanaPrice, boundingDollarPrice })
```

| Key                | Type      | Description                                                                                                                  | Required |
|--------------------|-----------|------------------------------------------------------------------------------------------------------------------------------|----------|
| solanaPrice        | Integer   | A manual price for 1 SOL can be set here. This is important for calculating prices. If no price is set, a `default` price will be used. | No       |
| boundingDollarPrice| Integer   | This amount specifies when the token is fully deployed. If no value is provided, a `default` value will be used.             | No      |

**Example**
```js
import { PumpFun } from './src/index.mjs'

const pf = new PumpFun(false)
pf.init({
    'solanaPrice': 250,
    'boundingDollarPrice': 90000
})
```

**Returns**
```js
true
```

### start()

This method establishes the connection and executes all necessary WebSocket subscriptions.

**Method**
```js
.start()
```

**Example**
```js
import { PumpFun } from './src/index.mjs'

const pf = new PumpFun(false)
pf.init({
    'solanaPrice': 250,
    'boundingDollarPrice': 90000
})
pf.start()
```

**Returns**
```js
true
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.