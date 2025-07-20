import { ActivityIndicator, Text, TextInput, View } from "react-native";
import MyButton from "../../components/mybutton/mybutton.jsx";
import MapView, {Marker, PROVIDER_DEFAULT} from "react-native-maps";
import { styles } from "./passenger.style.js";
import { useEffect, useState } from "react";
import icons from "../../constants/icons.js";
import { getCurrentPositionAsync, requestForegroundPermissionsAsync, reverseGeocodeAsync } from "expo-location";
import {api, HandleError} from "../../constants/api.js"

function Passenger(props) {

    const userId = 1; //Para teste de login Passageiro

    const [myLocation, setMyLocation] = useState({  });

    const [title, setTitle] = useState("");

    const [pickupAddress, setPickupAddress] = useState("");
    
    const [dropoffAddress, setDropoffAddress] = useState("");

    const [status, setStatus] = useState("");

    const [rideId, setRideId] = useState("");

    const [driverName, setDriverName] = useState(0);

    async function RequestRideFromUser(){
        //Busca os  dados da API.
        //const response = {  };
        // const response = {
        //     ride_id: 1,
        //     passenger_user_id: 1,
        //     passenger_name: "Heber Stein Mazutti",
        //     passenger_phone: "(11) 99999-9999",
        //     pickup_address: "R. Manuel de Medeiros, 1-33 - Dois Irmãos",
        //     pickup_date: "2025-02-17",
        //     pickup_latitude: "-8.016550",
        //     pickup_longitude: "-34.951012",
        //     dropoff_address: "Shopping Plaza",
        //     status: "A",
        //     driver_user_id: 2,
        //     driver_name: "Gilvs Alves",
        //     driver_phone: "(81)99999-9999",
            
        // };

        try {
            console.log("Buscando corridas na API...");
            const response = await api.get("/rides", {
                params:{
                    passenger_user_id: userId,
                    pickup_date: new Date().toLocaleDateString("sv-SE", { timeZone: "America/Sao_Paulo" }).substring(0, 10),
                    status_not: "F"
                }
            });
            console.log("Resposta da API obtida:", response.data);
            return response.data[0] || {};
        } catch (error) {
            console.error("Erro na requisição:", error);
            HandleError(error);
            props.navigation.goBack();
        }
    }

    async function RequestPermissionAndGetLocation(){
        const {granted} = await requestForegroundPermissionsAsync();

        if(granted){
            const currentPosition = await getCurrentPositionAsync();
            
            if(currentPosition.coords){
                return currentPosition.coords
            }else{
                return {};
            }
        }else{
            return {};
        }
    }

    async function RequestAddressName(lat, long){
        const response = await reverseGeocodeAsync({
            latitude: lat,
            longitude: long,
        });

        //console.log(response)
        
        if(response[0].street && response[0].streetNumber && response[0].district){
            setPickupAddress(response[0].street + ", " + response[0].streetNumber + "- " + response[0].district )
        }


    }

    async function LoadScreen(){
    console.log("Iniciando LoadScreen...");

    const response = await RequestRideFromUser();
    console.log("Resposta da API:", response);

    if (!response || !response.ride_id){
        console.log("Nenhuma corrida ativa, solicitando localização...");

        const location = await RequestPermissionAndGetLocation();
        console.log("Localização atual:", location);

        if(location.latitude){
            setTitle("Encontrar a sua carona now")
            setMyLocation(location);
            RequestAddressName(location.latitude, location.longitude);
        } else {
            Alert.alert("Não foi possível obter sua localização.");
        }
    } else {
        console.log("Corrida encontrada:", response);

        setTitle(response.status == "P" ? "Aguardando uma carona..." : "Carona encontrada!");
        setMyLocation({
            latitude: Number(response.pickup_latitude),
            longitude: Number(response.pickup_longitude)
        });
        setPickupAddress(response.pickup_address);
        setDropoffAddress(response.dropoff_address);
        setStatus(response.status);
        setRideId(response.ride_id)
        setDriverName(response.driver_name + " - " + response.driver_phone);
    }
}


    async function AskForRide(){

        try {

            const json = {
            passenger_user_id: userId,
            pickup_address: pickupAddress,
            dropoff_address: dropoffAddress,
            pickup_latitude: myLocation.latitude,
            pickup_longitude: myLocation.longitude,
        }

            console.log("Inserindo corrida na API...");
            const response = await api.post("/rides", json );

            console.log("Resposta da API obtida:", response.data);
            if(response.data)
                props.navigation.goBack();
 
        } catch (error) {
            console.error("Erro na requisição:", error);
            HandleError(error);
            
        }
    }
    

    async function CancelRide(){

        try {

            console.log("Deletando corrida na API...");
            const response = await api.delete("/rides/" + rideId );

            console.log("Resposta da API obtida:", response.data);
            if(response.data)
                console.log("Corrida cancelada!")
                props.navigation.goBack();
 
        } catch (error) {
            console.error("Erro na requisição:", error);
            HandleError(error);
            
        }
        
    }
    
    async function FinishRide(){

        const json = {
            passenger_user_id: userId,
        };

        try {

            console.log("Finalizar corrida na API...");
            const response = await api.put("/rides/" + rideId + "/finish", json);

            //console.log("Resposta da API obtida:", response.data);
            if(response.data)
                console.log("Corrida cancelada!")
                props.navigation.goBack();
 
        } catch (error) {
            console.error("Erro na requisição:", error);
            HandleError(error);
        }
    }



    useEffect(()=>{
        LoadScreen();
    }, [])


    return <View style={styles.container}>

        {myLocation.latitude ? <>
        
        <MapView style={styles.map} 
            provider={PROVIDER_DEFAULT}
            initialRegion={{
                latitude: myLocation.latitude,
                longitude: myLocation.longitude,
                latitudeDelta: 0.004,
                longitudeDelta: 0.004
            }}

            >

            <Marker coordinate={{
                latitude: myLocation.latitude,
                longitude: myLocation.longitude,
            }}
            title="Gilvs Alves"
            description="R. Manuel de Medeiros, 1-33 - Dois Irmãos"
            image={icons.location}
            style={styles.marker}
            />
        </MapView>

            <View style={styles.footer}>

                <View style={styles.footerText}>
                    <Text>{title}</Text>
                    
                </View>
                <View style={styles.footerFields}>
                    <Text>Origen</Text>
                    <TextInput style={styles.input} value={pickupAddress} 
                        onChangeText={(text)=> setPickupAddress(text)}
                        editable={status == "" ? true : false}
                    />
                </View>
                <View style={styles.footerFields}>
                    <Text>Destino</Text>
                    <TextInput style={styles.input} value={dropoffAddress}
                        onChangeText={(text)=> setDropoffAddress(text)}
                        editable={status == "" ? true : false}
                    />
                    
                </View>

                { //Renderiza a bio name do motorista:
                    status == "A" && 
                    <View style={styles.footerFields}>
                    <Text>Motorista</Text>
                    <TextInput style={styles.input} value={driverName}
                        editable={false}
                    />
                    
                </View>
                }

                
                {/* <View style={styles.footerFields}>
                    <Text>Motorista</Text>
                    <TextInput style={styles.input}  />
                </View> */}
                
            </View>

            { //Se o status for vazio renderiza o botão:
                status == "" && <MyButton text="CONFIRMAR" theme="" onClick={AskForRide}/>
            }
            { //Se o status for Pendente renderiza o botão:
                status == "P" && <MyButton text="CANCELAR" theme="red" onClick={CancelRide}/>
            }
            { //Se o status for Aceito renderiza o botão:
                status == "A" && <MyButton text="FINALIZAR" theme="red" onClick={FinishRide}/>
            }

        </>
        : <View style={styles.loading}>
            <ActivityIndicator size="large" />
        </View>
        }
    </View>
}

export default Passenger;
