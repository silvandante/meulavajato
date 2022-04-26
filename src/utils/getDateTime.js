export const getDate = (date) => {
    const completeDate = date.split("T")
    const templateDate = completeDate[0].split("-")
    return templateDate[0]+"/"+templateDate[1]+"/"+templateDate[2]
}

export const getTime = (time) => {
    const completeDate = time.split(".")
    const templateTime = completeDate[0].split(":")
    return templateTime[0]+"h"+templateTime[1]
}