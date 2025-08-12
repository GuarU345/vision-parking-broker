export async function handleChangeStatus(data: any) {
    const parkingSpotConfig = await getParkingSpotIdByEsp32Id(data.esp32Id)

    const parkingSpot = await getParkingSpotById(parkingSpotConfig.pks_id)

    const assignedTag = await getUserByAssignedTag(data.tagIdentifier)

    const spotAssignment = await getActiveSpotAssignment(parkingSpot.pks_id)

    const { status: currentStatus } = parkingSpot.data
    let spotStatus;
    let isAssign = false

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
    }
    else {
        spotStatus = await getStatusByTableAndName("parking_spots", "Ocupado")
        isAssign = true
    }

    const spotData = {
        stu_id: spotStatus.stu_id,
    }
    await updateParkingSpotStatus(parkingSpot.data.pks_id, spotData)

    if (isAssign) {
        await assignSpotToUser(assignedTag.data.usr_id, parkingSpot.data.pks_id)
    } else {
        await unassignSpotFromUser(spotAssignment.data.spa_id)
    }
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

const getUserByAssignedTag = async (tag: string) => {
    const resp = await fetch(`${process.env.API_BACKEND_URL}/rfid-assignments?rfidTag=${tag}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'api-key-access': process.env.API_KEY_ACCESS || '',
        },
    })
    const data = await resp.json()
    return data
}

const assignSpotToUser = async (userId: string, parkingSpotId: string) => {
    const resp = await fetch(`${process.env.API_BACKEND_URL}/spot-assignments`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'api-key-access': process.env.API_KEY_ACCESS || '',
        },
        body: JSON.stringify(
            {
                pks_id: parkingSpotId,
                usr_id: userId
            }
        ),
    })
    const data = await resp.json()
    return data
}

const unassignSpotFromUser = async (spotAssignmentId: string) => {
    const resp = await fetch(`${process.env.API_BACKEND_URL}/spot-assignments/${spotAssignmentId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'api-key-access': process.env.API_KEY_ACCESS || '',
        }
    })
    const data = await resp.json()
    return data
}

const getActiveSpotAssignment = async (parkingSpotId: string) => {
    const resp = await fetch(`${process.env.API_BACKEND_URL}/parking-spots/${parkingSpotId}/spot-assignments`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'api-key-access': process.env.API_KEY_ACCESS || '',
        },
    })
    const data = await resp.json()
    return data
}