import React, { useEffect, useState } from "react"

import { Title, TextInput, Button, HelperText } from 'react-native-paper';


import {
    StyleSheet,
    View,
    Text,
    SafeAreaView,
    FlatList,
    ActivityIndicator
} from "react-native"
import AddTypeModal from "./AddTypeModal";
import TypeItem from "./TypeItem";
import { theme } from "../utils/theme";
import { typesVehicle } from "../fakedata/fakedata";
import { database } from "../config/firebaseconfig";
import { useSelector } from "react-redux";


const SegmentVehicle = () => {

    const [addTypeModalVisible, setAddTypeModalVisible] = useState(false)
    const [typesVehicleData, setTypeVehicleData] = useState([])
    const [loading, setLoading] = useState(false)
    
    const { user } = useSelector(state => state);

    useEffect(() => {
        setLoading(true)
        database.collection("vehicles").onSnapshot((query) => {
            const list = []
            query.forEach((doc) => {
                list.push({...doc.data(), id: doc.id})
            })
            setTypeVehicleData(list)
            setLoading(false)
        })
    }, [])

    return (
        <SafeAreaView style={{ flex: 1, paddingHorizontal: 10, paddingTop: 15 }}>
            <View style={{position: "absolute"}}>
                <AddTypeModal labelTitle={"Veículo"} labelPrice={"Preço"} labelDescription={"Adicione um novo tipo de veículo:"} visible={addTypeModalVisible} setVisible={visible => setAddTypeModalVisible(visible)}/>
            </View>
            <View style={{ flex: 1, display: "flex" }}>
                <Button theme={theme} style={{ marginBottom: 15, borderWidth: 1, borderColor: theme.colors.primary }} icon="plus" mode="outline" onPress={() => setAddTypeModalVisible(true)}>
                    Adicionar tipo de veículo
                </Button>
                {!loading && <FlatList
                    data={typesVehicleData}
                    renderItem={({item}) => <TypeItem item={item} type={"VEHICLE"} role={"MANAGER"} userId={user.uid}/>}
                    keyExtractor={item => item.id}
                />}
                {loading && <ActivityIndicator size={"large"} color={theme.colors.primary}/>}
            </View>
        </SafeAreaView>
    )
}

export default SegmentVehicle