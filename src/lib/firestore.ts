import { getFirestore, doc, setDoc, collection, updateDoc, increment, getDoc } from "firebase/firestore"; 
import { app } from "./firebaseConfig";

const db = getFirestore(app);

interface Alarm {
    time: string;
    type: string;
    location: string;
}

interface StationData {
    passengers: number;
    alarms: Alarm[];
}

interface LineData {
    totalPassengers: number;
    alarms: Alarm[];
}

export const saveStationData = async (station: string, date: string, hour: string, data: StationData) => {
    try {
        const stationDocRef = doc(db, "stations", station, "dates", date, "hours", hour);
        await setDoc(stationDocRef, data, { merge: true });

        // Update or create aggregated data
        const aggregatedDocRef = doc(db, "stations", station, "aggregated", date);
        const aggregatedDoc = await getDoc(aggregatedDocRef);

        if (aggregatedDoc.exists()) {
            await updateDoc(aggregatedDocRef, {
                totalPassengers: increment(data.passengers),
                totalAlarms: increment(data.alarms.length)
            });
        } else {
            await setDoc(aggregatedDocRef, {
                totalPassengers: data.passengers,
                totalAlarms: data.alarms.length
            });
        }
    } catch (error) {
        console.error("Error al guardar datos de la estación:", error);
        throw new Error(`No se pudieron guardar los datos de la estación: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
};

export const saveLineData = async (line: string, date: string, hour: string, data: LineData) => {
    try {
        const lineDocRef = doc(db, "lines", line, "dates", date, "hours", hour);
        await setDoc(lineDocRef, data, { merge: true });

        // Update or create aggregated data
        const aggregatedDocRef = doc(db, "lines", line, "aggregated", date);
        const aggregatedDoc = await getDoc(aggregatedDocRef);

        if (aggregatedDoc.exists()) {
            await updateDoc(aggregatedDocRef, {
                totalPassengers: increment(data.totalPassengers),
                totalAlarms: increment(data.alarms.length)
            });
        } else {
            await setDoc(aggregatedDocRef, {
                totalPassengers: data.totalPassengers,
                totalAlarms: data.alarms.length
            });
        }
    } catch (error) {
        console.error("Error al guardar datos de la línea:", error);
        throw new Error(`No se pudieron guardar los datos de la línea: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
};

export const saveAlarmEvent = async (location: string, date: string, hour: string, alarmData: Alarm) => {
    try {
        const alarmDocRef = doc(collection(db, "alarms", date, "hours", hour), alarmData.time);
        await setDoc(alarmDocRef, alarmData);

        // Update or create aggregated alarm data
        const aggregatedAlarmDocRef = doc(db, "alarms", "aggregated", date);
        const aggregatedAlarmDoc = await getDoc(aggregatedAlarmDocRef);

        if (aggregatedAlarmDoc.exists()) {
            await updateDoc(aggregatedAlarmDocRef, {
                totalAlarms: increment(1),
                [`${location}Alarms`]: increment(1)
            });
        } else {
            await setDoc(aggregatedAlarmDocRef, {
                totalAlarms: 1,
                [`${location}Alarms`]: 1
            });
        }
    } catch (error) {
        console.error("Error al guardar evento de alarma:", error);
        throw new Error(`No se pudo guardar el evento de alarma: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
};

export const saveDailySummary = async (date: string, summaryData: { [line: string]: { totalPassengers: number, totalAlarms: number } }) => {
    try {
        const summaryDocRef = doc(db, "daily_summaries", date);
        await setDoc(summaryDocRef, summaryData, { merge: true });
    } catch (error) {
        console.error("Error al guardar resumen diario:", error);
        throw new Error(`No se pudo guardar el resumen diario: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
};