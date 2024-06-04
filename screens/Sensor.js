import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, Image } from 'react-native';



const Sensor = () => {
    const [data, setData] = useState(null);
    const [isLoading, setLoading] = useState(true);
    const [temperature, setTemperature] = useState('');
    const [humidity, setHumidity] = useState('');
    const [ID, setID] = useState('');
    const [RSSI, setRSSI] = useState('');
    const [Time, setTime] = useState('');
    const [relay1Status, setRelay1Status] = useState(false);  // State for relay1 status
    const [relay2Status, setRelay2Status] = useState(false);  // State for relay2 status
    const [isManualMode, setIsManualMode] = useState(true);  // true for Manual, false for Auto

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await fetch('https://6t0cl21r-5000.asse.devtunnels.ms/api/BoardSTR423_DuLieuGuiXuongBoard');
            const responseData = await response.json();
            setData(responseData);

            setID(responseData.ID);

            const sParts = responseData.S.split(';');
            if (sParts.length >= 4) {
                let rssiString = sParts[0];
                const temp = parseFloat(sParts[1]);
                const hum = parseFloat(sParts[2]);
                const time = sParts[3];

                // Extract relay statuses and WiFi strength from the RSSI string
                const relay1Bit = rssiString[0] === '1';
                const relay2Bit = rssiString[1] === '1';
                let wifiStrength = rssiString.slice(-3);  // Last 3 characters

                if (wifiStrength.length > 2) {
                    wifiStrength = wifiStrength.slice(-2);  // Take last 2 characters if length > 2
                }
                const rssi = parseInt(wifiStrength);

                setRelay1Status(relay1Bit);
                setRelay2Status(relay2Bit);
                setRSSI(rssi);
                setTemperature(temp.toFixed(2));
                setHumidity(hum.toFixed(2));
                setTime(time);
                console.log(rssi);
                console.log(sParts);
                // Tách chuỗi độ mạnh WiFi từ phía cuối
                
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };
// Nút nhấn chuyển chế độ
    const toggleMode = async () => {
        const newMode = !isManualMode;
        setIsManualMode(newMode);

        const relay1Bit = relay1Status ? "1" : "0";
        const relay2Bit = relay2Status ? "1" : "0";
        const modeBit = newMode ? "0" : "1";              // 0 for Manual, 1 for Auto
        const SValue = `${relay1Bit}${relay2Bit}00${modeBit}11`;

        try {
            const response = await fetch('https://6t0cl21r-5000.asse.devtunnels.ms/api/BoardSTR423_DuLieuGuiXuongBoard?CheDo=1&key=', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify([
                    {
                        "ID": ID,
                        "S": SValue
                    }
                ]),
            });
            const responseData = await response.json();
            console.log('Response:', responseData);
        } catch (error) {
            console.error('Error sending data:', error);
        }
    }
//Nút nhấn RELAY1 status
    const toggleRelay1 = async () => {
        if (isManualMode) {
            const newStatus = !relay1Status;
            setRelay1Status(newStatus);

            const relay1Bit = newStatus ? "1" : "0";
            const relay2Bit = relay2Status ? "1" : "0";
            const modeBit = isManualMode ? "0" : "1";              // 0 for Manual, 1 for Auto
            const SValue = `${relay1Bit}${relay2Bit}00${modeBit}11`;

            try {
                const response = await fetch('https://6t0cl21r-5000.asse.devtunnels.ms/api/BoardSTR423_DuLieuGuiXuongBoard?CheDo=1&key=', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify([
                        {
                            "ID": ID,
                            "S": SValue
                        }
                    ]),
                });
                const responseData = await response.json();
                console.log('Response:', responseData);
            } catch (error) {
                console.error('Error sending data:', error);
            }
        }
    };
