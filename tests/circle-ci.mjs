import { PumpFun } from '../src/index.mjs'

try {
    const pumpfun = new PumpFun()
    pumpfun.init( { 'solanaPrice': 0 } )

    console.log( 'Success' )
    process.exit( 0 )
} catch( e ) {
    console.log( `Failed: ${e}` )
    process.exit( 1 )
}



