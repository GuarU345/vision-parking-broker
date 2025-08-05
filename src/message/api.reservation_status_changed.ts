import mqtt from "mqtt"
import { BROKER_TO_SENSOR_TOPIC } from "../constants"

interface ReservationStatusChangedMessage {
    rsv_id: string
    pks_id: string
    status: string
    action: 'accepted' | 'rejected'
}

export async function handleApiReservationStatusChanged(data: unknown, client: mqtt.MqttClient) {
    try {
        console.log("Manejando cambio de estado de reserva desde API:", data);
        
        const statusData = data as ReservationStatusChangedMessage
        
        // Validar que tenemos los datos necesarios
        if (!statusData.rsv_id || !statusData.pks_id) {
            console.error("Datos de cambio de estado incompletos:", statusData)
            return
        }

        // Crear mensaje para enviar al sensor
        const sensorMessage = {
            type: "reservation_status_changed",
            reservation_id: statusData.rsv_id,
            parking_spot_id: statusData.pks_id,
            status: statusData.status,
            action: statusData.action,
            timestamp: new Date().toISOString()
        }

        // Publicar al sensor específico del parking spot
        const sensorTopic = `${BROKER_TO_SENSOR_TOPIC["BROKER:STATUS_UPDATE"]}/${statusData.pks_id}`
        
        client.publish(sensorTopic, JSON.stringify(sensorMessage), { qos: 1 }, (err) => {
            if (err) {
                console.error(`Error al publicar al sensor ${sensorTopic}:`, err)
            } else {
                console.log(`Actualización de estado enviada al sensor ${statusData.pks_id}:`, sensorMessage)
            }
        })

        // También publicar al tópico general de actualizaciones
        client.publish(BROKER_TO_SENSOR_TOPIC["BROKER:STATUS_UPDATE"], JSON.stringify(sensorMessage), { qos: 1 }, (err) => {
            if (err) {
                console.error(`Error al publicar al tópico general de actualizaciones:`, err)
            } else {
                console.log(`Actualización de estado enviada al tópico general:`, sensorMessage)
            }
        })

        // Si la reserva fue aceptada, enviar comando específico para reservar el spot
        if (statusData.action === 'accepted') {
            const reserveCommand = {
                type: "reserve_spot",
                reservation_id: statusData.rsv_id,
                parking_spot_id: statusData.pks_id,
                command: "activate_reservation_mode",
                timestamp: new Date().toISOString()
            }

            const commandTopic = `${BROKER_TO_SENSOR_TOPIC["BROKER:STATUS_UPDATE"]}/${statusData.pks_id}/command`
            
            client.publish(commandTopic, JSON.stringify(reserveCommand), { qos: 1 }, (err) => {
                if (err) {
                    console.error(`Error al enviar comando de reserva:`, err)
                } else {
                    console.log(`Comando de reserva enviado al sensor ${statusData.pks_id}:`, reserveCommand)
                }
            })
        }

    } catch (error) {
        console.error("Error al procesar cambio de estado de reserva:", error)
    }
}
