export async function handleChangeStatus(data: any) {
    const parkingSpotConfig = await getParkingSpotIdByEsp32Id(data.esp32Id)

    const parkingSpot = await getParkingSpotById(parkingSpotConfig.pks_id)

    const { status: currentStatus } = parkingSpot

    if (currentStatus.stu_name === "Reservado" || currentStatus.stu_name === "Ocupado") {
        const newStatus = await getStatusByTableAndName("parking_spots", "Disponible")

        const data = {
            stu_id: newStatus.stu_id,
        }
        await updateParkingSpotStatus(parkingSpot.pks_id, data)
    } else {
        const newStatus = await getStatusByTableAndName("parking_spots", "Ocupado")

        const data = {
            stu_id: newStatus.stu_id,
        }
        await updateParkingSpotStatus(parkingSpot.pks_id, data)
    }
}

const getParkingSpotIdByEsp32Id = async (esp32Id: string) => {
    const resp = await fetch(`${process.env.API_BACKEND_URL}/parking-spots/config/${esp32Id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
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
        },
    })

    const data = await resp.json()
    return data
}