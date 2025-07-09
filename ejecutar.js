// ejecutar.js
const { Tarea, GestorTareas } = require('HackathonPerIA-feature-Kevin1016592721/gestort.js');

const gestor = new GestorTareas();

gestor.crearTarea("Estudiar JavaScript", "urgente");
gestor.crearTarea("Sacar al perro", "normal");
gestor.crearTarea("Enviar CV", "urgente");

gestor.mostrarTareas();

const urgentes = gestor.filtrarPorPrioridad("urgente");
console.log("👉 Tareas urgentes:", urgentes);
