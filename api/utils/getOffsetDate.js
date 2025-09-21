export default offset => {
    if (offset.permament === true)
        return null

    offset = {
        days: offset.days ?? 0,
        hours: offset.hours ?? 0,
        minutes: offset.minutes ?? 0,
        seconds: offset.seconds ?? 0,
    }

    const totalSeconds = 1000 * (offset.seconds + (60 * offset.minutes) + (60 * 60 * offset.hours) + (60 * 60 * 24 * offset.days))

    return new Date(new Date().getTime() + totalSeconds)
}