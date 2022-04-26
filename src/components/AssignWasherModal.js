import * as React from 'react';
import { Portal, Text, Provider, IconButton, TextInput, HelperText, Button, ActivityIndicator } from 'react-native-paper';
import { View, Modal, ScrollView } from 'react-native'
import { theme } from '../utils/theme';
import {Picker} from '@react-native-picker/picker';
import { isNullOrEmpty } from '../utils/isNullOrEmpty';

const AssignWasherModal = ({visible, setVisible, style, role, completeAction}) => {

  const [code, setCode] = React.useState({value: "", error: ""})
  const [washersData, setWashersData] = React.useState({loading: true, data: []})
  const [loadingConfirm, setLoadingConfirm] = React.useState(false)
  const [selectedWasher, setSelectedWasher] = React.useState()
  const [selectedWasherError, setSelectedWasherError] = React.useState("")

  const hideModal = () => setVisible(false);
  const containerStyle = {flexGrow: 1, flexDirection: "column", justifyContent: "center", alignItems: "center", alignContent: "center", backgroundColor: "rgba(0,0,0,0.5)", top: 0, bottom: 0, left: 0, right: 0, padding: 20, width: "100%"};
  
  function loadWashers () {
    setWashersData({data: [], loading: true})
    setTimeout(() => {
      const washers = []
      washers.push(
        {
          name: "Gustavo Marques",
          id: "125555"
        },
        {
          name: "Antunes José",
          id: "3454555"
        },
        {
          name: "Abelina Fioreto",
          id: "7656755"
        }
      )
      setWashersData({data: washers, loading: false})
      setSelectedWasher(washers[0])
    }, 2000)
  }

  React.useEffect(() => {
    loadWashers()
  }, [])

  const assignWasher = () => {

    if(isNullOrEmpty(selectedWasher)) {
      setSelectedWasherError("Selecione um lavador")
      return
    }

    setLoadingConfirm(true)

    setTimeout(() => {
      setLoadingConfirm(false)
      completeAction()
      setVisible(false)
    }, 2000)
  }

  return (
    <Provider>
      <Portal>
        <Modal transparent visible={visible}>
            <View style={containerStyle}>
              <ScrollView style={{flexGrow: 0,backgroundColor: "white", alignSelf: "center", borderRadius: 10, padding: 20}}>
                <View style={{width: "100%", flexDirection: "row", justifyContent: "flex-end"}}>
                  <IconButton
                      icon="close"
                      color={theme.colors.secondary}
                      size={30}
                      onPress={hideModal}
                  />
                </View>
                <Text>Atribua um lavador para executar essa lavagem:</Text>
                {!washersData.loading && <Picker
                  style={{marginBottom: 25}}
                  selectedValue={selectedWasher}
                  onValueChange={(itemValue, itemIndex) => {
                    setSelectedWasher(itemValue)
                    setSelectedWasherError(false)
                  }}>
                    {washersData.data.map((value) => <Picker.Item key={value.id} label={value.name} value={value.id}/>)}
                </Picker>}
                <HelperText type="error" visible={selectedWasherError != ""} >
                    {selectedWasherError}
                </HelperText>
                {washersData.loading && <ActivityIndicator style={{marginBottom: 15}} size={"small"} color={theme.colors.primary}/>}
                {!loadingConfirm && <Button icon="check" mode="contained" onPress={assignWasher}>
                  Confirmar
                </Button>}
                {loadingConfirm && <ActivityIndicator size={"small"} color={theme.colors.primary}/>}
              </ScrollView>
            </View>
        </Modal>
      </Portal>
    </Provider>
  );
};

export default AssignWasherModal;