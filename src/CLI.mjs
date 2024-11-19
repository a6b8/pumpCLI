import inquirer from 'inquirer'
import figlet from 'figlet'
import chalk from 'chalk'

import { PumpFun } from './index.mjs'
import { config } from './data/config.mjs'



export class CLI {
    #config
    #pf
    #state


    constructor() {
        this.#state = {}

        return true
    }


    async start() {
        {
            const { solanaPrice, boundingDollarPrice } = config['meta']
            this.#addHeadline()
            this.#state['solanaPrice'] = await this.#setSolanaPrice( { solanaPrice } )
            this.#state['boundingDollarPrice'] = await this.#setBoundingDollarPrice( { boundingDollarPrice } )
        }

        {
            console.log()
            const { solanaPrice } = this.#state
            this.#pf = new PumpFun( false )
            this.#pf.init( { solanaPrice } )
            this.#pf.start()
        }

        return true
    }


    #addHeadline() {
        console.log(
            chalk.grey(
                figlet.textSync('PumpCLI', { horizontalLayout: 'full' })
            )
        )
    }


    async #setSolanaPrice( { solanaPrice } ) {
        const answers = await inquirer.prompt([
            {
                'type': 'input',
                'name': 'solanaPrice',
                'message': 'Enter the current Solana price:',
                'default': solanaPrice,
                'validate': ( value ) => {
                    if( isNaN( value ) ) {
                        return 'Please enter a number'
                    }
                    return true
                }
            }
        ])

        return  answers['solanaPrice']
    }


    async #setBoundingDollarPrice( { boundingDollarPrice }) {
        const answers = await inquirer.prompt([
            {
                'type': 'input',
                'name': 'boundingDollarPrice',
                'message': 'Enter the Bounding Dollar price:',
                'default': boundingDollarPrice,
                'validate': ( value ) => {
                    if( isNaN( value ) ) {
                        return 'Please enter a number'
                    }
                    return true
                }
            }
        ] )

        return  answers['boundingDollar']
    }
}