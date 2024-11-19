import { DynamicAsciiTable } from 'dynamic-ascii-table'
import ansiEscapes from 'ansi-escapes'


class Notify {
    #config
    #dt
    #selection
    #state


    constructor( { table, silent } ) {
        this.#config = { table }
        return true
    }


    init() {
        this.#state = {
            'selection': new Set(),
            'count': 0
        }

        this.#dt = new DynamicAsciiTable()
        const { headers } = this.#config['table']
        this.#dt.init( headers )

        const cfg = this.#dt.getConfig()
        // cfg['view']['sortResults'] = 'ASC'
        // cfg['table']['row']['fixedLength'] = 4
        // this.#dt.setConfig( { 'config': cfg } )

        return true
    }


    addSelection( { select } ) {
        this.#state['selection'].add( select )
        return true
    }


    print( { tokens } ) {
        const { selection } = this.#state
        if( selection.size <= 0 ) { return true }
        this.#updateTableValues( { tokens, selection } )
        this.#dt.print()
        selection.clear()
        return true
    }


    #updateTableValues( { tokens, selection } ) {
        const data = Array
            .from( tokens.entries() )
            // .filter( ( [ key, ] )  => selection.has( key ) )
            .sort( ( a, b )  => b[ 1 ]['vDollarInBondingCurve'] - a[ 1 ]['vDollarInBondingCurve'] )
            .filter( ( a, i ) => i < 4 )
            .forEach( ( [ key, v ], rowIndex ) => {
                const { name, sell, buy, total, vSolInBondingCurve, vDollarInBondingCurve, progress } = v
                const update = [
                    [ 'NAME', name ],
                    [ 'ADDRESS', key ],
                    [ 'TX',   `${total} (${buy}/${sell})`  ],
                    [ 'BOUND',  `${vDollarInBondingCurve.toFixed( 0 )} $` ], 
                    [ '%',  `${progress.toFixed( 0 )} %` ], 
                ]
                    .forEach( ( [ columnName, value ], i ) => {
                        const payload = { rowIndex, columnName, value }
                        // console.log( payload )
                        this.#dt.setValue( payload )
                    } )
            } )

        return true
    }
} 


export { Notify }