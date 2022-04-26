import React, { useEffect, useState } from "react"

import {
    StyleSheet,
    View,
    Text,
    ActivityIndicator,
    Linking,
    Image
} from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"
import { Button, IconButton } from "react-native-paper"
import { SafeAreaView } from "react-native-safe-area-context"
import { database, storage } from "../../config/firebaseconfig"
import { theme } from "../../utils/theme"

const Address = () => {

    const [loading, setLoading] = useState(true)
    const [loadingImage, setLoadingImage] = useState(true)
    const [imageUrl, setImageUrl] = useState("")
    const [address, setAddress] = useState({})

    useEffect(() => {
        setLoading(true)
        const unsubscribe = database.collection("address").limit(1).onSnapshot((query) => {
            const dataAddress = query.docs[0].data()
            setAddress(dataAddress)
            setLoading(false)
        })

        return unsubscribe
    }, [])

    useEffect(() => {
        setLoadingImage(true)
        storage.ref("mapa.png")
            .getDownloadURL()
            .then((url) => {
                setImageUrl(url)
                setLoadingImage(false)
            }).catch((e) => console.log('Errors while downloading => ', e));
    }, []);

    const startNavigation = () => {
        if(!loading && !loadingImage) {
            Linking.canOpenURL(address.link).then(supported => {
                if (supported) {
                    Linking.openURL(address.link);
                } else {
                    console.log('Don\'t know how to open URI: ' + url);
                }
            })
        }
    }

    return(
        <SafeAreaView style={{flex: 1}}>
                {!loadingImage && !loading &&<View style={{flex: 1, justifyContent: "center"}}>
                    <Image style={{ height: 300, width: "100%"}} resizeMode={"cover"} source={{uri: imageUrl}} />
                    <Text style={{ marginTop: 20, fontWeight: "bold", fontSize: 20, marginHorizontal: 15, textAlign: "center"}}>{address.desc}</Text>
                </View>}
                {!loadingImage && !loading &&<View style={{flex: 1, justifyContent: "center"}}>
                <Button icon="map" mode="contained" onPress={startNavigation} style={{marginHorizontal: 15}}>
                  Clique para abrir no mapa
                </Button>
                </View>}
                {(loading || loadingImage) && <ActivityIndicator size={"large"} color={theme.colors.primary} style={{alignSelf: "center"}}/>}
         
        </SafeAreaView>
    )
}

export default Address