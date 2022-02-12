import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, ScrollView, Dimensions, ActivityIndicator } from "react-native";
import * as Location from "expo-location";
import moment from "moment";
import { Fontisto } from "@expo/vector-icons";
import { WEATHER_API_KEY } from "dotenv"

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const icons = {
  Clouds: "cloudy",
  Clear: "day-sunny",
  Atmosphere: "cloudy-gusts",
  Snow: "snow",
  Rain: "rains",
  Drizzle: "rain",
  Thunderstorm: "lighning",
};

export default function App() {
  const [city, setCity] = useState("");
  const [days, setDays] = useState([]);
  const [ok, setOk] = useState(true);

  const getWeather = async () => {
    const {granted} = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      setOk(false);
    }
    const { coords: { latitude, longitude } } = await Location.getCurrentPositionAsync({ accuracy: 6 });
    const location = await Location.reverseGeocodeAsync({ latitude, longitude }, { useGoogleMaps: false });
    setCity(location[0].city);

    const apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${WEATHER_API_KEY}&units=metric`;
    const response = await fetch(apiUrl);
    const json = await response.json();
    setDays(json.daily);
  }

  useEffect(() => {
    getWeather();
  }, []);

  return (
    <View style={style.container}>
      <View style={style.city}>
        <View style={style.cityLeftSection}></View>
        <View style={style.cityCenterSection}><Text style={style.cityText}>{city}</Text></View>
        <View style={style.cityRightSection}></View>
      </View>
      <ScrollView horizontal contentContainerStyle={style.weather} pagingEnabled={true}>
        {days.length === 0 ? (
            <View style={style.weatherItemSection}>
            <ActivityIndicator
              color="white"
              style={{ marginTop: 10 }}
              size="large"
            />
            </View>
          ) : (
            days.map((day, idx) => (
              <View key={idx} style={style.weatherItemSection}>
                <Text style={style.weatherItemDate}>{moment.unix(day.dt).format('YYYY-MM-DD')}</Text>
                <View style={{ flexDirection: "row", alignItems: "center", width: "100%", justifyContent: "space-between" }}>
                  <Text style={style.weatherItemTemp}>{parseFloat(day.temp.day).toFixed(1)}</Text>
                  <Fontisto name={icons[day.weather[0].main]} size={50} color="white" style={{ paddingRight: 30 }} />
                </View>
                <Text style={style.weatherItemDesc}>{day.weather[0].main}</Text>
                <Text style={style.weatherItemDescDetail}>{day.weather[0].description}</Text>
              </View>
            )) 
          )
          
        }
        
      </ScrollView>
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#05668D",
  },
  city: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  cityLeftSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cityCenterSection: {
    flex: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  cityRightSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cityText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 20,
  },

  weather: {
    flexDirection: "row",
  },
  weatherItemSection: {
    paddingLeft: 30, 
    width: SCREEN_WIDTH,
  },
  weatherItemDate: {
    fontSize: 28,
    color: "#FFFFFF",
  },
  weatherItemTemp: {
    fontSize: 100,
    marginTop: 10,
    color: "#FFFFFF",
  },
  weatherItemDesc: {
    fontSize: 40,
    marginTop: -10,
    color: "#FFFFFF",
  },
  weatherItemDescDetail: {
    fontSize: 15,
    marginTop: 20,
    color: "#FFFFFF",
  },
});
