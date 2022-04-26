import React, { useEffect, useState } from "react"

import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity
} from "react-native"

import { NavigationActions, CommonActions } from '@react-navigation/native';
import { Title, TextInput, Button, HelperText, ActivityIndicator } from 'react-native-paper';
import { emailValidator } from "../utils/emailValidator";
import { passwordValidator } from "../utils/passwordValidator";
import { theme } from "../utils/theme";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/actions";
import { auth, database } from "../config/firebaseconfig";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Login = ({ navigation }) => { 
    const dispatch = useDispatch()

    const [email, setEmail] = useState({ value: '', error: '' })
    const [password, setPassword] = useState({ value: '', error: '' })
    const [loginError, setLoginError] = useState('')
    const [loading, setLoading] = useState(false)
    const [successEmailReset, setSuccessEmailReset] = useState("")

    useEffect(() => {
        setLoading(true)

        getUserData().then((data) => {
            if(data != null) {
                const user__ = JSON.parse(data)
                dispatch(
                    setUser(user__)
                )

                const resetAction = CommonActions.reset({
                    index: 1,
                    routes: [{ name: "Dashboard"}]
                })

                navigation.dispatch(resetAction)

                return
            } else {
                setLoading(false)
            }
        })

        const unsubscribe = auth.onAuthStateChanged(user => {
            if(user) {
                database.collection("users").doc(user.uid).onSnapshot((query) => {  
                    const data = query.data()

                    const _user = {
                        email: data.email,
                        uid: user.uid,
                        role: data.role,
                        name: data.name,
                        phone: data.phone
                    }

                    dispatch(
                        setUser(_user)
                    )

                    const resetAction = CommonActions.reset({
                        index: 1,
                        routes: [{ name: "Dashboard"}]
                    })


                    storeData(_user).then(() => {
                        navigation.dispatch(resetAction)
                    })
                })
            }
        })

        return unsubscribe
    }, [])

    const _onLoginPressed = () => {
        setLoading(true)
        setLoginError('')
        setSuccessEmailReset('')
        const emailError = emailValidator(email.value)
        const passwordError = password.value != null ? "" : "Senha não pode ser vazio"

        if (emailError || passwordError) {
            setEmail({ ...email, error: emailError });
            setPassword({ ...password, error: passwordError })
            setLoading(false)
            return
        }

        auth
            .signInWithEmailAndPassword(email.value, password.value)
            .then(userCredentials => {
                const user = userCredentials.user
            })
            .catch(error => {
                setLoginError("Não foi possível realizar login com essas credenciais")
                setLoading(false)
            })
    
    }

    const storeData = async (value) => {
        await AsyncStorage.setItem('meulavajato@user', JSON.stringify(value))
    }

    const getUserData = async () => {
        try {
          const value = await AsyncStorage.getItem('meulavajato@user')
          if(value !== null) {
            return value
          } else {
              return null
          }
        } catch(e) {
          alert(JSON.stringify(e))
        }
    }

    const handlePasswordReset = async () => {
        setLoading(true)
        setLoginError('')
        const emailError = emailValidator(email.value)

        if (emailError) {
            setEmail({ ...email, error: emailError })
            setLoading(false)
            return
        }
      
        await auth.sendPasswordResetEmail(email.value)
            .then(() => {
                setLoading(false)
                setSuccessEmailReset("Sucesso! Cheque seu e-mail para criar nova senha")
            }).catch(function (e) {
                setLoading(false)
                setLoginError("Opa! Erro ao enviar e-mail de recuperação")
            })
      }

    return(
        <View style={styles.container}>
            <Title>Bem vindo ao Meu Lava Jato.</Title>

            <TextInput
                label="Email"
                returnKeyType="next"
                disabled={loading}
                value={email.value}
                onChangeText={text => setEmail({ value: text, error: '' })}
                error={email.error != ''}
                autoCapitalize="none"
                autoCompleteType="email"
                textContentType="emailAddress"
                keyboardType="email-address"
                theme={theme}
            />
            <HelperText type="error" visible={email.error != ''} style={styles.input}>
                {email.error}
            </HelperText>

            <TextInput
                label="Password"
                returnKeyType="done"
                disabled={loading}
                value={password.value}
                onChangeText={text => setPassword({ value: text, error: '' })}
                error={password.error != ''}
                errorText={password.error}
                secureTextEntry
                theme={theme}
            />

            <HelperText type="error" visible={password.error != ''} style={styles.input}>
                {password.error}
            </HelperText>

            {!loading && <View style={styles.forgotPassword}>
                <TouchableOpacity
                onPress={handlePasswordReset}
                >
                <Text style={styles.label}>Esqueceu sua senha?</Text>
                </TouchableOpacity>
            </View>}

            {!loading && <Button theme={theme} mode="contained" onPress={_onLoginPressed}>
                Login
            </Button>}

            {loading && <ActivityIndicator size={"small"} color={theme.colors.primary}/>}

            {loginError != '' && <HelperText type="error" style={{marginTop: 10, marginBottom: 30, alignSelf: "center", textAlign: "center"}}>
                {loginError}
            </HelperText>}

            {successEmailReset != '' && <HelperText type="info" style={{color: "white", borderRadius: 4, width: "100%", marginTop: 10, backgroundColor: theme.colors.success, fontSize: 20,marginBottom: 30, alignSelf: "center", textAlign: "center"}}>
                {successEmailReset}
            </HelperText>}

            <View style={styles.row}>
                {!loading && <>
                    <Text style={styles.label}>É um cliente e não tem uma conta? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                    <Text style={styles.link}>Criar conta</Text>
                    </TouchableOpacity>
                </>}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        padding: 20
    },
    input: {
        marginBottom: 20
    },
    forgotPassword: {
      width: '100%',
      alignItems: 'flex-end',
      marginBottom: 24,
    },
    row: {
      flexDirection: 'row',
      marginTop: 20,
      justifyContent: "center",
    },
    label: {
      color: theme.colors.secondary,
    },
    link: {
      fontWeight: 'bold',
      color: theme.colors.primary,
    },
});

export default Login