export function emailValidator(email) {
    const re = /\S+@\S+\.\S+/
    if (!email) return "E-mail não pode ser vazio"
    if (!re.test(email)) return 'Ooops! Esse não é um endereço de e-mail vállido'
    return ''
}