class Tarea {
    constructor(titulo, descripcion, prioridad = 'normal') {
        this.titulo = titulo;
        this.descripcion = descripcion;
        this.prioridad = prioridad.toLowerCase() === 'urgente' ? 'urgente' : 'normal';
    }
    esUrgente() {
        return this.prioridad === 'urgente';
    }
    toString() {
        return `[${this.prioridad}] ${this.titulo}: ${this.descripcion}`;
    }
}

module.exports = Tarea;