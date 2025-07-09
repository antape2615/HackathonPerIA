class Tarea {
  constructor(id, descripcion, prioridad = 'normal') {
    const prioridadesValidas = ['urgente', 'normal'];
    if (!prioridadesValidas.includes(prioridad)) {
      throw new Error("Prioridad inválida. Debe ser 'urgente' o 'normal'.");
    }

    this.id = id;
    this.descripcion = descripcion;
    this.prioridad = prioridad;
    this.completada = false;
  }

  completar() {
    this.completada = true;
  }
}


class GestorTareas {
  constructor() {
    this.tareas = [];
  }

  crearTarea(descripcion, prioridad = 'normal') {
    const id = Date.now();
    const nueva = new Tarea(id, descripcion, prioridad);
    this.tareas.push(nueva);
    this.ordenarPorPrioridad();
    return nueva;
  }

  eliminarTarea(id) {
    this.tareas = this.tareas.filter(t => t.id !== id);
  }

  completarTarea(id) {
    const tarea = this.buscarPorId(id);
    if (tarea) tarea.completar();
  }

  buscarPorId(id) {
    return this.tareas.find(t => t.id === id);
  }

  filtrarPorPrioridad(prioridad) {
    return this.tareas.filter(t => t.prioridad === prioridad);
  }

  ordenarPorPrioridad() {
    this.tareas.sort((a, b) => {
      if (a.prioridad === 'urgente' && b.prioridad !== 'urgente') return -1;
      if (a.prioridad !== 'urgente' && b.prioridad === 'urgente') return 1;
      return 0;
    });
  }

  mostrarTareas() {
    console.log("=== Lista de Tareas ===");
    this.tareas.forEach(t => {
      console.log(`[${t.completada ? "✔" : " "}] (${t.prioridad.toUpperCase()}) ${t.descripcion} [ID: ${t.id}]`);
    });
  }
}
