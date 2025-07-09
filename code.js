const fs = require('fs');
const path = require('path');
const readline = require('readline');
const PriorityQueue = require('js-priority-queue');

const TAREAS_FILE = path.join(__dirname, 'tareas.json');

// Clase Tarea
class Tarea {
    constructor(id, descripcion, prioridad = 'normal') {
        this.id = id;
        this.descripcion = descripcion;
        this.prioridad = prioridad;
        this.completada = false;
    }
}

// Clase GestorTareas
class GestorTareas {
    constructor() {
        this.siguienteId = 1;
        this.tareasMap = new Map();

        this.queue = new PriorityQueue({
            comparator: (a, b) => {
                if (a.prioridad === b.prioridad) return a.id - b.id;
                return a.prioridad === 'urgente' ? -1 : 1;
            }
        });

        this.cargarDesdeArchivo();
    }

    guardarEnArchivo() {
        const tareasArray = Array.from(this.tareasMap.values());
        fs.writeFileSync(TAREAS_FILE, JSON.stringify(tareasArray, null, 2));
    }

    cargarDesdeArchivo() {
        if (fs.existsSync(TAREAS_FILE)) {
            const data = fs.readFileSync(TAREAS_FILE, 'utf8');
            const tareas = JSON.parse(data);

            tareas.forEach(t => {
                const tarea = new Tarea(t.id, t.descripcion, t.prioridad);
                tarea.completada = t.completada;
                this.queue.queue(tarea);
                this.tareasMap.set(tarea.id, tarea);
            });

            if (tareas.length > 0) {
                this.siguienteId = Math.max(...tareas.map(t => t.id)) + 1;
            }
        }
    }

    crearTarea(descripcion, prioridad) {
        const tarea = new Tarea(this.siguienteId++, descripcion, prioridad);
        this.queue.queue(tarea);
        this.tareasMap.set(tarea.id, tarea);
        this.guardarEnArchivo();
        console.log("✅ Tarea creada con ID:", tarea.id);
    }

    completarTarea(id) {
        const tarea = this.tareasMap.get(id);
        if (tarea) {
            tarea.completada = true;
            this.guardarEnArchivo();
            console.log("✅ Tarea completada:", tarea.descripcion);
        } else {
            console.log("❌ Tarea no encontrada.");
        }
    }

    eliminarTarea(id) {
        if (!this.tareasMap.has(id)) {
            console.log("❌ Tarea no encontrada.");
            return;
        }

        const nuevaCola = new PriorityQueue({
            comparator: this.queue.comparator
        });

        for (const tarea of this.queue.array) {
            if (tarea.id !== id) {
                nuevaCola.queue(tarea);
            }
        }

        this.queue = nuevaCola;
        this.tareasMap.delete(id);
        this.guardarEnArchivo();
        console.log("🗑️ Tarea eliminada.");
    }

    buscarPorId(id) {
        return this.tareasMap.get(id);
    }

    filtrarPorPrioridad(prioridad) {
        return this.queue.array.filter(t => t.prioridad === prioridad);
    }

    mostrarTareas() {
        if (this.queue.length === 0) {
            console.log("📭 No hay tareas.");
            return;
        }

        console.log("\n📋 Lista de tareas:");
        for (const tarea of this.queue.array) {
            console.log(`#${tarea.id} | ${tarea.descripcion} | Prioridad: ${tarea.prioridad} | Completada: ${tarea.completada ? 'Sí' : 'No'}`);
        }
    }

    obtenerSiguienteTarea() {
        if (this.queue.length === 0) {
            console.log("📭 No hay tareas en la cola.");
            return;
        }

        const tarea = this.queue.dequeue();
        this.tareasMap.delete(tarea.id);
        this.guardarEnArchivo();
        console.log(`🚀 Siguiente tarea: #${tarea.id} - ${tarea.descripcion}`);
    }
}

// CLI Interfaz
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
7. Obtener siguiente tarea (urgente primero)
0. Salir
`);
}

function esperarEntrada() {
    mostrarMenu();
    rl.question("Elige una opción: ", opcion => {
        switch (opcion.trim()) {
            case '1':
                rl.question("Descripción de la tarea: ", desc => {
                    rl.question("Prioridad (urgente/normal): ", prioridad => {
                        const p = prioridad.toLowerCase() === 'urgente' ? 'urgente' : 'normal';
                        gestor.crearTarea(desc.trim(), p);
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
                        console.log("❌ Tarea no encontrada.");
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
            case '7':
                gestor.obtenerSiguienteTarea();
                esperarEntrada();
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

// Iniciar programa
esperarEntrada();
