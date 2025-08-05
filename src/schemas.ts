// Tipos para mensajes entre API y Broker
export interface ReservationCreatedMessage {
    rsv_id: string
    usr_id: string
    pks_id: string
    rsv_initial_date: string
    rsv_end_date: string
    rsv_reason: string
    status: string
    user_name: string
    parking_spot_code: string
}

export interface ReservationStatusChangedMessage {
    rsv_id: string
    pks_id: string
    status: string
    action: 'accepted' | 'rejected'
}

// Tipos para mensajes entre Broker y Sensores
export interface SensorReservationNotification {
    type: "reservation_created"
    reservation_id: string
    parking_spot_id: string
    parking_spot_code: string
    user_name: string
    start_date: string
    end_date: string
    reason: string
    status: string
    timestamp: string
}

export interface SensorStatusUpdate {
    type: "reservation_status_changed"
    reservation_id: string
    parking_spot_id: string
    status: string
    action: 'accepted' | 'rejected'
    timestamp: string
}

export interface SensorReserveCommand {
    type: "reserve_spot"
    reservation_id: string
    parking_spot_id: string
    command: "activate_reservation_mode"
    timestamp: string
}

// Tipos para mensajes de sensores (existentes)
export interface SensorChangeStatus {
    // Definir según estructura actual
}

export interface SensorRfidDetection {
    // Definir según estructura actual
}

export interface SensorReservation {
    // Definir según estructura actual
}