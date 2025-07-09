class Tarea:
    def __init__(self, id_tarea, descripcion, prioridad):
        self.id_tarea = id_tarea
        self.descripcion = descripcion
        self.prioridad = 0 if prioridad == "urgente" else 1  # 0 es urgente, 1 es normal
        self.estado = "pendiente"

    def completar(self):
        """Marca la tarea como completada."""
        self.estado = "completada"

    def __lt__(self, otra_tarea):
        """Permite comparar tareas por prioridad en la cola."""
        return self.prioridad < otra_tarea.prioridad  # Menor valor es mayor prioridad

    def __repr__(self):
        return f"Tarea(ID: {self.id_tarea}, Descripción: {self.descripcion}, Prioridad: {'Urgente' if self.prioridad == 0 else 'Normal'}, Estado: {self.estado})"
