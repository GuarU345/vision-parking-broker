export const PUBLISH_TOPIC = {
    "SENSOR:CHANGE_STATUS": "sensor/change-status",
    "SENSOR:RESERVATION": "sensor/reservation",
    "SENSOR:RFID_DETECTION": "sensor/rfid-detection",
}

export const SUBSCRIBE_TOPIC = {
    "API:RESERVATION_CREATED": "api:reservation_created:broker",
    "API:RESERVATION_STATUS_CHANGED": "api:reservation_status_changed:broker",
}

export const BROKER_TO_SENSOR_TOPIC = {
    "BROKER:RESERVATION_NOTIFICATION": "broker:reservation_notification:sensor",
    "BROKER:STATUS_UPDATE": "broker:status_update:sensor",
}