// Nút nhấn RELAY2 status
    const toggleRelay2 = async () => {
        if (isManualMode) {
            const newStatus = !relay2Status;
            setRelay2Status(newStatus);

            const relay1Bit = relay1Status ? "1" : "0";
            const relay2Bit = newStatus ? "1" : "0";
            const modeBit = isManualMode ? "0" : "1";              // 0 for Manual, 1 for Auto
            const SValue = `${relay1Bit}${relay2Bit}00${modeBit}11`;

            try {
                const response = await fetch('https://6t0cl21r-5000.asse.devtunnels.ms/api/BoardSTR423_DuLieuGuiXuongBoard?CheDo=1&key=', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify([
                        {
                            "ID": ID,
                            "S": SValue
                        }
                    ]),
                });
                const responseData = await response.json();
                console.log('Response:', responseData);
            } catch (error) {
                console.error('Error sending data:', error);
            }
        }
    };

    // setInterval(() => {
    //     fetchData();
    // }, 50000);

    useEffect(() => {
        const interval = setInterval(() => {
            fetchData();
        }, 500);

        return () => clearInterval(interval);
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.Top}>
                <View style={styles.IotVison}>
                    {/* <Text style={styles.textTop}>IotVision</Text> */}
                    <Image
                        source={require('./../img/iot_logo.png')}
                        resizeMode={'Stretch'}
                        style={{ width: '70%', height: '70%' ,paddingTop: '20'}}
                    />
                </View>
                <View style={styles.helloMinhthuan}>
                    <Text style={styles.textHello}>Hello</Text>
                    <Text style={styles.textMinhthuan}>MINH THUAN,</Text>
                </View>
            </View>

            <View style={styles.Mid}>
                <View style={styles.ThongSoBoard}>
                    <Text style={styles.title}>Board ID: {ID}</Text> 
                    <Text style={styles.title}>Thời gian: {Time}</Text>
                    <Text style={styles.title}>Độ mạnh WiFi: {RSSI}</Text>
                </View>
                <View style={styles.ThongSoRelay}>
                    <TouchableOpacity onPress={toggleRelay1}>
                        <View style={[styles.relay1, relay1Status ? styles.relayOn : styles.relayOff]}>
                            <Text style={styles.textrelay}>relay1</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={toggleRelay2}>
                        <View style={[styles.relay2, relay2Status ? styles.relayOn : styles.relayOff]}>
                            <Text style={styles.textrelay}>relay2</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={toggleMode}>
                        <View style={[styles.modeButton, isManualMode ? styles.manualMode : styles.autoMode]}>
                            <Text style={styles.textrelay}>{isManualMode ? "Manual" : "Auto"}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                       
            </View>

            <View style={styles.Bottom}>
                <View style={styles.data}>
                    <View style={styles.temp}>
                        <Text style={styles.title}>Temperature</Text>
                        <Text style={styles.dataText}>{`${temperature}°C`}</Text>
                    </View>
                    <View style={styles.humid}>
                        <Text style={styles.title}>Humidity</Text>
                        <Text style={styles.dataText}>{`${humidity}%`}</Text>
                    </View>
                </View>
                <Button title="Refresh" onPress={fetchData} />
            </View>
        </View>
    );
};

export default Sensor;



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#dcdbdc"
    },
    text: {
        fontSize: 100,
        fontWeight: "100",
        color: '#1D1D1D',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    Top: {
        flex: 1,
        // backgroundColor: "red",
    },
    IotVison: {
        flex: 1,
        marginTop: 50,
        alignItems:'center'
    },
    textTop: {
        fontSize: 50,
        fontWeight: "100",
        color: '#ee4f30',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    helloMinhthuan: {
        flex: 2,
        marginLeft: 20,
        marginBottom: 20,
    },
    textHello: {
        fontSize: 20,
        color: '#1D1D1D',
    },
    textMinhthuan: {
        fontSize: 30,
        color: '#1D1D1D',
    },
    Mid: {
        flex: 1,
        // marginLeft: 10,
        // backgroundColor: 'green',
        flexDirection: "column",
    },
    ThongSoBoard: {
        flex: 1,
    },
    ThongSoRelay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: "row",

    },
    Bottom: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor:'blue',
    },
    data: {
        flexDirection: "row",
        height: "20%",
        justifyContent: "center",
        alignContent: "center",
        width: "80%",
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "black",
    },
    temp: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    humid: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        marginLeft: 20,
        fontWeight: "100",
        color: '#1D1D1D',
        fontWeight: 'bold',
    },
    dataText: {
        fontSize: 30,
        fontWeight: "100",
        color: '#1D1D1D',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    relay1: {
        backgroundColor: "red",
        width: 100,
        height: 50,
        margin: 10,
        borderRadius: 45,
        alignItems: "center",
        justifyContent:"center",
    },
    relay2: {
        backgroundColor: "red",
        width: 100,
        height: 50,
        margin: 10,
        borderRadius: 45,
        alignItems: "center",
        justifyContent:"center",
    },
    textrelay: {
        fontSize: 20,
        color: '#1D1D1D',
        
    },
    relayOn: {
        backgroundColor: 'green', // color for relay when ON
    },
    relayOff: {
        backgroundColor: 'red',
    },
    modeButton: {
        width: 100,
        height: 50,
        margin: 10,
        borderRadius: 45,
        alignItems: "center",
        justifyContent: "center",
    },
    manualMode: {
        backgroundColor: 'blue', // color for manual mode
    },
    autoMode: {
        backgroundColor: 'orange', // color for auto mode
    },
});
