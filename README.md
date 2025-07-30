# Vision Parking Broker

Un broker MQTT para el sistema de estacionamiento inteligente.

## Desarrollo

### Requisitos
- Node.js 22
- pnpm
- Docker y Docker Compose

### Instalación local
```bash
pnpm install
```

### Ejecutar en desarrollo
```bash
pnpm dev
```

## Docker

### Construir y ejecutar con Docker Compose
```bash
# Construir e iniciar todos los servicios
docker-compose up --build

# Ejecutar en segundo plano
docker-compose up -d --build

# Ver logs
docker-compose logs -f

# Parar los servicios
docker-compose down
```

### Servicios incluidos
- **mosquitto**: Broker MQTT en el puerto 1883
- **vision-parking-broker**: Aplicación Node.js que se conecta al broker MQTT

### Variables de entorno
- `MQTT_BROKER_URL`: URL del broker MQTT (por defecto: `mqtt://mosquitto` en Docker)

## Estructura del proyecto
```
src/
├── constants.ts           # Constantes del proyecto
├── index.ts              # Punto de entrada principal
├── schemas.ts            # Esquemas de validación
└── message/              # Manejadores de mensajes MQTT
    ├── sensor.change_status.ts
    ├── sensor.reservation.ts
    └── sensor.rfid_detection.ts
```
