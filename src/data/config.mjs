const config = {
    'meta': {
        'solanaPrice': 200,
        'boundingDollarPrice': 90000,
    },
    'pumpportal': {
        'wss': 'wss://pumpportal.fun/api/data',
        'expiringAfterInSeconds': 60 * 1,
        'garbageCollectionIntervalInSeconds': 60 * 5,
        'channels': {
            'token': {
                'subscribe': 'subscribeNewToken',
                'unsubscribe': 'unsubscribeNewToken',
                'confirmation': 'Successfully subscribed to token creation events.'
            },
            'trade': {
                'subscribe': 'subscribeTokenTrade',
                'unsubscribe': 'unsubscribeTokenTrade',
                'confirmation': 'Successfully subscribed to keys.'
            },
            'account': {
                'subscribe': 'subscribeAccountTrade',
                'unsubscribe': 'unsubscribeAccountTrade',
                'confirmation': 'Successfully subscribed to keys'
            }
        }
    },
    'print': {
        'table': {
            'headers': { 
                'columnNames':      [ '#', 'NAME', 'ADDRESS', 'BOUND', 'TX', '%' ],
                'columnLengths':    [ 1, 20, 44, 7, 15, 5 ],
                'columnAlignments': [ 'left', 'left', 'left', 'right', 'left', 'right' ], 
                'headerAlignment': 'left'
            },
            'maxRows': 10
        },
    }
}


export { config }