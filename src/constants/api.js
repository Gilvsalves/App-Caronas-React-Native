import axios from "axios";
import { Alert } from "react-native";

const api = axios.create({
  baseURL: "http://10.24.44.207:3001", //IP: Adaptador de Rede sem Fio Wi-Fi, endereço ipv4. Essa bodega sempre muda, verifique o seu ip atual com ipconfig ou ifconfig no terminal ou cmd.
  timeout: 10000
});

function HandleError(error) {
  console.log("Erro de rede completo:", error);
  if (error.response?.data?.error) {
    Alert.alert(error.response.data.error);
  } else {
    Alert.alert("Erro de conexão com o servidor.");
  }
}

export { api, HandleError };