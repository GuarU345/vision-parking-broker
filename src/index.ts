import mqtt from "mqtt"
import { PUBLISH_TOPIC, SUBSCRIBE_TOPIC } from "./constants";
import { handleChangeStatus } from "./message/sensor.change_status";
import { handleApiReservationCreated } from "./message/api.reservation_created";
import { handleError } from "./message/error";
import { config } from "dotenv";

config();

const client = mqtt.connect(process.env.MQTT_BROKER_URL ?? "http://localhost", { port: 1883 });

client.on('connect', () => {
    // Suscripciones a tópicos de sensores
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

    // Suscripciones a tópicos del API
    client.subscribe(SUBSCRIBE_TOPIC["API:RESERVATION_CREATED"], (err) => {
        if (err) {
            console.error(`Error al suscribirse al tópico ${SUBSCRIBE_TOPIC["API:RESERVATION_CREATED"]}:`, err);
        } else {
            console.log(`Suscrito al tópico ${SUBSCRIBE_TOPIC["API:RESERVATION_CREATED"]}`);
        }
    });

    client.subscribe(SUBSCRIBE_TOPIC["API:RESERVATION_STATUS_CHANGED"], (err) => {
        if (err) {
            console.error(`Error al suscribirse al tópico ${SUBSCRIBE_TOPIC["API:RESERVATION_STATUS_CHANGED"]}:`, err);
        } else {
            console.log(`Suscrito al tópico ${SUBSCRIBE_TOPIC["API:RESERVATION_STATUS_CHANGED"]}`);
        }
    });
});

client.on('message', (topic, message) => {

    let parsedMessage: unknown = null;

    try {
        console.log(`Mensaje recibido en el tópico ${topic}:`, message.toString());
        parsedMessage = JSON.parse(message.toString());
    } catch (error) {
        console.error("Error al procesar el mensaje:", error);
        return handleError(topic, message)
    }

    if (topic === PUBLISH_TOPIC["SENSOR:CHANGE_STATUS"]) {
        return handleChangeStatus(parsedMessage).then(() => {
            console.log(`Mensaje procesado para el tópico ${PUBLISH_TOPIC["SENSOR:CHANGE_STATUS"]}`);
        }).catch((err) => {
            handleError(topic, parsedMessage)
        });
    }
    if (topic === SUBSCRIBE_TOPIC["API:RESERVATION_CREATED"]) {
        return handleApiReservationCreated(parsedMessage, client).then(() => {
            console.log(`Mensaje procesado para el tópico ${SUBSCRIBE_TOPIC["API:RESERVATION_CREATED"]}`);
        }).catch((err) => {
            console.error(`Error al procesar reserva creada:`, err)
            handleError(topic, parsedMessage)
        });
    }
});

client.on('error', (err) => {
    console.error('Error de conexión MQTT:', err);
});