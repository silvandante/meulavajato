import { theme } from "./theme"

export function getStatusColor(status, role) {
    switch(status){
        case "PENDING_MANAGER":
            return role=="MANAGER" ? theme.colors.primary : theme.colors.disabled
        case "PENDING_CLIENT":
            return role=="CLIENT" ? theme.colors.primary : theme.colors.disabled
        case "APPROVED":
            return theme.colors.accent
        case "IN_PARK":
            return theme.colors.error
        case "IN_PROGRESS":
            return theme.colors.notification
        case "CONCLUDED":
            return theme.colors.primary
        case "PAYED":
            return theme.colors.disabled
        case "CANCELED":
            return "red"
        case "WAITING_WASHER":
            return role=="CLIENT" ? theme.colors.error : role=="WASHER" ? theme.colors.primary : theme.colors.primary
    }
}