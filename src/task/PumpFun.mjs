import { config } from '../data/config.mjs'
import { Notify } from './Notify.mjs'


import WebSocket from 'ws'


class PumpFun {
    #config
    #silent
    #state
    #ws
    #notify


    constructor( silent ) {
        this.#silent = silent
        this.#config = config
        return true
    }


    init( { solanaPrice, boundingDollarPrice } ) {
        if( solanaPrice === undefined ) {
            solanaPrice = this.#config['meta']['solanaPrice']
            console.log( `- Add Solana Price\t${solanaPrice} $ (default)` )
        } else {
            console.log( `- Add Solana Price\t${solanaPrice} $` )
        }

        if( boundingDollarPrice === undefined ) {
            boundingDollarPrice = this.#config['meta']['boundingDollarPrice']
            console.log( `- Add Bounding Dollar\t${boundingDollarPrice} $ (default)` )
        } else {
            console.log( `- Add Bounding Dollar\t${boundingDollarPrice} $` )
        }

        this.#state = {
            'tokens': new Map(),
            'websocketWaitForConfirmation': new Set(),
            'updateSubscription': false,
            'count': 0,
            solanaPrice,
            boundingDollarPrice
        }

        const { table } = this.#config['print']
        this.#notify = new Notify( { table, 'silent': this.#silent } )
        this.#notify.init()
        return true
    }


    start() {
        this.#ws = this.#addWebsocket()
        this.#addListener()
        this.#addCleanExit()
        return true
    }


    #addCleanExit() {
        process.on( 'SIGINT', this.#cleanExit )
        process.on( 'SIGTERM', this.#cleanExit )
        process.on( 'uncaughtException', ( err ) => {
            console.error( 'Uncaught Exception:', err )
            this.#cleanExit()
        } )
    }


    #addWebsocket() {
        const { wss } = this.#config['pumpportal']
        if( !this.#silent) { 
            console.log( `- Add Websocket\t\t${wss}` ) 
        }
        const ws = new WebSocket( wss )
        ws.on( 'open', () => {
            this.#updateWebsocket( { 
                'channelKey': 'token',
                'task': 'subscribe'
            } )
        } )

        return ws
    }


    #addListener() {
        this.#ws.on( 'message', ( dataRaw ) => {
            try {
                const data = JSON.parse( dataRaw )
                const { channelKey, method, keys } = data
                this.#messageRouter( { data } )
                this.#websocketRouter()
                const { tokens } = this.#state
                this.#notify.print( { tokens } )
            } catch( e ) {
                console.log( 'Parse Error', e )
            }

// console.log()
            return true
        } )
        return true
    }


    #websocketRouter() {
// console.log( 'E')
        if( !this.#state['updateSubscription'] ) {
            return true
        }
// console.log( '1')
        if( !this.#state['websocketWaitForConfirmation'].size === 0 ) {
            return true
        }
// console.log( '2')
        const keys = Array.from( this.#state['tokens'].keys() )
        this.#updateWebsocket( { 
            'channelKey': 'trade',
            'task': 'subscribe',
            'keys': keys
        } )
        this.#state['updateSubscription'] = false
// console.log( '3')
    }


    #updateWebsocket( { channelKey, task, keys=undefined } ) {
        const method = this.#config['pumpportal']['channels'][ channelKey ][ task ]
        const payload = { method, keys }
// console.log( 'payload', payload )
        this.#ws.send( JSON.stringify( payload ) )
        this.#state['websocketWaitForConfirmation'].add( channelKey )

        return true
    }


    #messageRouter( { data } ) {
// console.log( 'A')
        const { message } = data
        if( message === undefined ) {
// console.log( 'B')
            this.#dataRouter( { data } )
            return true
        } else if( typeof message === 'string' ) {
// console.log( 'C' )
            this.#setMessage( { data, message } )
            return true
        }

        return true
    }


    #dataRouter( { data } ) {
        const { solanaPrice, boundingDollarPrice } = this.#state

        const { txType } = data
        if( txType === 'create' ) {
// console.log( '1')
            this.#createToken( { data, solanaPrice, boundingDollarPrice } )
        } else if( txType === 'sell' || txType === 'buy' ) {
// console.log( '2')
            this.#updateToken( { data, solanaPrice, boundingDollarPrice } )
        }
    }


    #createToken( { data, solanaPrice, boundingDollarPrice } ) {
        const { traderPublicKey, name, mint, vSolInBondingCurve } = data
        const struct = {
            traderPublicKey,
            name,
            'expirationDateInSeconds': Date.now() + this.#config['pumpportal']['expiringAfterInSeconds'],   
            'sell': 0,
            'buy': 0,
            'total': 0,
            vSolInBondingCurve,
            'vDollarInBondingCurve': vSolInBondingCurve * solanaPrice,
            'progress': null
        }
        struct['progress'] = ( struct['vDollarInBondingCurve'] * 100 ) / boundingDollarPrice
        if( !this.#state['tokens'].has( mint ) ) {
            // not created
        }

        this.#state['tokens'].set( mint, struct )
        this.#notify.addSelection( { 'select': mint } )

        this.#state['updateSubscription'] = true
        return true
    }


    
    #updateToken( { data, solanaPrice, boundingDollarPrice } ) {
        const { mint, txType, amount, vSolInBondingCurve } = data
        const obj = this.#state['tokens'].get( mint )
        if( txType === 'sell' ) {
            obj['sell'] += 1 // amount
        } else if( txType === 'buy' ) {
            obj['buy'] += 1 // amount
        }
        obj['vSolInBondingCurve'] = vSolInBondingCurve
        obj['total'] = obj['sell'] + obj['buy']
        obj['vDollarInBondingCurve'] = vSolInBondingCurve * solanaPrice
        obj['progress'] = ( obj['vDollarInBondingCurve'] * 100 ) / boundingDollarPrice

        this.#state['tokens'].set( mint, obj )
        this.#notify.addSelection( { 'select': mint } )

        return true
    }

 

    #setMessage( { data, message } ) {
        const channel = Object
            .entries( this.#config['pumpportal']['channels'] )
            .map( ( [ key, value ] ) => [ key, value['confirmation'] ] )
            .find( ( [ key, value ] ) => value === message )
        if( channel === undefined ) {
            console.log( 'Unknown message', message )
            return true
        }
// console.log( '1' )
        const [ channelKey, ] = channel
        this.#state['websocketWaitForConfirmation'].delete( channelKey )

        return true
    }


    #cleanExit = () => {
        if (this.#ws.readyState === WebSocket.OPEN) {
          console.log( 'Closing WebSocket connection...' )
          this.#ws.close( 1000, 'Process is shutting down' )
        } else {
          console.log( 'WebSocket already closed.' )
        }
        process.exit( 0 )

        return true
    }
}


export { PumpFun }