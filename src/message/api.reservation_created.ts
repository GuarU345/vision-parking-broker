import mqtt from "mqtt"
import { BROKER_TO_SENSOR_TOPIC } from "../constants"

interface ReservationCreatedMessage {
    rsv_id: string
    usr_id: string
    pks_id: string
    status: string
    tagIdentifier: string
    esp32_id: string
}

export async function handleApiReservationCreated(data: unknown, client: mqtt.MqttClient) {
    try {
        console.log("Manejando reserva creada desde API:", data);

        const reservationData = data as ReservationCreatedMessage

        // Validar que tenemos los datos necesarios
        if (!reservationData.rsv_id || !reservationData.pks_id) {
            console.error("Datos de reserva incompletos:", reservationData)
            return
        }

        // Crear mensaje para enviar al sensor
        const sensorMessage = {
            type: "reservation_created",
            reservation_id: reservationData.rsv_id,
            parking_spot_id: reservationData.pks_id,
            tagIdentifier: reservationData.tagIdentifier,
            esp32_id: reservationData.esp32_id,
            status: reservationData.status,
            timestamp: new Date().toISOString()
        }

        // Publicar al sensor específico del parking spot
        const sensorTopic = `${BROKER_TO_SENSOR_TOPIC["BROKER:RESERVATION_NOTIFICATION"]}/${reservationData.pks_id}`

        client.publish(sensorTopic, JSON.stringify(sensorMessage), { qos: 1 }, (err) => {
            if (err) {
                console.error(`Error al publicar al sensor ${sensorTopic}:`, err)
            } else {
                console.log(`Notificación de reserva enviada al sensor ${reservationData.pks_id}:`, sensorMessage)
            }
        })

        // También publicar al tópico general de reservas
        client.publish(BROKER_TO_SENSOR_TOPIC["BROKER:RESERVATION_NOTIFICATION"], JSON.stringify(sensorMessage), { qos: 1 }, (err) => {
            if (err) {
                console.error(`Error al publicar al tópico general de reservas:`, err)
            } else {
                console.log(`Notificación de reserva enviada al tópico general:`, sensorMessage)
            }
        })

    } catch (error) {
        console.error("Error al procesar reserva creada:", error)
    }
}
