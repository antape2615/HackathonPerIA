const gestor = new GestorTareas();

gestor.crearTarea("Hacer compras", "normal");
gestor.crearTarea("Enviar correo urgente", "urgente");
gestor.crearTarea("Revisar código", "normal");

gestor.mostrarTareas();

const tareaUrgente = gestor.filtrarPorPrioridad("urgente");
console.log("Tareas urgentes:", tareaUrgente);

const tarea = gestor.buscarPorId(tareaUrgente[0].id);
console.log("Tarea buscada:", tarea);

gestor.completarTarea(tarea.id);
gestor.mostrarTareas();
