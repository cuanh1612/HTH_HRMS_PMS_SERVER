export const compareDateTime = (date1: string, date2: string, inClock: string, outClock: string) => {
	console.log(inClock, outClock)
	if (new Date(date1).toLocaleString() == new Date(date2).toLocaleString()) {
		const inClockSplit = inClock.split(' ')
		const outClockSplit = outClock.split(' ')
		if (inClockSplit[1] == 'PM' && outClockSplit[1] == 'AM') {
			return true
		}
		const timeInClock = inClockSplit[0].split(':')
		const timeOutClock = outClockSplit[0].split(':')
		if (Number(timeInClock[0]) >= Number(timeOutClock[0])) {
			console.log('fxsdf')
			return true
		}
		if (
			timeInClock[0] == timeOutClock[0] &&
			timeOutClock[1] <= timeInClock[1] &&
			inClockSplit[1] == 'PM' &&
			outClockSplit[1] == 'AM'
		) {
			return true
		}
	}
	if (new Date(date1).toLocaleString() < new Date(date2).toLocaleString()) {
		return true
	}
	return false
}
