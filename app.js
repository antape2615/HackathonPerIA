document.addEventListener("DOMContentLoaded", () => {
    const formTarea = document.getElementById('form-tarea');
    const inputTarea = document.getElementById('tarea-nombre');
    const selectPrioridad = document.getElementById('prioridad');
    const listaTareas = document.getElementById('lista-tareas');

    // Array para almacenar las tareas
    let tareas = [];

    // Función para renderizar las tareas
    function renderTareas() {
        listaTareas.innerHTML = ''; // Limpiar la lista antes de renderizar

        tareas.forEach((tarea, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${tarea.nombre} - <strong>${tarea.prioridad}</strong></span>
                <button onclick="eliminarTarea(${index})">Eliminar</button>
                <button onclick="editarTarea(${index})">Editar</button>
            `;
            listaTareas.appendChild(li);
        });
    }

    // Función para agregar tarea
    formTarea.addEventListener('submit', (e) => {
        e.preventDefault();

        const nuevaTarea = {
            nombre: inputTarea.value,
            prioridad: selectPrioridad.value,
        };

        tareas.push(nuevaTarea); // Agregar tarea al array
        inputTarea.value = ''; // Limpiar campo de entrada
        selectPrioridad.value = 'baja'; // Resetear prioridad a "baja"
        renderTareas(); // Volver a renderizar las tareas
    });

    // Función para eliminar tarea
    window.eliminarTarea = function(index) {
        tareas.splice(index, 1); // Eliminar la tarea por índice
        renderTareas(); // Volver a renderizar las tareas
    };

    // Función para editar tarea
    window.editarTarea = function(index) {
        const tarea = tareas[index];
        const nuevaNombre = prompt("Edita el nombre de la tarea", tarea.nombre);
        const nuevaPrioridad = prompt("Edita la prioridad (baja, media, alta)", tarea.prioridad);

        if (nuevaNombre && nuevaPrioridad) {
            tareas[index] = { nombre: nuevaNombre, prioridad: nuevaPrioridad };
            renderTareas(); // Volver a renderizar las tareas
        }
    };

    renderTareas(); // Inicializar con las tareas existentes
});
