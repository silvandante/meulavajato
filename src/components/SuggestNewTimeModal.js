import * as React from 'react'
import { Portal, Text, Provider, IconButton, TextInput, HelperText, Button, Title } from 'react-native-paper'
import { View, Modal } from 'react-native'
import { theme } from '../utils/theme'
import {Picker} from '@react-native-picker/picker'
import { ScrollView } from 'react-native-gesture-handler'
import DateTimePicker from '@react-native-community/datetimepicker'
import { isNullOrEmpty } from '../utils/isNullOrEmpty'
import { getDate, getTime } from '../utils/getDateTime'
import { database } from '../config/firebaseconfig'

    const SuggestNewTimeModal = ({item, visible, setVisible, style, confirmChange}) => {

    const [code, setCode] = React.useState({value: "", error: ""})
    const [date, setDate] = React.useState({actualDate: isNullOrEmpty(item.suggestedTime) ? item.originalTime.split("T")[0] : item.suggestedTime.split("T")[0], tempDate: ""})
    const [time, setTime] = React.useState({actualTime: isNullOrEmpty(item.suggestedTime) ? item.originalTime.split("T")[1] : item.suggestedTime.split("T")[1], tempTime: ""})
    
    const [selectedWasher, setSelectedWasher] = React.useState()
    const [datePickerVisible, setDatePickerVisible] = React.useState(false)
    const [timePickerVisible, setTimePickerVisible] = React.useState(false)

    const [loading, setLoading] = React.useState(false)
    const [newTimeError, setNewTimeError] = React.useState("")

    const hideModal = () => setVisible(false);
    const containerStyle = {flex: 1,flexDirection: "column", justifyContent: "center", alignItems: "center", alignContent: "center", backgroundColor: "rgba(0,0,0,0.5)", top: 0, bottom: 0, left: 0, right: 0, padding: 20, width: "100%"};

    return (
        <Provider>
        <Portal>
            <Modal transparent visible={visible}>
                <View style={containerStyle}>
                <ScrollView style={{flexGrow: 0,backgroundColor: "white", paddingBottom: 30, alignSelf: "center", borderRadius: 10, paddingHorizontal: 20}}>
                    <View style={{width: "100%", flexDirection: "row", justifyContent: "flex-end"}}>
                    <IconButton
                        icon="close"
                        color={theme.colors.secondary}
                        size={30}
                        onPress={hideModal}
                    />
                    </View>
                    <Title style={{alignSelf: "center", textAlign: "center", marginBottom: 30}}>Sugira uma novo horário:</Title>
                    <Button theme={theme} icon="calendar" mode="outline" style={{borderWidth: 1, borderColor: theme.colors.primary, marginBottom: 18}} onPress={() => setDatePickerVisible(true)}>
                        Escolher data: {date.tempDate=="" ? getDate(date.actualDate) : getDate(date.tempDate)}
                    </Button>
                    <Button theme={theme} icon="clock" mode="outline" style={{borderWidth: 1, borderColor: theme.colors.primary, marginBottom: 18}} onPress={() => setTimePickerVisible(true)}>
                        Escolher hora: {time.tempTime=="" ? getTime(time.actualTime) : getTime(time.tempTime)}
                    </Button>
                    {datePickerVisible && (
                    <DateTimePicker
                        value={date.tempDate=="" ? new Date(date.actualDate) : new Date(date.tempDate)}   
                        is24Hour={true}
                        mode={"date"}
                        timeZoneOffsetInMinutes={0}
                        minimumDate={Date.parse(new Date())}
                        display='default'
                        onChange={date_ => {
                            alert(JSON.stringify(date_))
                            setDate({actualDate: date.actualDate, tempDate: date_.nativeEvent.timestamp.toISOString().split("T")[0]})
                            setDatePickerVisible(false)
                        }}
                        />
                    )}
                    {timePickerVisible && (
                    <DateTimePicker
                        value={time.tempTime=="" ? new Date((date.tempDate!="" ? date.tempDate : date.actualDate) +"T"+ time.actualTime) : new Date((date.tempDate!="" ? date.tempDate : date.actualDate) + "T" +time.tempTime)}   
                        is24Hour={true}
                        timeZoneOffsetInMinutes={0}
                        mode={"time"}
                        minimumDate={Date.parse(new Date())}
                        display='default'
                        onChange={date_ => {
                            //alert(JSON.stringify(date_))
                            setTime({actualTime: time.actualTime, tempTime: date_.nativeEvent.timestamp.toISOString().split("T")[1]})
                            setTimePickerVisible(false)
                        }}
                        />
                    )}
                    <Button theme={theme}  icon="check" mode="contained" onPress={() => {
                        setNewTimeError('')
                        setLoading(true)
                        const date_ = {actualDate: date.tempDate!="" ? date.tempDate : date.actualDate, tempDate: ""}
                        const time_ = {actualTime: time.tempTime!="" ? time.tempTime : time.actualTime, tempTime: ""}

                        const date__ = new Date(date_.actualDate).toISOString().split("T")[0]
                        const time__ = new Date(time_.actualDate).toISOString().split("T")[1]

                        database.collection("orders").doc(item.id).update({
                            suggestedTime: date__+"T"+time__
                        }).then(() => {
                            setLoading(false)
                            setVisible(false)
                        }).catch(() => {
                            setLoading(false)
                            setNewTimeError("Não foi possível registrar novo horário, tente novamente!")
                        })
                    }}>
                        Confirmar
                    </Button>


                    {newTimeError != "" && <HelperText type="error" visible={type.error != ""} >
                        {type.error}
                    </HelperText>}
                </ScrollView>
                </View>
            </Modal>
        </Portal>
        </Provider>
    );
};

export default SuggestNewTimeModal;