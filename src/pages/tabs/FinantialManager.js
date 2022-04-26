import React, { useState } from "react"

import SegmentedControl from '@react-native-segmented-control/segmented-control';

import { Title, TextInput, Button, HelperText } from 'react-native-paper';

import { theme } from "../../utils/theme";

import {
    StyleSheet,
    View,
    Text,
    SafeAreaView,
    FlatList
} from "react-native"
import SegmentVehicle from "../../components/SegmentVehicle";
import SegmentWash from "../../components/SegmentWash";

const FinantialManager = () => {

    const [selectedIndex, setSelectedIndex] = useState(0)

    return (
        <SafeAreaView style={{ flex: 1, paddingHorizontal: 10, paddingTop: 15 }}>
            <SegmentedControl
                values={["Veículos", "Lavagens"]}
                style={{marginBottom: 15}}
                selectedIndex={selectedIndex}
                onChange={(event) => {
                    setSelectedIndex(event.nativeEvent.selectedSegmentIndex)
                }} />
            {selectedIndex == 0 &&
                <SegmentVehicle/>
            }
            {selectedIndex == 1 &&
                <SegmentWash/>
            }
            {/*selectedIndex == 2 &&
                <SegmentWasher/>
            */}
        </SafeAreaView>
    )
}

export default FinantialManager