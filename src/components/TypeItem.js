import React, {useState} from "react"
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { isNullOrEmpty } from '../utils/isNullOrEmpty'
import { theme } from '../utils/theme'
import { useNavigation } from '@react-navigation/native';
import { TextInputMask, TextInput, IconButton, HelperText, ActivityIndicator } from 'react-native-paper';
import { database } from "../config/firebaseconfig"

const TypeItem = ({item, role, userId, type}) => {

    const navigation = useNavigation();

    const [editVisible, setEditVisible] = useState(false)
    const [itemValue, setItemValue] = useState(item)
    const [title, setTitle] = useState({value: item!=null ? item.title : null, error: ""})
    const [desc, setDesc] = useState({value: item!=null ? item.desc : null, error: ""})
    const [price, setPrice] = useState({value: item!=null ? item.price : null, error: ""})
    const [loading, setLoading] = useState(false)

    const updateItem = () => {
        setLoading(true)

        database.collection(type=="WASH" ? "washes" : "vehicles").doc(itemValue.id).update({
            title: title.value,
            desc: desc.value,
            price: price.value
        }).then(() => {
            setEditVisible(false)
            setLoading(false)
        })
    }

    const handleXClick = () => {
        if (editVisible) {
            setEditVisible(false)
        } else {
            setLoading(true)
            database.collection(type == "WASH" ? "washes" : "vehicles").doc(itemValue.id).delete()
        }
    }

    const handleEditClick = () => {
        if (editVisible) {
            updateItem()
        } else {
            setEditVisible(true)
        }
    }

    return(
        <>{itemValue != null && <View style={styles.container} onPress={() => setEditVisible(true)}>
            <View style={{width: "80%"}}>
                <TextInput
                    label={"Tipo"}
                    style={{backgroundColor: "white", padding: 0, margin: 0, marginLeft: 15}}
                    value={title.value}
                    onChangeText={text => setTitle({ value: text, error: '' })}
                    autoCapitalize="none"
                    theme={theme} 
                    disabled={!editVisible}
                />
                <HelperText type="error" visible={title.error != ''} style={{height: title.error != '' ? 30 : 0}}>
                    {title.error}
                </HelperText>
                {!isNullOrEmpty(desc.value) && 
                <>
                    <TextInput
                        label={"Descrição"}
                        style={{backgroundColor: "white", padding: 0, margin: 0, marginLeft: 15}}
                        value={desc.value}
                        onChangeText={text => setDesc({ value: text, error: '' })}
                        autoCapitalize="none"
                        theme={theme} 
                        disabled={!editVisible}
                    />
                    <HelperText type="error" visible={desc.error != ''} style={{height: desc.error != '' ? 30 : 0}}>
                        {desc.error}
                    </HelperText>
                </>}
                <TextInput
                    label={"Valor (R$)"}
                    style={{backgroundColor: "white", padding: 0, margin: 0, marginLeft: 15}}
                    value={price.value}
                    onChangeText={text => setPrice({ value: text, error: '' })}
                    autoCapitalize="none"
                    keyboardType="numeric"
                    theme={theme} 
                    disabled={!editVisible}
                />
                <HelperText type="error" visible={price.error != ''} style={{height: price.error != '' ? 30 : 0}}>
                    {price.error}
                </HelperText>
            </View>
            <View style={{width: "20%", justifyContent: "space-around", alignItems: "center"}}>
                {!loading && <IconButton
                    icon={editVisible ? "close" : "trash-can"}
                    color={editVisible ? theme.colors.backdrop : theme.colors.error}
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
        }
        </>
    )
}


const styles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "row",
        backgroundColor: "white",
        marginBottom: 15
    }
})

export default TypeItem