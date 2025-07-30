import mqtt from "mqtt"
import { PUBLISH_TOPIC } from "./constants";
import { handleChangeStatus } from "./message/sensor.change_status";
import { handleReservation } from "./message/sensor.reservation";
import { handleRfidDetection } from "./message/sensor.rfid_detection";

const client = mqtt.connect(process.env.MQTT_BROKER_URL ?? "http://localhost", { port: 1883 });

client.on('connect', () => {
    client.subscribe(PUBLISH_TOPIC["SENSOR:CHANGE_STATUS"], (err) => {
        if (err) {
            console.error(`Error al suscribirse al tópico ${PUBLISH_TOPIC["SENSOR:CHANGE_STATUS"]}:`, err);
        } else {
            console.log(`Suscrito al tópico ${PUBLISH_TOPIC["SENSOR:CHANGE_STATUS"]}`);
        }
    });
    client.subscribe(PUBLISH_TOPIC["SENSOR:RESERVATION"], (err) => {
        if (err) {
            console.error(`Error al suscribirse al tópico ${PUBLISH_TOPIC["SENSOR:RESERVATION"]}:`, err);
        } else {
            console.log(`Suscrito al tópico ${PUBLISH_TOPIC["SENSOR:RESERVATION"]}`);
        }
    })
    client.subscribe(PUBLISH_TOPIC["SENSOR:RFID_DETECTION"], (err) => {
        if (err) {
            console.error(`Error al suscribirse al tópico ${PUBLISH_TOPIC["SENSOR:RFID_DETECTION"]}:`, err);
        } else {
            console.log(`Suscrito al tópico ${PUBLISH_TOPIC["SENSOR:RFID_DETECTION"]}`);
        }
    });
});

client.on('message', (topic, message) => {
    if (topic === PUBLISH_TOPIC["SENSOR:CHANGE_STATUS"]) {
        return handleChangeStatus(message).then(() => {
            console.log(`Mensaje procesado para el tópico ${PUBLISH_TOPIC["SENSOR:CHANGE_STATUS"]}`);
        }).catch((err) => {
            console.error(`Error al procesar el mensaje del tópico ${PUBLISH_TOPIC["SENSOR:CHANGE_STATUS"]}:`, err);
        });
    }
    if (topic === PUBLISH_TOPIC["SENSOR:RESERVATION"]) {
        return handleReservation(message).then(() => {
            console.log(`Mensaje procesado para el tópico ${PUBLISH_TOPIC["SENSOR:RESERVATION"]}`);
        }).catch((err) => {
            console.error(`Error al procesar el mensaje del tópico ${PUBLISH_TOPIC["SENSOR:RESERVATION"]}:`, err);
        });
    }
    if (topic === PUBLISH_TOPIC["SENSOR:RFID_DETECTION"]) {
        return handleRfidDetection(message).then(() => {
            console.log(`Mensaje procesado para el tópico ${PUBLISH_TOPIC["SENSOR:RFID_DETECTION"]}`);
        }).catch((err) => {
            console.error(`Error al procesar el mensaje del tópico ${PUBLISH_TOPIC["SENSOR:RFID_DETECTION"]}:`, err);
        });
    }
});

client.on('error', (err) => {
    console.error('Error de conexión MQTT:', err);
});