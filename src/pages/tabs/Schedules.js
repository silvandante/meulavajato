import React, { useEffect, useState } from "react"

import {
    StyleSheet,
    SafeAreaView,
    Text
} from "react-native"
import { FlatList } from "react-native-gesture-handler"
import { ActivityIndicator, Button } from "react-native-paper"
import { useSelector } from "react-redux"
import ScheduleItem from "../../components/ScheduleItem"
import { database } from "../../config/firebaseconfig"
import { theme } from "../../utils/theme"

const Schedules = ({navigation}) => {

    const { user } = useSelector(state => state)
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        switch(user.user.role) {
            case "MANAGER":
                database.collection("orders").orderBy("createdAt", "asc").onSnapshot((query) => {
                    const list = []
                    query.forEach((doc) => {
                        list.push({...doc.data(), id: doc.id})
                    })
                    setData(list.reverse())
                    setLoading(false)
                })
                break
            case "CLIENT":
                database.collection("orders").where("uidClient", "==", user.user.uid).onSnapshot((query) => {
                    const list = []
                    query.forEach((doc) => {
                        list.push({...doc.data(), id: doc.id})
                    })
                    const array = list.sort(function(a, b) {
                        var c = new Date(a.createdAt);
                        var d = new Date(b.createdAt);
                        return d-c;
                    })

                    setData(
                        array
                    )
                    setLoading(false)
                })
                break
            default:
                setData([])
                setLoading(false)
                break
        }
    }, [])

    return(
        <SafeAreaView style={{padding: 15, flex: 1}}>
            {user.user.role == "CLIENT" &&
            <Button theme={theme} onPress={() => navigation.navigate("AddSchedule")} style={{ marginBottom: 15, borderWidth: 1, borderColor: theme.colors.primary }} icon="plus" mode="outline" >
                Fazer Pedido de Lavagem
            </Button>}
            {!loading && <FlatList
                data={data}
                renderItem={({item}) => <ScheduleItem item={item} role={user.user.role}/>}
                keyExtractor={item => item.id}
            />}
            {loading && <ActivityIndicator size={"large"} color={theme.colors.primary}/>}
        </SafeAreaView>
    )
}

export default Schedules