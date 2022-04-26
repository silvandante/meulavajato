import React, { useState } from "react"

import {
    StyleSheet,
    View,
    Text,
    Linking
} from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"
import { Button, IconButton, Title } from "react-native-paper"
import { SafeAreaView } from "react-native-safe-area-context"
import { getActualTime } from "../../utils/getActualTime"
import { getStatus } from "../../utils/getStatus"
import { getStatusColor } from "../../utils/getStatusColor"
import { isNullOrEmpty } from "../../utils/isNullOrEmpty"
import { theme } from "../../utils/theme"
import ZigzagView from "react-native-zigzag-view"
import SuggestNewTimeModal from "../../components/SuggestNewTimeModal"
import RegisterKmModal from "../../components/RegisterKmModal"
import AssignWasherModal from "../../components/AssignWasherModal"
import { database } from "../../config/firebaseconfig"


const ScheduleDetail = ({route, navigation}) => {

    const { item, role } = route.params;
    const [status, setStatus] = useState(item.currentStatus)
    const [date, setDate] = useState(getActualTime(item))
    const [registerKmModalVisible, setRegisterKmModalVisible] = useState(false)
    const [suggestNewTimeVisible, setSuggestNewTimeVisible] = useState(false)
    const [assignWasherModalVisible, setAssignWasherModalVisible] = useState(false)

    const updateStatus = (newStatus) => {
        database.collection("orders").doc(item.id).update({
            currentStatus: newStatus
        })
        setStatus(newStatus)
    }

    const callNumber = phone => {
        console.log('callNumber ----> ', phone);
        let phoneNumber = phone;
        if (Platform.OS !== 'android') {
          phoneNumber = `telprompt:${phone}`
        }
        else  {
          phoneNumber = `tel:${phone}`
        }
        Linking.canOpenURL(phoneNumber)
        .then(supported => {
          if (!supported) {
            Alert.alert('Phone number is not available')
          } else {
            return Linking.openURL(phoneNumber);
          }
        })
        .catch(err => console.log(err))
    }

    const confirmChange = (newDate, newTime) => {
        database.collection("orders").doc(item.id).update({
            suggestedTime: newDate + "T" + newTime,
            currentStatus: "PENDING_CLIENT"
        })
        setDate(newDate + "T" + newTime)
        setStatus("PENDING_CLIENT")
    }

    const completeActionRegisterKm = () => {
        database.collection("orders").doc(item.id).update({
            currentStatus: "IN_PARK"
        })
        setStatus("IN_PARK")
    }


    const completeActionAssignWasher = () => {
        database.collection("orders").doc(item.id).update({
            currentStatus: "WAITING_WASHER"
        })
    }

    return(
        <SafeAreaView style={{backgroundColor: theme.colors.softDisable, height: "100%", width: "100%", flexDirection: "column"}}>
            <View style={{position: "absolute"}}>
                <RegisterKmModal itemId={item.id} clientCode={item.clientCode} managerCode={item.managerCode} role={role} completeAction={completeActionRegisterKm} visible={registerKmModalVisible} setVisible={visible => setRegisterKmModalVisible(visible)}/>
                <SuggestNewTimeModal confirmChange={confirmChange} item={item} visible={suggestNewTimeVisible} setVisible={visible => setSuggestNewTimeVisible(visible)}/>
                <AssignWasherModal completeAction={completeActionAssignWasher} visible={assignWasherModalVisible} setVisible={visible => setAssignWasherModalVisible(visible)}/>
            </View>
            <View style={{width: "100%", flexDirection: "row", justifyContent: "flex-end"}}>
                <IconButton
                    icon="close"
                    color={theme.colors.secondary}
                    size={35}
                    onPress={() => navigation.goBack()}
                />
            </View>
            <ZigzagView 
                backgroundColor={"transparent"}
                surfaceColor="white"
                top={false}
                style={{flexDirection: "column",display: "flex", margin: 20}}>
                <View style={{display:"flex", padding: 20}}>
                    <View style={{display: "flex", flexDirection: "row", marginTop: 20, alignItems: "center", marginBottom: 5, justifyContent: "space-between"}}>
                        <Text style={{fontSize: 14, fontWeight: "bold"}}>#{item.id}</Text>
                        <Text style={{fontSize: 15, backgroundColor: getStatusColor(status, role), color: "white", textAlign: "center", paddingHorizontal: 7, borderRadius: 10}}>{getStatus(status, role)}</Text>
                    </View>
                    <Text style={{marginBottom: 5, fontSize: 18}}>Cliente: {item.idClient.split(" ")[0]}</Text>
                    <Text style={{marginBottom: 5, fontSize: 15}}>{item.idVehicleType}</Text>
                    <Text style={{marginBottom: 5, fontSize: 15}}>{item.idWashType}</Text>
                    {!isNullOrEmpty(item.idWasher) && <Text style={{marginBottom: 5, fontSize: 15}}>{item.idWasher}</Text>}
                    {!isNullOrEmpty(item.kilometers) && <Text style={{marginBottom: 5, fontSize: 15}}>{item.kilometers}</Text>}
                    <View style={{display: "flex", flexDirection: "row", alignItems: "center", marginTop: 8, marginBottom: 5, justifyContent: "space-between"}}>
                        <Text style={{color: theme.colors.backdrop, fontSize: 15}}>{date}</Text>
                        <View style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
                            <Text style={{fontSize: 15}}>R$ </Text>
                            <Text style={{fontSize: 19, fontWeight: "bold"}}>{item.totalPrice.split(".")[0]}</Text>
                            <Text style={{fontSize: 15, fontWeight: "bold"}}>,{item.totalPrice.split(".")[1]}</Text>
                        </View>
                    </View>
                </View>
            </ZigzagView>
            <View style={{margin: 20}}>
                {((role=="MANAGER" && status=="PENDING_MANAGER") || (role=="CLIENT" && status=="PENDING_CLIENT")) && 
                <Button theme={theme}  style={{marginBottom: 15}} icon="check" mode="contained" onPress={() => updateStatus("APPROVED")}>
                    Aprovar
                </Button>}
                {((role=="MANAGER" && status=="PENDING_MANAGER") || (role=="CLIENT" && status=="PENDING_CLIENT")) && 
                <Button theme={theme}  style={{marginBottom: 15}}  icon="calendar" mode="contained" onPress={() => setSuggestNewTimeVisible(true)}>
                    Sugerir Novo Horário
                </Button>}
                {((role=="MANAGER" && status=="PENDING_MANAGER") || (role=="CLIENT" && status=="PENDING_CLIENT")) && 
                <Button theme={theme}  style={{marginBottom: 15, borderWidth: 1, borderColor: theme.colors.primary}} icon="close" mode="outline" onPress={() => updateStatus("CANCELED")}>
                    Reprovar
                </Button>}
                {role=="MANAGER" && status=="PENDING_CLIENT" && 
                <Button theme={theme}  style={{marginBottom: 15, borderWidth: 1, borderColor: theme.colors.primary}} mode="outline" onPress={() => updateStatus("CANCELED")}>
                    Cliente nunca respondeu? Cancelar
                </Button>}
                {role=="CLIENT" && (status=="PENDING_MANAGER" || status=="APPROVED") && 
                <Button theme={theme}  style={{marginBottom: 15, borderWidth: 1, borderColor: theme.colors.primary}} mode="outline" onPress={() => updateStatus("CANCELED")}>
                    Desistiu? Cancelar
                </Button>}
                {role=="MANAGER" && status=="APPROVED" && 
                <Button theme={theme}  style={{marginBottom: 15, borderWidth: 1, borderColor: theme.colors.primary}} mode="outline" onPress={() => updateStatus("CANCELED")}>
                    Cliente não apareceu? Cancelar
                </Button>}
                {role=="MANAGER" && status=="APPROVED" && 
                <Button theme={theme}  style={{marginBottom: 15, borderWidth: 1, borderColor: theme.colors.primary}} mode="contained" onPress={() => setRegisterKmModalVisible(true)}>
                    Receber cliente, marcar KM
                </Button>}
                {role=="CLIENT" && status=="APPROVED" && 
                <Button theme={theme}  style={{marginBottom: 15, borderWidth: 1, borderColor: theme.colors.primary}} mode="contained" onPress={() => setRegisterKmModalVisible(true)}>
                    Cheguei, marcar KM
                </Button>}
                {/*role=="MANAGER" && status=="IN_PARK" && 
                <Button style={{marginBottom: 15, borderWidth: 1, borderColor: theme.colors.primary}} mode="contained" onPress={() => {
                    setAssignWasherModalVisible(true)
                }}>
                    Atribuir Lavador
                </Button>*/}
                {(role=="MANAGER" || role=="WASHER") && status=="IN_PARK" && 
                <Button theme={theme}  style={{marginBottom: 15, borderWidth: 1, borderColor: theme.colors.primary}} mode="contained" onPress={() => updateStatus("IN_PROGRESS")}>
                    Lavagem Iniciada
                </Button>}
                {(role=="MANAGER" || role=="WASHER") && status=="IN_PROGRESS" && 
                <Button theme={theme}  style={{marginBottom: 15, borderWidth: 1, borderColor: theme.colors.primary}} mode="contained" onPress={() => updateStatus("CONCLUDED")}>
                    Concluir Lavagem
                </Button>}
                {(role=="MANAGER") && status=="CONCLUDED" && 
                <Button theme={theme}  style={{marginBottom: 15, borderWidth: 1, borderColor: theme.colors.primary}} mode="contained" onPress={() => updateStatus("PAYED")}>
                    Entregar veículo e receber pagamento
                </Button>}
            </View>
            <View style={{display: "flex", width: "100%", flex: 1, flexDirection: "column", justifyContent: "space-between"}}>
                {role=="MANAGER" && status=="APPROVED" && 
                    <View style={{flexDirection: "column", alignContent: "center"}}>
                        <Title style={{fontSize: 15, color: theme.colors.disabled, alignSelf: "center", textAlign: "center"}}>Cliente prefere marcar KM? Dê a ele esse código:</Title>
                        <Title style={{color: theme.colors.placeholder, alignSelf: "center"}}>{item.managerCode}</Title>
                    </View>
                }
                {role=="CLIENT" && status=="APPROVED" && 
                    <View style={{flexDirection: "column", alignContent: "center"}}>
                        <Title style={{fontSize: 15, color: theme.colors.disabled, alignSelf: "center", textAlign: "center"}}>Gerente vai marcar KM por você?{"\n"}Dê a ele esse código:</Title>
                        <Title style={{color: theme.colors.placeholder, alignSelf: "center"}}>{item.clientCode}</Title>
                    </View>
                }
                {role == "MANAGER" && <Button theme={theme} style={{marginBottom: 30, position: status!="APPROVED" ? "absolute" : "relative", bottom: 0, alignSelf: "center"}} icon="phone" mode="outline" onPress={() => callNumber(item.clientPhone)}>
                    Algum problema? Ligue para o cliente
                </Button>}
            </View>
        </SafeAreaView>
    )
}

export default ScheduleDetail