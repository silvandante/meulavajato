import React, { useState } from "react"

import { Title, TextInput, IconButton, HelperText } from 'react-native-paper';


import {
    StyleSheet,
    View,
    Text,
    SafeAreaView,
    ActivityIndicator
} from "react-native"
import AddTypeModal from "./AddTypeModal";
import TypeItem from "./TypeItem";
import { theme } from "../utils/theme";


const SegmentWasher = () => {

    const [editVisible, setEditVisible] = useState(false)
    const [price, setPrice] = useState({value: "15", error: ""})
    const [loading, setLoading] = useState(false)

    const updateItem = () => {
        setLoading(true)
        setTimeout(() => {
            setEditVisible(false)
            setLoading(false)
        }, 1500)
    }

    const handleXClick = () => {
        if (editVisible) {
            setEditVisible(false)
        } else {
            setLoading(true)
            setItemValue(null)
        }
    }

    const handleEditClick = () => {
        if (editVisible) {
            updateItem()
        } else {
            setEditVisible(true)
        }
    }

    return (
        <SafeAreaView style={{ flex: 1, paddingHorizontal: 10, paddingTop: 15 }}>
            <View style={{width: "100%", display: "flex", flexDirection: "row", backgroundColor: "white"}}>
                <View style={{width: "80%", paddingVertical: 15}}>
                    <Text style={{color: theme.colors.backdrop, paddingLeft: 28, paddingTop: 20}}>Pagamento Lavadores</Text>
                    <TextInput
                        label={"Porcetagem"}
                        style={{backgroundColor: "white", padding: 0, margin: 0, marginLeft: 15}}
                        value={price.value}
                        onChangeText={text => setPrice({ value: text, error: '' })}
                        autoCapitalize="none"
                        keyboardType="numeric"
                        disabled={!editVisible}
                    />
                    <HelperText type="error" visible={price.error != ''} style={{height: price.error != '' ? 30 : 0}}>
                        {price.error}
                    </HelperText>
                </View>
                <View style={{width: "20%", justifyContent: "space-around", alignItems: "center"}}>
                    {!loading && editVisible && <IconButton
                        icon={"close"}
                        color={theme.colors.backdrop}
                        size={20}
                        onPress={handleXClick}
                    />}
                    {!loading && <IconButton
                        icon={editVisible ? "check" : "pencil"}
                        color={theme.colors.primary}
                        size={20}
                        onPress={handleEditClick}
                    />}
                    {loading && <ActivityIndicator size={"small"} color={theme.colors.primary}/>}
                </View>
            </View>
        </SafeAreaView>
    )
}

export default SegmentWasher