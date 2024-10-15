import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });

let horaSimulada = 6; // Inicia la simulación a las 6:00 AM
let fechaSimulada = new Date('2024-01-01');// Inicia la simulación con la fecha actual
let intervalId = null;

// Historial de datos por estación
const historialEstaciones = {
  'La Cisterna': [],
  'San Ramón': [],
  'Santa Rosa': [],
  'La Granja': [],
  'Santa Julia': [],
  'Vicuña Mackenna': []
};

// Flujo promedio diario por estación
const flujoDiarioPromedio = {
  'La Cisterna': 1000000,
  'San Ramón': 400000,
  'Santa Rosa': 800000,
  'La Granja': 400000,
  'Santa Julia': 400000,
  'Vicuña Mackenna': 1400000
};

// Umbrales de alerta por estación
const umbralAlertaEstacion = {
  'La Cisterna': 70000,
  'San Ramón': 30000,
  'Santa Rosa': 60000,
  'La Granja': 30000,
  'Santa Julia': 30000,
  'Vicuña Mackenna': 100000
};

// Factores de flujo base por hora (0-23)
const factoresFlujoHorarioBase = [
  0.01, 0.01, 0.01, 0.01, 0.01, 0.05,
  0.1, 0.3, 0.5, 0.3, 0.2, 0.15,
  0.2, 0.2, 0.15, 0.2, 0.3, 0.5,
  0.4, 0.3, 0.2, 0.1, 0.05, 0.02
];

// Características únicas por estación
const caracteristicasEstaciones = {
  'La Cisterna': { factorManana: 1.2, factorTarde: 1.3, horasPico: [7, 8, 17, 18] },
  'San Ramón': { factorManana: 1.5, factorTarde: 1.1, horasPico: [6, 7, 18, 19] },
  'Santa Rosa': { factorManana: 1.3, factorTarde: 1.4, horasPico: [7, 8, 17, 18] },
  'La Granja': { factorManana: 1.4, factorTarde: 1.2, horasPico: [7, 8, 18, 19] },
  'Santa Julia': { factorManana: 1.2, factorTarde: 1.5, horasPico: [8, 9, 17, 18] },
  'Vicuña Mackenna': { factorManana: 1.1, factorTarde: 1.6, horasPico: [8, 9, 18, 19] }
};

// Generar datos de pasajeros simulados
function generarPasajerosSimulados(hora) {
  return Object.entries(flujoDiarioPromedio).map(([estacion, flujoDiario]) => {
    const caracteristicas = caracteristicasEstaciones[estacion];
    let factorHora = factoresFlujoHorarioBase[hora];

    // Aplicar factores específicos de la estación
    if (hora >= 6 && hora <= 9) {
      factorHora *= caracteristicas.factorManana;
    } else if (hora >= 16 && hora <= 19) {
      factorHora *= caracteristicas.factorTarde;
    }

    // Aumentar el factor en las horas pico específicas de la estación
    if (caracteristicas.horasPico.includes(hora)) {
      factorHora *= 1.5;
    }

    const flujoHorarioBase = flujoDiario * factorHora / factoresFlujoHorarioBase.reduce((a, b) => a + b, 0);
    
    // Añadir variación aleatoria
    const variacion = 1 + (Math.random() * 0.3 - 0.15); // ±15% de variación
    const pasajeros = Math.round(flujoHorarioBase * variacion);

    return {
      nombre: estacion,
      pasajeros: pasajeros
    };
  });
}

// Actualizar historial de estaciones
function actualizarHistorial(datos) {
  datos.forEach(({ nombre, pasajeros }) => {
    if (historialEstaciones[nombre].length >= 24) {
      historialEstaciones[nombre].shift(); // Mantener solo las últimas 24 horas
    }
    historialEstaciones[nombre].push(pasajeros);
  });
}

// Calcular el total de pasajeros para la línea 4A
function calcularTotalLinea4A(datos) {
  return datos.reduce((total, estacion) => total + estacion.pasajeros, 0);
}

function enviarDatos(ws) {
  const datosSimulados = generarPasajerosSimulados(horaSimulada);
  actualizarHistorial(datosSimulados);

  const totalLinea4A = calcularTotalLinea4A(datosSimulados);
  
  const alertas = [];
  
  datosSimulados.forEach(estacion => {
    if (estacion.pasajeros > umbralAlertaEstacion[estacion.nombre]) {
      alertas.push(`Alta congestión en ${estacion.nombre}: ${estacion.pasajeros} pasajeros`);
    }
  });

  if (totalLinea4A > 800000) {
    alertas.push(`Alerta general: Más de 800,000 pasajeros en la Línea 4A (${totalLinea4A} pasajeros)`);
  }

  const datosConHistorial = datosSimulados.map(estacion => ({
    nombre: estacion.nombre,
    pasajeros: estacion.pasajeros,
    historial: historialEstaciones[estacion.nombre]
      .map((pasajeros, index) => ({
        hour: horaSimulada - historialEstaciones[estacion.nombre].length + index + 1,
        passengers: pasajeros
      }))
      .filter(dato => dato.hour >= 6 && dato.hour <= 23)
  }));

  ws.send(JSON.stringify({
    fecha: fechaSimulada.toISOString().split('T')[0],
    hora: horaSimulada,
    estaciones: datosConHistorial,
    totalLinea4A: totalLinea4A,
    alertas: alertas
  }));
}

function iniciarSimulacion(ws) {
  if (intervalId) clearInterval(intervalId);
  
  horaSimulada = 6;
  
  Object.keys(historialEstaciones).forEach(estacion => {
    historialEstaciones[estacion] = [];
  });
  
  enviarDatos(ws);
  
  intervalId = setInterval(() => {
    horaSimulada = (horaSimulada + 1) % 24;
    if (horaSimulada === 0) {
      fechaSimulada.setDate(fechaSimulada.getDate() + 1);
    }
    if (horaSimulada >= 6 && horaSimulada <= 23) {
      enviarDatos(ws);
    }
  }, 5000);
}

function detenerSimulacion() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
  horaSimulada = 6; // Reiniciar la hora
  Object.keys(historialEstaciones).forEach(estacion => {
    historialEstaciones[estacion] = [];
  });
}

// Iniciar la simulación automáticamente cuando se conecta un cliente
wss.on('connection', (ws) => {
  console.log('Cliente conectado al WebSocket');

  ws.on('message', (message) => {
    const comando = message.toString();
    if (comando === 'iniciar') {
      iniciarSimulacion(ws);
    } else if (comando === 'detener') {
      detenerSimulacion();
    }
  });

  ws.on('close', () => {
    detenerSimulacion();
  });

  ws.on('error', (error) => {
    console.error('Error en WebSocket:', error);
    detenerSimulacion();
  });
});

console.log('Servidor WebSocket funcionando en ws://localhost:8080');