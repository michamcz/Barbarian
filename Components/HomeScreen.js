import react, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import axios from "axios";

export default function HomeScreen() {
  const [givenConc, setGivenConc] = useState(null);
  const [actualConc, setActualConc] = useState(null);
  const [status, setStatus] = useState(false);
  const [statusComplete, setStatusComplete] = useState(false);
  const [givenConcComplete, setGivenConcComplete] = useState(false);
  const [givenConcGet, setGivenConcGet] = useState(null);
  const ipAddress = "192.168.31.5";

  const getStatus = () => {
    setStatusComplete(false);
    axios
      .get(`http://${ipAddress}/status`)
      .then(function (res) {
        if (res.status == "200") {
          console.log(res.data);
          if (res.data == "1") {
            setStatus(true);
            setStatusComplete(true);
          } else if (res.data == "0") {
            setStatus(false);
            setStatusComplete(true);
          } else setStatus(false);
        }
        return 1;
      })
      .catch(function (error) {
        //setStatusComplete(true); //test
        console.error("getStatusError", error);
      });
  };

  const getGivenConc = () => {
    axios
      .get(`http://${ipAddress}/height`)
      .then(function (response) {
        if (response.status == "200") {
          setGivenConcComplete(true);
          return response.data;
        }
      })
      .catch(function (error) {
        //setGivenConcComplete(true); //test
        console.error("getGivenConcError", error);
      });
  };

  const getActualConc = () => {
    axios
      .get(`http://${ipAddress}/nowheight`)
      .then(function (response) {
        if (response.status == "200") {
          return response.data;
        }
      })
      .catch(function (error) {
        console.error("getActualConcError", error);
      });
  };

  const sendDecreasedConc = () => {
    axios
      .get(`http://${ipAddress}/decheight`)
      .then(function (response) {
        if (response.status == "200") return 1;
      })
      .catch(function (error) {
        console.error("increasingError", error);
      });
  };

  const sendIncreasedConc = () => {
    axios
      .get(`http://${ipAddress}/incheight`)
      .then(function (response) {
        if (response.status == "200") return 1;
      })
      .catch(function (error) {
        console.error("decreasingError", error);
      });
  };

  const decrementGivenConc = () => {
    if (givenConc >= 500) {
      setGivenConc(givenConc - 500);
      sendDecreasedConc();
      setGivenConcGet(getGivenConc() || null);
    }
  };

  const incrementGivenConc = () => {
    if (givenConc <= 4500) {
      setGivenConc(givenConc + 500);
      sendIncreasedConc();
      setGivenConcGet(getGivenConc() || null);
    }
  };

  const handleStatusButton = () => {
    if (status == true) {
      axios
        .get(`http://${ipAddress}/requestOFF`)
        .then(function (response) {
          if (response.status == "200") return 1;
        })
        .catch(function (error) {
          console.error("sendStatusONError", error);
        });
    } else if (status == false) {
      axios
        .get(`http://${ipAddress}/requestON`)
        .then(function (response) {
          if (response.status == "200") return 1;
        })
        .catch(function (error) {
          console.error("sendStatusOFFError", error);
        });
    }
    setStatus(!status);
  };

  useEffect(() => {
    getStatus();
  }, []);

  useEffect(() => {
    if (status == true) {
      setGivenConc(getGivenConc() || null); //test
      const interval = setInterval(() => {
        setActualConc(getActualConc() || null);
      }, 5000);
      return () => clearInterval(interval);
    } else if (status == false) {
      setGivenConcComplete(false);
      setActualConc(null);
    }
  }, [status]);

  return (
    <View style={styles.container}>
      {!statusComplete || (status && !givenConcComplete) ? (
        <View>
          <Text style={styles.text}>Czekam na połączenie</Text>
          <ActivityIndicator size="small" color="#fff" />
        </View>
      ) : null}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.buttonStatus}
          onPress={() => handleStatusButton()}
          disabled={!statusComplete}
        >
          <Text style={styles.text}>
            Status:
            {!statusComplete ? (
              <Text style={styles.text}> - </Text>
            ) : status ? (
              <Text style={styles.text}> ON</Text>
            ) : (
              <Text style={styles.text}> OFF</Text>
            )}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => decrementGivenConc()}
          disabled={!status || !givenConcComplete}
        >
          <Text
            style={
              status && givenConcComplete ? styles.text : styles.textDisactive
            }
          >
            -500m
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          disabled={!status || !givenConcComplete}
          style={styles.button}
          onPress={() => incrementGivenConc()}
        >
          <Text
            style={
              status && givenConcComplete ? styles.text : styles.textDisactive
            }
          >
            +500m
          </Text>
        </TouchableOpacity>
      </View>
      <Text style={status ? styles.text : styles.textDisactive}>
        {" "}
        Zadana wysokość: {givenConc !== null ? `${givenConc}m` : "-"}
      </Text>
      <Text style={status ? styles.text : styles.textDisactive}>
        {" "}
        Zadana wysokość z get:{" "}
        {status && givenConcGet !== null ? `${givenConcGet}m` : "-"}
      </Text>
      <Text style={status ? styles.text : styles.textDisactive}>
        {" "}
        Aktualna wysokość:{" "}
        {status && actualConc !== null ? `${actualConc}m` : "-"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#232931",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "white",
    fontSize: 20,
  },
  textDisactive: {
    color: "lightgray",
    fontSize: 20,
  },
  button: {
    flex: 0.3,
    padding: 16,
    marginHorizontal: 10,
    backgroundColor: "tomato",
    alignItems: "center",
  },
  buttonStatus: {
    flex: 0.5,
    padding: 16,
    backgroundColor: "tomato",
    alignItems: "center",
  },
  buttonsContainer: {
    flex: 0.2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
});
