import { Text, TextInput, View } from "react-native";
import MyButton from "../../components/mybutton/mybutton.jsx";
import MapView, {Marker, PROVIDER_DEFAULT} from "react-native-maps";
import { styles } from "./ride-detail.style.js";
import { useState } from "react";
import icons from "../../constants/icons.js";

function RideDetail(props) {

    const [myLocation, setMyLocatio] = useState({
        latitude: 20,
        longitude: 20
    });


    return <View style={styles.container}>
        <MapView style={styles.map} 
            provider={PROVIDER_DEFAULT}
            initialRegion={{
                latitude: -8.016550,
                longitude: -34.951012,
                latitudeDelta: 0.004,
                longitudeDelta: 0.004
            }}

            >

            <Marker coordinate={{
                latitude: -8.016550,
                longitude: -34.951012,
            }}
            title="Gilvs Alves"
            description="R. Manuel de Medeiros, 1-33 - Dois Irmãos"
            image={icons.location}
            style={styles.marker}
            />
        </MapView>

            <View style={styles.footer}>

                <View style={styles.footerText}>
                    <Text>Encontre a sua carona:</Text>
                    
                </View>
                <View style={styles.footerFields}>
                    <Text>Origen</Text>
                    <TextInput style={styles.input}  />
                </View>
                <View style={styles.footerFields}>
                    <Text>Destino</Text>
                    <TextInput style={styles.input}  />
                </View>
                
            </View>

        <MyButton text="ACEITAR" theme=" " />
    </View>
}

export default RideDetail;
