export function getStatus(status, role) {
    switch(status){
        case "PENDING_MANAGER":
            return role=="MANAGER" ? "Responder" : "Pendente"
        case "PENDING_CLIENT":
            return role=="CLIENT" ? "Responder" : "Pendente"
        case "APPROVED":
            return "Aprovado"
        case "IN_PARK":
            return "Estacionado"
        case "IN_PROGRESS":
            return "Lavagem\niniciada"
        case "CONCLUDED":
            return "Concluído\nFalta\nPagamento"
        case "PAYED":
            return "Concluído\nPago"
        case "CANCELED":
            return "Cancelado"
        case "WAITING_WASHER":
            return role=="CLIENT" ? "Estacionado" : role=="WASHER" ? "Responder" : "Aguardando Lavador"
    }
}