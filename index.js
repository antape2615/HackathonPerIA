class Tarea {
  constructor(id, nombre, descripcion, prioridad) {
    this.id = id;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.prioridad = prioridad;  // "urgente" o "normal"
    this.completada = false;  // Estado de la tarea
  }

  completar() {
    this.completada = true;
  }

  eliminar() {
    // Se puede agregar lógica para eliminar la tarea si fuera necesario
    console.log(`Tarea "${this.nombre}" eliminada.`);
  }
}

class GestorTareas {
  constructor() {
    this.tareas = [];  // Lista de tareas
    this.idCounter = 1; // Contador para asignar un ID único
  }

  agregarTarea(nombre, descripcion, prioridad) {
    if (prioridad !== "urgente" && prioridad !== "normal") {
      console.log("Error: La prioridad solo puede ser 'urgente' o 'normal'.");
      return;
    }

    const nuevaTarea = new Tarea(this.idCounter++, nombre, descripcion, prioridad);
    this.tareas.push(nuevaTarea);
    console.log(`Tarea '${nombre}' agregada.`);
  }

  eliminarTarea(id) {
    const tareaIndex = this.tareas.findIndex(tarea => tarea.id === id);
    if (tareaIndex !== -1) {
      const tarea = this.tareas.splice(tareaIndex, 1)[0];
      tarea.eliminar();
    } else {
      console.log(`Error: No se encontró una tarea con el ID ${id}.`);
    }
  }

  completarTarea(id) {
    const tarea = this.tareas.find(tarea => tarea.id === id);
    if (tarea) {
      tarea.completar();
      console.log(`Tarea '${tarea.nombre}' completada.`);
    } else {
      console.log(`Error: No se encontró una tarea con el ID ${id}.`);
    }
  }

  buscarTareaPorID(id) {
    const tarea = this.tareas.find(tarea => tarea.id === id);
    if (tarea) {
      console.log(`Tarea encontrada: ID: ${tarea.id}, Nombre: ${tarea.nombre}, Prioridad: ${tarea.prioridad}, Completada: ${tarea.completada}`);
    } else {
      console.log(`Error: No se encontró una tarea con el ID ${id}.`);
    }
  }

  filtrarTareasPorPrioridad(prioridad) {
    const tareasFiltradas = this.tareas.filter(tarea => tarea.prioridad === prioridad);
    console.log(`Tareas ${prioridad}:`);
    tareasFiltradas.forEach(tarea => {
      console.log(`ID: ${tarea.id}, Nombre: ${tarea.nombre}, Completada: ${tarea.completada}`);
    });
  }

  mostrarTareas() {
    if (this.tareas.length === 0) {
      console.log("No hay tareas.");
    } else {
      console.log("Tareas:");
      this.tareas.forEach(tarea => {
        console.log(`ID: ${tarea.id}, Nombre: ${tarea.nombre}, Prioridad: ${tarea.prioridad}, Completada: ${tarea.completada}`);
      });
    }
  }

  // Método para ordenar las tareas con base en la prioridad
  ordenarPorPrioridad() {
    // Urgentes primero
    this.tareas.sort((a, b) => {
      if (a.prioridad === 'urgente' && b.prioridad !== 'urgente') return -1;
      if (a.prioridad !== 'urgente' && b.prioridad === 'urgente') return 1;
      return 0;
    });
  }
}

// Crear una instancia del gestor de tareas
const gestor = new GestorTareas();

// Simulando operaciones
gestor.agregarTarea("Comprar leche", "Comprar leche en el supermercado", "normal");
gestor.agregarTarea("Estudiar programación", "Estudiar POO en JavaScript", "urgente");
gestor.agregarTarea("Llamar al doctor", "Pedir cita médica", "normal");

// Mostrar tareas sin orden
gestor.mostrarTareas();

// Filtrar por prioridad
gestor.filtrarTareasPorPrioridad("normal");

// Completar tarea
gestor.completarTarea(2);

// Mostrar tareas ordenadas por prioridad
gestor.ordenarPorPrioridad();
gestor.mostrarTareas();

// Buscar tarea por ID
gestor.buscarTareaPorID(1);

// Eliminar tarea
gestor.eliminarTarea(1);

// Mostrar tareas finales
gestor.mostrarTareas();
