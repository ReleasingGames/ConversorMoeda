import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";
import axios from "axios";
import { Picker } from "@react-native-picker/picker"; // Import correto para o Picker

const App = () => {
  const [amount, setAmount] = useState("");
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [exchangeRate, setExchangeRate] = useState(null); // Para armazenar o valor da taxa de câmbio
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("BRL"); // Mudando para BRL como padrão
  const scaleAnim = useRef(new Animated.Value(1)).current; // Animação de escala para o botão
  const fadeAnim = useRef(new Animated.Value(0)).current; // Animação de fade para o resultado

  const currencyOptions = ["USD", "EUR", "BRL", "GBP", "JPY", "CAD"];

  const convertCurrency = async () => {
    if (amount === "") return;

    // Animação ao pressionar o botão
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    try {
      const response = await axios.get(
        `https://api.exchangerate-api.com/v4/latest/${fromCurrency}`,
        {
          headers: {
            apikey: "512593ad814f47777797256e", // Substitua com sua chave de API
          },
        }
      );
      const rate = response.data.rates[toCurrency];
      const result = (amount * rate).toFixed(2);
      setConvertedAmount(result);
      setExchangeRate(rate); // Armazenar a taxa de câmbio

      // Animação de fade do resultado
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    } catch (error) {
      console.error("Erro ao buscar taxa de câmbio:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Conversor de Moeda</Text>

      <TextInput
        placeholder="Digite o valor"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
        style={styles.input}
        placeholderTextColor="#888"
      />

      <View style={styles.currencyRow}>
        <Text style={styles.label}>De:</Text>
        <Picker
          selectedValue={fromCurrency}
          style={styles.picker}
          onValueChange={(itemValue) => setFromCurrency(itemValue)}
        >
          {currencyOptions.map((currency) => (
            <Picker.Item key={currency} label={currency} value={currency} />
          ))}
        </Picker>

        <Text style={styles.label}>Para:</Text>
        <Picker
          selectedValue={toCurrency}
          style={styles.picker}
          onValueChange={(itemValue) => setToCurrency(itemValue)}
        >
          {currencyOptions.map((currency) => (
            <Picker.Item key={currency} label={currency} value={currency} />
          ))}
        </Picker>
      </View>

      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <TouchableOpacity style={styles.button} onPress={convertCurrency}>
          <Text style={styles.buttonText}>Converter</Text>
        </TouchableOpacity>
      </Animated.View>

      {convertedAmount && (
        <Animated.View style={{ opacity: fadeAnim }}>
          <Text style={styles.result}>
            Valor convertido: {convertedAmount} {toCurrency}
          </Text>
          {exchangeRate && (
            <Text style={styles.exchangeRate}>
              1 {fromCurrency} = {exchangeRate} {toCurrency}
            </Text>
          )}
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  input: {
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    fontSize: 18,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  currencyRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#444",
  },
  picker: {
    height: 50,
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginHorizontal: 10,
  },
  button: {
    backgroundColor: "#4CAF50",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,
  },
  buttonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
  result: {
    fontSize: 20,
    marginTop: 30,
    textAlign: "center",
    color: "#333",
    fontWeight: "bold",
  },
  exchangeRate: {
    fontSize: 14,
    color: "#888", // Estilo sutil para o texto da cotação
    textAlign: "center",
    marginTop: 10,
  },
});

export default App;
