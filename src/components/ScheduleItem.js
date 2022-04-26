import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { getActualTime } from '../utils/getActualTime'
import { getStatus } from '../utils/getStatus'
import { getStatusColor } from '../utils/getStatusColor'
import { isNullOrEmpty } from '../utils/isNullOrEmpty'
import { theme } from '../utils/theme'
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux'

const ScheduleItem = ({item, role}) => {

    const navigation = useNavigation();

    const goToScheduleDetail = () => {
        navigation.navigate("ScheduleDetail", { item: item, role: role})
    }

    return(
        <TouchableOpacity style={styles.container} onPress={goToScheduleDetail}>
            <View style={{display: "flex", flexDirection: "row", alignItems: "center", marginBottom: 5, justifyContent: "space-between"}}>
                <Text style={{fontSize: 15, fontWeight: "bold"}}>#{item.id}</Text>
                <Text style={{backgroundColor: getStatusColor(item.currentStatus, role), textAlign: "center", color: "white", paddingHorizontal: 7, borderRadius: 10, paddingVertical: 2}}>{getStatus(item.currentStatus, role)}</Text>
            </View>
            <Text style={{marginBottom: 5, fontSize: 18}}>Cliente: {item.idClient.split(" ")[0]}</Text>
            <Text style={{marginBottom: 5, fontSize: 15}}>{item.idVehicleType}</Text>
            <Text style={{marginBottom: 5, fontSize: 15}}>{item.idWashType}</Text>
            {!isNullOrEmpty(item.idWasher) && <Text style={{marginBottom: 5, fontSize: 15}}>{item.idWasher}</Text>}
            {!isNullOrEmpty(item.kilometers) && <Text style={{marginBottom: 5, fontSize: 15}}>{item.kilometers}</Text>}
            <View style={{display: "flex", flexDirection: "row", alignItems: "center", marginTop: 8, marginBottom: 5, justifyContent: "space-between"}}>
                <Text style={{color: theme.colors.backdrop, fontSize: 15}}>{getActualTime(item)}</Text>
                <View style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
                    <Text style={{fontSize: 15}}>R$ </Text>
                    <Text style={{fontSize: 19, fontWeight: "bold"}}>{item.totalPrice.split(".")[0]}</Text>
                    <Text style={{fontSize: 15, fontWeight: "bold"}}>,{item.totalPrice.split(".")[1]}</Text>
                </View>
            </View>
            
        </TouchableOpacity>
    )
}


const styles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "column",
        backgroundColor: "white",
        padding: 15,
        marginBottom: 15
    }
})

export default ScheduleItem