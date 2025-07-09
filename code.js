const fs = require('fs');
const path = require('path');
const readline = require('readline');

const TAREAS_FILE = path.join(__dirname, 'tareas.json');

class Tarea {
  constructor(id, descripcion, prioridad = 'normal') {
    this.id = id;
    this.descripcion = descripcion;
    this.prioridad = prioridad;
    this.completada = false;
  }
}

class GestorTareas {
  constructor() {
    this.siguienteId = 1;
    this.tareasMap = new Map();
    this.cargarDesdeArchivo();
  }

  validarPrioridad(prioridad) {
    const prioridadesValidas = ['urgente', 'normal'];
    if (!prioridadesValidas.includes(prioridad)) {
      throw new Error(`Prioridad inválida. Solo puede ser: ${prioridadesValidas.join(', ')}`);
    }
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
        this.tareasMap.set(tarea.id, tarea);
      });
      if (tareas.length > 0) {
        this.siguienteId = Math.max(...tareas.map(t => t.id)) + 1;
      }
    }
  }

  crearTarea(descripcion, prioridad) {
    try {
      this.validarPrioridad(prioridad);
    } catch (error) {
      console.log('Error:', error.message);
      return;
    }
    const tarea = new Tarea(this.siguienteId++, descripcion, prioridad);
    this.tareasMap.set(tarea.id, tarea);
    this.guardarEnArchivo();
    console.log("Tarea creada con ID:", tarea.id);
  }

  completarTarea(id) {
    const tarea = this.tareasMap.get(id);
    if (tarea) {
      tarea.completada = true;
      this.guardarEnArchivo();
      console.log("Tarea completada:", tarea.descripcion);
    } else {
      console.log("Tarea no encontrada.");
    }
  }

  eliminarTarea(id) {
    if (this.tareasMap.delete(id)) {
      this.guardarEnArchivo();
      console.log("Tarea eliminada.");
    } else {
      console.log("Tarea no encontrada.");
    }
  }

  mostrarTareas() {
    if (this.tareasMap.size === 0) {
      console.log("No hay tareas.");
      return;
    }
    console.log("\nLista de tareas:");
    for (const tarea of this.tareasMap.values()) {
      console.log(`#${tarea.id} | ${tarea.descripcion} | Prioridad: ${tarea.prioridad} | Completada: ${tarea.completada ? 'Sí' : 'No'}`);
    }
  }

  buscarPorId(id) {
    return this.tareasMap.get(id);
  }

  filtrarPorPrioridad(prioridad) {
    return Array.from(this.tareasMap.values()).filter(t => t.prioridad === prioridad);
  }
}

const gestor = new GestorTareas();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function menu() {
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
  rl.question('Elige una opción: ', opcion => {
    switch(opcion.trim()) {
      case '1':
        crearTareaPrompt();
        break;
      case '2':
        completarTareaPrompt();
        break;
      case '3':
        eliminarTareaPrompt();
        break;
      case '4':
        gestor.mostrarTareas();
        menu();
        break;
      case '5':
        buscarTareaPrompt();
        break;
      case '6':
        filtrarPrioridadPrompt();
        break;
      case '0':
        console.log('¡Hasta luego!');
        rl.close();
        break;
      default:
        console.log('Opción inválida.');
        menu();
    }
  });
}

function crearTareaPrompt() {
  rl.question('Descripción de la tarea: ', desc => {
    rl.question('Prioridad ("urgente" o "normal"): ', prioridad => {
      gestor.crearTarea(desc.trim(), prioridad.trim().toLowerCase());
      menu();
    });
  });
}

function completarTareaPrompt() {
  rl.question('ID de la tarea a completar: ', id => {
    const idNum = Number(id);
    if (isNaN(idNum)) {
      console.log('ID inválido.');
      return menu();
    }
    gestor.completarTarea(idNum);
    menu();
  });
}

function eliminarTareaPrompt() {
  rl.question('ID de la tarea a eliminar: ', id => {
    const idNum = Number(id);
    if (isNaN(idNum)) {
      console.log('ID inválido.');
      return menu();
    }
    gestor.eliminarTarea(idNum);
    menu();
  });
}

function buscarTareaPrompt() {
  rl.question('ID de la tarea a buscar: ', id => {
    const idNum = Number(id);
    if (isNaN(idNum)) {
      console.log('ID inválido.');
      return menu();
    }
    const tarea = gestor.buscarPorId(idNum);
    if (tarea) {
      console.log(`#${tarea.id} | ${tarea.descripcion} | Prioridad: ${tarea.prioridad} | Completada: ${tarea.completada ? 'Sí' : 'No'}`);
    } else {
      console.log('Tarea no encontrada.');
    }
    menu();
  });
}

function filtrarPrioridadPrompt() {
  rl.question('Filtrar por prioridad ("urgente" o "normal"): ', prioridad => {
    const p = prioridad.trim().toLowerCase();
    if (p !== 'urgente' && p !== 'normal') {
      console.log('Prioridad inválida.');
      return menu();
    }
    const tareas = gestor.filtrarPorPrioridad(p);
    if (tareas.length === 0) {
      console.log(`No hay tareas con prioridad "${p}".`);
    } else {
      console.log(`Tareas con prioridad "${p}":`);
      tareas.forEach(t => {
        console.log(`#${t.id} | ${t.descripcion} | Completada: ${t.completada ? 'Sí' : 'No'}`);
      });
    }
    menu();
  });
}

// Inicia la app
menu();
