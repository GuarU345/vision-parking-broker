export async function handleChangeStatus(data: any) {
    const parkingSpotConfig = await getParkingSpotIdByEsp32Id(data.esp32Id)

    const parkingSpot = await getParkingSpotById(parkingSpotConfig.pks_id)

    const { status: currentStatus } = parkingSpot.data
    let spotStatus;

    if (currentStatus.stu_name === "Reservado") {
        spotStatus = await getStatusByTableAndName("parking_spots", "Disponible")
        const statusReservation = await getStatusByTableAndName("reservations", "Finalizada")
        const currentReservation = parkingSpot.reservations.find((resv: any) => resv.status.stu_name === "Realizada")

        const reservationData = {
            stu_id: statusReservation.stu_id,
        }

        await updateReservationStatus(currentReservation.rsv_id, reservationData)
    } else if (currentStatus.stu_name === "Ocupado") {
        spotStatus = await getStatusByTableAndName("parking_spots", "Disponible")
        await updateParkingSpotStatus(parkingSpot.pks_id, data)
    }
    else {
        spotStatus = await getStatusByTableAndName("parking_spots", "Ocupado")
    }

    const spotData = {
        stu_id: spotStatus.stu_id,
    }
    await updateParkingSpotStatus(parkingSpot.pks_id, spotData)
}

const getParkingSpotIdByEsp32Id = async (esp32Id: string) => {
    const resp = await fetch(`${process.env.API_BACKEND_URL}/parking-spots/config/${esp32Id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'api-key-access': process.env.API_KEY_ACCESS || '',
        },
    })
    const data = await resp.json()
    return data
}

const getParkingSpotById = async (parkingSpotId: string) => {
    const resp = await fetch(`${process.env.API_BACKEND_URL}/parking-spots/${parkingSpotId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'api-key-access': process.env.API_KEY_ACCESS || '',
        },
    })
    const data = await resp.json()
    return data
}

const updateParkingSpotStatus = async (parkingSpotId: string, body: any) => {
    const resp = await fetch(`${process.env.API_BACKEND_URL}/parking-spots/${parkingSpotId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'api-key-access': process.env.API_KEY_ACCESS || '',
        },
        body: JSON.stringify(body),
    })
    const data = await resp.json()
    return data
}

const getStatusByTableAndName = async (table: string, statusName: string) => {
    const resp = await fetch(`${process.env.API_BACKEND_URL}/status?table=${table}&statusName=${statusName}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'api-key-access': process.env.API_KEY_ACCESS || '',
        },
    })

    const data = await resp.json()
    return data
}

const updateReservationStatus = async (reservationId: string, body: any) => {
    const resp = await fetch(`${process.env.API_BACKEND_URL}/reservations/${reservationId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'api-key-access': process.env.API_KEY_ACCESS || '',
        },
        body: JSON.stringify(body),
    })
    const data = await resp.json()
    return data
}