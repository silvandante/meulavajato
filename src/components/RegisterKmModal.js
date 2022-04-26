import * as React from 'react';
import { Portal, Text, Provider, IconButton, TextInput, HelperText, Button, ActivityIndicator } from 'react-native-paper';
import { View, Modal, ScrollView, ToastAndroid } from 'react-native'
import { theme } from '../utils/theme';
import { isNullOrEmpty } from '../utils/isNullOrEmpty';
import { database } from '../config/firebaseconfig';

const RegisterKmModal = ({visible, setVisible, style, completeAction, role, itemId, managerCode, clientCode}) => {

  const [code, setCode] = React.useState({value: "", error: ""})
  const [selectedKm, setSelectedKm] = React.useState({value: "", error: ""})
  const [loadingConfirm, setLoadingConfirm] = React.useState(false)
  const [kmError, setKmError] = React.useState('')

  const hideModal = () => setVisible(false);
  const containerStyle = {flexGrow: 1 ,flexDirection: "column", justifyContent: "center", alignItems: "center", alignContent: "center", backgroundColor: "rgba(0,0,0,0.5)", top: 0, bottom: 0, left: 0, right: 0, padding: 20, width: "100%"};

  const assignWasher = () => {
    setKmError('')

    setLoadingConfirm(true)

    let oneError = false;

    if(isNullOrEmpty(selectedKm.value)) {
      oneError = true;
      setSelectedKm({value: "", error: "Kilometragem não pode ser vazio"})
    }

    if(isNullOrEmpty(code.value)) {
      oneError = true;
      setCode({value: "", error: "Código não pode ser vazio"})
    }

    if(role=="MANAGER"){
      if(code.value != clientCode) {
        oneError = true;
        setCode({value: "", error: "Esse código não corresponde ao código do cliente"})
      }
    } else {
      if(code.value != managerCode) {
        oneError = true;
        setCode({value: "", error: "Esse código não corresponde ao código do gerente"})
      }
    }

    if (oneError) {
      setLoadingConfirm(false)
      return
    }


    database.collection("orders").doc(itemId).update({
      kilometers: selectedKm.value
    }).then(() => {
      setVisible(false)
      completeAction()
      setLoadingConfirm(false)
    }).catch((error) => {
      alert(JSON.stringify(error))
      setKmError("Não foi possível registrar KM, tente novamente!")
    })
  }
  
  return (
    <Provider>
      <Portal>
        <Modal transparent visible={visible}>
            <View style={containerStyle}>
              <ScrollView style={{flexGrow: 0, backgroundColor: "white", alignSelf: "center", borderRadius: 10, padding: 20}}>
                <View style={{width: "100%", flexDirection: "row", justifyContent: "flex-end"}}>
                  <IconButton
                      icon="close"
                      color={theme.colors.secondary}
                      size={30}
                      onPress={hideModal}
                  />
                </View>
                <Text>Marque a kilometragem do carro no momento de entrada no estacionamento da Lava Jato:</Text>
                <TextInput
                    label="Kilometragem"
                    theme={theme} 
                    returnKeyType="next"
                    value={selectedKm.value}
                    onChangeText={text => setSelectedKm({ value: text, error: "" })}
                    error={selectedKm.error != ''}
                    autoCapitalize="none"
                    keyboardType="numeric"
                />
                <HelperText type="error" visible={selectedKm.error != ""} >
                    {selectedKm.error}
                </HelperText>
                <TextInput
                    label="Código"
                    returnKeyType="next"
                    theme={theme} 
                    value={code.value}
                    onChangeText={text => setCode({ value: text, error: "" })}
                    error={code.error != ''}
                    autoCapitalize="none"
                    keyboardType="numeric"
                />
                <HelperText type="error" visible={code.error != ""} >
                    {code.error}
                </HelperText>
                {!loadingConfirm && <Button theme={theme} style={{marginBottom: 15}} icon="check" mode="contained" onPress={assignWasher}>
                    Aprovar
                </Button>}
                {kmError!='' && <HelperText type="error">
                    {kmError}
                </HelperText>}
                {loadingConfirm && <ActivityIndicator animating={true} size={"small"} color={theme.colors.primary}/>}
              </ScrollView>
            </View>
        </Modal>
      </Portal>
    </Provider>
  );
};

export default RegisterKmModal;