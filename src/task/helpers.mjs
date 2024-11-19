function getCurrentTimestampInSeconds() {
    const nowInMilliseconds = Date.now()
    const nowInSeconds = Math.floor( nowInMilliseconds / 1000 )

    return nowInSeconds
}


export { getCurrentTimestampInSeconds }