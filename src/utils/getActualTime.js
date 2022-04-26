import { isNullOrEmpty } from "./isNullOrEmpty"

export function getActualTime(item) {
    var result
    if(!isNullOrEmpty(item.acceptedTime)) {
        result = item.acceptedTime
    } else {
        if(!isNullOrEmpty(item.suggestedTime)) {
            result = item.suggestedTime
        } else {
            result = item.originalTime
        }
    }
    return result.split(" UTC")[0]
}