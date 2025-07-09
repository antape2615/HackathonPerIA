const Tarea = require('./Tarea');
class GestorTareas {
    constructor() {
        this.tareas = [];
    }
    agregarTarea(tarea) {
        this.tareas.push(tarea);
        this.organizarPorPrioridad();
    }

    editarTarea(index, nuevosDatos) {
        if (this.tareas[index]) {
            this.tareas[index].titulo = nuevosDatos.titulo || this.tareas[index].titulo;
            this.tareas[index].descripcion = nuevosDatos.descripcion || this.tareas[index].descripcion;
            if (nuevosDatos.prioridad) {
                this.tareas[index].prioridad = nuevosDatos.prioridad.toLowerCase() === 'urgente' ? 'urgente' : 'normal';
            }
            this.organizarPorPrioridad();
        }
    }

    eliminarTarea(index) {
        if (this.tareas[index]) {
            this.tareas.splice(index, 1);
        }
    }

    organizarPorPrioridad() {
        this.tareas.sort((a, b) => {
            if (a.prioridad === b.prioridad) return 0;
            return a.prioridad === 'urgente' ? -1 : 1;
        });
    }

    listarTareas() {
        return this.tareas;
    }

    listarPorPrioridad(prioridad) {
        return this.tareas.filter(t => t.prioridad === prioridad);
    }

    listarUrgentes() {
        return this.listarPorPrioridad('urgente');
    }

    listarNormales() {
        return this.listarPorPrioridad('normal');
    }
}

module.exports = GestorTareas;