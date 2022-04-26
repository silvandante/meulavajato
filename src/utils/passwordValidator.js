export function passwordValidator(password) {
    if (!password) return "Password can't be empty."
    if (password.length < 8) return 'Password must be at least 8 characters long.'

    var strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
    
    if(!strongRegex.test(password)) return "Sua senha deve conter:\n- Letra maíscula\n- Letra minúscula\n- Um número\n- Um caractere especial"
    

    return ''
}