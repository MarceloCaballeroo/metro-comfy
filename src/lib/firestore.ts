import { getFirestore, doc, setDoc } from "firebase/firestore"; 
import { app } from "./firebaseConfig";

const db = getFirestore(app);

export const saveStationData = async (station: string, data: { passengers: number }) => {
    try {
        await setDoc(doc(db, "stations", station), data, { merge: true });
    } catch (error) {
        console.error("Error al guardar datos de la estación:", error);
        throw new Error("No se pudieron guardar los datos de la estación");
    }
};

export const saveLineData = async (line: string, data: { totalPassengers: number }) => {
    try {
        await setDoc(doc(db, "lines", line), data, { merge: true });
    } catch (error) {
        console.error("Error al guardar datos de la línea:", error);
        throw new Error("No se pudieron guardar los datos de la línea");
    }
};