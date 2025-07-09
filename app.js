const Tarea = require('./Tarea');
const GestorTareas = require('./GestorTareas');
const readline = require('readline');
const gestor = new GestorTareas();

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
function mostrarMenu() {
    console.log('¡ Sistema de Gestión de Tareas !');
    console.log('1. Crear tarea');
    console.log('2. Listar tareas');
    console.log('3. Editar tarea');
    console.log('4. Eliminar tarea');
    console.log('5. Salir');
    rl.question('Elige una opción: ', manejarOpcion);
}

function manejarOpcion(opcion) {
    switch(opcion.trim()) {
        case '1':
            crearTarea();
            break;
        case '2':
            listarTareas();
            mostrarMenu();
            break;
        case '3':
            editarTarea();
            break;
        case '4':
            eliminarTarea();
            break;
        default:
            mostrarMenu();
    }
}
function crearTarea() {
    rl.question('Título: ', (titulo) => {
        rl.question('Descripción: ', (descripcion) => {
            rl.question('Prioridad (urgente/normal): ', (prioridad) => {
                const tarea = new Tarea(titulo, descripcion, prioridad);
                gestor.agregarTarea(tarea);
                mostrarMenu();
            });
        });
    });
}
function listarTareas() {
    if (gestor.listarTareas().length === 0) {
        console.log('No hhas creado tareas aún.');
    } else {
        gestor.listarTareas().forEach((t, i) => console.log(`${i}: ${t.toString()}`));
    }
}

function editarTarea() {
    listarTareas();
    rl.question('Índice de la tarea a editar: ', (idx) => {
        const index = parseInt(idx);
        if (isNaN(index) || !gestor.listarTareas()[index]) {
            console.log('Índice no válido.');
            mostrarMenu();
            return;
        }
        rl.question('Nuevo título', (titulo) => {
            rl.question('Nueva descripción', (descripcion) => {
                rl.question('Nueva prioridad', (prioridad) => {
                    gestor.editarTarea(index, { titulo, descripcion, prioridad });
                    console.log('Tarea editada.');
                    mostrarMenu();
                });
            });
        });
    });
}

function eliminarTarea() {
    listarTareas();
    rl.question('Índice de la tarea a eliminar: ', (idx) => {
        const index = parseInt(idx);
        if (isNaN(index) || !gestor.listarTareas()[index]) {
            console.log('Índice no válido.');
        } else {
            gestor.eliminarTarea(index);
            console.log('Tarea eliminada.');
        }
        mostrarMenu();
    });
}

mostrarMenu();
