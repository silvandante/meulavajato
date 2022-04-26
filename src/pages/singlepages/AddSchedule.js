import React, { useEffect, useState } from "react"

import {
    StyleSheet,
    View,
    Text,
    Linking,
    ToastAndroid
} from "react-native"
import DateTimePicker from '@react-native-community/datetimepicker'
import { ActivityIndicator, Button, HelperText, IconButton, Title } from "react-native-paper"
import { SafeAreaView } from "react-native-safe-area-context"
import { theme } from "../../utils/theme"
import { getDate, getTime } from "../../utils/getDateTime"
import { Picker } from "@react-native-picker/picker"
import { database } from "../../config/firebaseconfig"
import { useSelector } from "react-redux"


const AddSchedule = ({route, navigation}) => {

    const [loading, setLoading] = useState(false)    

    const { user } = useSelector(state => state);
    
    const [date, setDate] = React.useState(new Date())
    const [time, setTime] = React.useState(new Date())
  
    const [washsData, setWashsData] = useState({loading: true, data: []})
    const [vehicleData, setVehicleData] = useState({loading: true, data: []})

    const [selectedWash, setSelectedWash] = useState("")
    const [selectedVehicle, setSelectedVehicle] = useState("")

    const [datePickerVisible, setDatePickerVisible] = React.useState(false)
    const [timePickerVisible, setTimePickerVisible] = React.useState(false)

    const [totalPrice, setTotalPrice] = useState("0,00")

    const [addScheduleError, setAddScheduleError] = useState("")

    useEffect(() => {
        setWashsData({loading: true, data: []})
        setVehicleData({loading: true, data: []})

        const unsubscribe1 = database.collection("vehicles").onSnapshot((query) => {
            const list = []
            query.forEach((doc) => {
                list.push({...doc.data(), id: doc.id})
            })
            setVehicleData({loading: false, data: list})
            setSelectedVehicle(list[0])
            setLoading(false)

        })

        const unsubscribe2 = database.collection("washes").onSnapshot((query) => {
            const list = []
            query.forEach((doc) => {
                list.push({...doc.data(), id: doc.id})
            })
            setWashsData({loading: false, data: list})
            setSelectedWash(list[0])
            setLoading(false)

        })
    
        return () => {
            unsubscribe1()
            unsubscribe2()
        }
    }, [])

    const confirmAdd = () => {
        setLoading(true)
        setAddScheduleError('')

        var val1 = Math.floor(1000 + Math.random() * 9000);
        var val2 = Math.floor(1000 + Math.random() * 9000);

        const dateValue = new Date(date).toISOString().split("T")[0]
        const timeValue = new Date(time).toISOString().split("T")[1]

        const completeDate = dateValue+"T"+timeValue
        
        database.collection("orders").add({
            acceptedTime: "",
            currentStatus: "PENDING_MANAGER",
            idClient: user.user.name,
            uidClient: user.user.uid,
            clientPhone: user.user.phone,
            idVehicleType: selectedVehicle.title,
            idWashType: selectedWash.title +" ("+ selectedWash.desc+")",
            idWasher: "",
            kilometers: "",
            originalTime: completeDate,
            suggestedTime: "",
            totalPrice: totalPrice,
            managerCode: val1,
            clientCode: val2,
            createdAt: new Date().toISOString()
        }).then(() => {
            ToastAndroid.show( "Agendamento adicionado com sucesso", ToastAndroid.SHORT);
            navigation.pop()
        }).catch((error) => {
            setAddScheduleError("Não foi possível adicionar esse agendamento, tente novamente!")
        })
    }

    useEffect(() => {
        const selectedVehiclePrice = parseFloat(selectedVehicle.price)
        const selectedWashPrice = parseFloat(selectedWash.price)

        setTotalPrice((selectedVehiclePrice+selectedWashPrice).toFixed(2).toString().replace(".", ","))
    }, [selectedVehicle, selectedWash])

    return(
        <SafeAreaView style={{padding: 20, backgroundColor: theme.colors.softDisable, height: "100%", width: "100%", flexDirection: "column"}}>
            {!loading && <>
            <View style={{width: "100%", flexDirection: "row", justifyContent: "flex-end"}}>
                <IconButton
                    icon="close"
                    color={theme.colors.secondary}
                    size={35}
                    onPress={() => navigation.goBack()}
                />
            </View>
            <Title style={{alignSelf: "center", textAlign: "center", marginBottom: 30}}>Agendar</Title>
            <Text style={{color: theme.colors.disabled}}>Escolha o tipo de veículo</Text>
            {vehicleData.loading && <ActivityIndicator 
                style={{marginBottom: 30, marginTop: 25}} animating={true} size={"small"} color={theme.colors.primary}/>}
            {!vehicleData.loading && <Picker
                style={{marginBottom: 25}}
                selectedValue={selectedVehicle.id}
                onValueChange={(itemValue, itemIndex) => {
                    const value = vehicleData.data.find(item => item['id'] == itemValue)
                    setSelectedVehicle(value)
                }}>
                {vehicleData.data.map((value) => <Picker.Item key={value.id} label={value.title} value={value.id}/>)}
            </Picker>}
            <Text style={{color: theme.colors.disabled}}>Escolha o tipo de lavagem</Text>
            {washsData.loading && <ActivityIndicator 
                style={{marginBottom: 30, marginTop: 25}} animating={true} size={"small"} color={theme.colors.primary}/>}
            {!washsData.loading && <Picker
                style={{marginBottom: 25}}
                selectedValue={selectedWash.id}
                onValueChange={(itemValue, itemIndex) => {
                    const value = washsData.data.find(item => item['id'] == itemValue)
                    setSelectedWash(value)
                }}>
                {washsData.data.map((value) => <Picker.Item key={value.id} label={value.title} value={value.id}/>)}
            </Picker>}
            <Button theme={theme} icon="calendar" mode="outline" style={{borderWidth: 1, borderColor: theme.colors.primary, marginBottom: 18}} onPress={() => setDatePickerVisible(true)}>
                Escolher data: {getDate(new Date(date).toISOString())}
            </Button>
            <Button theme={theme} icon="clock" mode="outline" style={{borderWidth: 1, borderColor: theme.colors.primary, marginBottom: 18}} onPress={() => setTimePickerVisible(true)}>
                Escolher hora: {getTime(new Date(time).toISOString().split("T")[1])}
            </Button>
            {datePickerVisible && <DateTimePicker
                value={new Date(date)}   
                is24Hour={true}
                mode={"date"}
                timeZoneOffsetInMinutes={0}
                minimumDate={Date.parse(new Date())}
                display='default'
                disabled={loading}
                onChange={(event, date) => {
                    if (event != null) {
                        setDate(event.nativeEvent.timestamp)
                    }

                    setDatePickerVisible(false)
                }}
                />}
            {timePickerVisible && <DateTimePicker
                value={new Date(time)}   
                is24Hour={true}
                timeZoneOffsetInMinutes={0}
                mode={"time"}
                disabled={loading}
                minimumDate={Date.parse(new Date())}
                display='default'
                onChange={(event, date) => {
                    //alert(JSON.stringify(date_))
                    if (date != null) {
                        setTime(date)
                    }

                    setTimePickerVisible(false)
                }}
                />}
                {!washsData.loading && !vehicleData.loading && 
                <>
                <Text style={{fontWeight: "bold", color: theme.colors.primary, textAlign: "center", fontSize: 25, marginBottom: 40}}>R$ {totalPrice}</Text>
                <Button theme={theme} style={{marginBottom: 15, borderWidth: 1, borderColor: theme.colors.primary}} mode="contained" onPress={() => confirmAdd()}>
                    Confirmar
                </Button>
                </>}

                {addScheduleError != "" && <HelperText type="error">
                    {addScheduleError}
                </HelperText>}
            
            </>}
        {loading && <ActivityIndicator size={"large"} color={theme.colors.primary}/>}
        </SafeAreaView>
    )
}

export default AddSchedule