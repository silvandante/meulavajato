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
import { typesWash } from "../fakedata/fakedata";
import { database } from "../config/firebaseconfig";


const SegmentWash = () => {

    const [addTypeModalVisible, setAddTypeModalVisible] = useState(false)
    const [typesWashData, setTypesWashData] = useState([])
    const [loading, setLoading] = useState(false)
    
    useEffect(() => {
        setLoading(true)
        database.collection("washes").onSnapshot((query) => {
            const list = []
            query.forEach((doc) => {
                list.push({...doc.data(), id: doc.id})
            })
            setTypesWashData(list)
            setLoading(false)
        })
    }, [])

    return (
        <SafeAreaView style={{ flex: 1, paddingHorizontal: 10, paddingTop: 15 }}>
            <View style={{position: "absolute"}}>
                <AddTypeModal typeToAdd="WASH" labelTitle={"Lavagem"} labelPrice={"Preço"} labelDescription={"Adicione um novo tipo de lavagem:"} visible={addTypeModalVisible} setVisible={visible => setAddTypeModalVisible(visible)}/>
            </View>
            <View style={{ flex: 1, display: "flex" }}>
                <Button theme={theme} style={{ marginBottom: 15, borderWidth: 1, borderColor: theme.colors.primary }} icon="plus" mode="outline" onPress={() => setAddTypeModalVisible(true)}>
                    Adicionar tipo de lavagem
                </Button>
                {!loading && <FlatList
                    removeClippedSubviews={false}
                    data={typesWashData}
                    renderItem={({item}) => <TypeItem item={item} type={"WASH"} role={"MANAGER"}/>}
                    keyExtractor={item => item.id}
                />}
                {loading && <ActivityIndicator size={"large"} color={theme.colors.primary}/>}
            </View>
        </SafeAreaView>
    )
}

export default SegmentWash