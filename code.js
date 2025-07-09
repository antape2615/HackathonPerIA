const readline = require('readline');

// Clase Tarea
class Tarea {
    constructor(id, descripcion, prioridad = 'normal') {
        this.id = id;
        this.descripcion = descripcion;
        this.prioridad = prioridad;
        this.completada = false;
    }
}

// Clase Gestor de Tareas
class GestorTareas {
    constructor() {
        this.tareas = [];
        this.siguienteId = 1;
    }

    crearTarea(descripcion, prioridad) {
        const nuevaTarea = new Tarea(this.siguienteId++, descripcion, prioridad);
        this.tareas.push(nuevaTarea);
        this.ordenarPorPrioridad();
        console.log("✅ Tarea creada con ID:", nuevaTarea.id);
    }

    completarTarea(id) {
        const tarea = this.buscarPorId(id);
        if (tarea) {
            tarea.completada = true;
            console.log("✅ Tarea completada:", tarea.descripcion);
        } else {
            console.log("❌ Tarea no encontrada.");
        }
    }

    eliminarTarea(id) {
        const indice = this.tareas.findIndex(t => t.id === id);
        if (indice !== -1) {
            console.log("🗑️ Tarea eliminada:", this.tareas[indice].descripcion);
            this.tareas.splice(indice, 1);
        } else {
            console.log("❌ Tarea no encontrada.");
        }
    }

    buscarPorId(id) {
        return this.tareas.find(t => t.id === id);
    }

    filtrarPorPrioridad(prioridad) {
        return this.tareas.filter(t => t.prioridad === prioridad);
    }

    ordenarPorPrioridad() {
        this.tareas.sort((a, b) => {
            if (a.prioridad === 'urgente' && b.prioridad === 'normal') return -1;
            if (a.prioridad === 'normal' && b.prioridad === 'urgente') return 1;
            return 0;
        });
    }

    mostrarTareas() {
        if (this.tareas.length === 0) {
            console.log("📭 No hay tareas.");
        } else {
            console.log("\n📋 Lista de tareas:");
            this.tareas.forEach(t => {
                console.log(`#${t.id} | ${t.descripcion} | Prioridad: ${t.prioridad} | Completada: ${t.completada ? 'Sí' : 'No'}`);
            });
        }
    }
}

// Interfaz de consola
const gestor = new GestorTareas();
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function mostrarMenu() {
    console.log(`
--- MENÚ DE TAREAS ---
1. Crear tarea
2. Completar tarea
3. Eliminar tarea
4. Ver todas las tareas
5. Buscar tarea por ID
6. Filtrar por prioridad
0. Salir
`);
}

function esperarEntrada() {
    mostrarMenu();
    rl.question("Elige una opción: ", opcion => {
        switch (opcion) {
            case '1':
                rl.question("Descripción de la tarea: ", desc => {
                    rl.question("Prioridad (urgente/normal): ", prioridad => {
                        gestor.crearTarea(desc, prioridad.toLowerCase() === 'urgente' ? 'urgente' : 'normal');
                        esperarEntrada();
                    });
                });
                break;
            case '2':
                rl.question("ID de la tarea a completar: ", id => {
                    gestor.completarTarea(parseInt(id));
                    esperarEntrada();
                });
                break;
            case '3':
                rl.question("ID de la tarea a eliminar: ", id => {
                    gestor.eliminarTarea(parseInt(id));
                    esperarEntrada();
                });
                break;
            case '4':
                gestor.mostrarTareas();
                esperarEntrada();
                break;
            case '5':
                rl.question("ID de la tarea a buscar: ", id => {
                    const tarea = gestor.buscarPorId(parseInt(id));
                    if (tarea) {
                        console.log(`📌 Tarea encontrada: ${tarea.descripcion} | Prioridad: ${tarea.prioridad} | Completada: ${tarea.completada ? 'Sí' : 'No'}`);
                    } else {
                        console.log("❌ No se encontró la tarea.");
                    }
                    esperarEntrada();
                });
                break;
            case '6':
                rl.question("Filtrar por prioridad (urgente/normal): ", prioridad => {
                    const filtradas = gestor.filtrarPorPrioridad(prioridad.toLowerCase());
                    console.log(`\n🎯 Tareas con prioridad "${prioridad}":`);
                    filtradas.forEach(t => {
                        console.log(`#${t.id} | ${t.descripcion} | Completada: ${t.completada ? 'Sí' : 'No'}`);
                    });
                    esperarEntrada();
                });
                break;
            case '0':
                console.log("👋 ¡Hasta luego!");
                rl.close();
                break;
            default:
                console.log("❗ Opción inválida.");
                esperarEntrada();
        }
    });
}

// Iniciar aplicación
esperarEntrada();
