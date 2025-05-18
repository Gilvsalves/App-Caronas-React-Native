import { View } from "react-native";
import MyButton from "../../components/mybutton/mybutton.jsx";
import MapView, {PROVIDER_DEFAULT} from "react-native-maps";
import { styles } from "./passenger.style.js";
import { useState } from "react";

function Passenger(props) {

    const [myLocation, setMyLocatio] = useState(null);

    

    return <View style={styles.container}>
        <MapView style={styles.map} provider={PROVIDER_DEFAULT}>

        </MapView>
        <MyButton text="TESTE" />
    </View>
}

export default Passenger;
