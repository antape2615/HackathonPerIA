from tareas import Tarea  # Importar Tarea desde el archivo tareas.py

import heapq

class GestorTareas:
    def __init__(self):
        self.tareas = []  # Esta lista actuará como un heap
        self.id_contador = 1

    def crear_tarea(self, descripcion, prioridad):
        """Crea una nueva tarea y la añade al heap de prioridad."""
        tarea = Tarea(self.id_contador, descripcion, prioridad)
        heapq.heappush(self.tareas, tarea)  # Añade la tarea al heap
        self.id_contador += 1
        print(f"Tarea creada: {tarea}")

    def completar_tarea(self, id_tarea):
        """Marca una tarea como completada."""
        tarea = self.buscar_tarea(id_tarea)
        if tarea:
            tarea.completar()
            print(f"Tarea completada: {tarea}")
        else:
            print(f"No se encontró la tarea con ID {id_tarea}.")

    def eliminar_tarea(self, id_tarea):
        """Elimina una tarea usando su ID (para la cola de prioridad, este es un poco más complicado)."""
        tarea = self.buscar_tarea(id_tarea)
        if tarea:
            self.tareas.remove(tarea)
            heapq.heapify(self.tareas)  # Reorganiza el heap
            print(f"Tarea eliminada: {tarea}")
        else:
            print(f"No se encontró la tarea con ID {id_tarea}.")

    def buscar_tarea(self, id_tarea):
        """Busca una tarea por su ID."""
        for tarea in self.tareas:
            if tarea.id_tarea == id_tarea:
                return tarea
        return None

    def mostrar_tareas(self):
        """Muestra todas las tareas en la cola de prioridad (de mayor a menor prioridad)."""
        if not self.tareas:
            print("No hay tareas para mostrar.")
        else:
            print("\nTareas en la cola de prioridad:")
            for tarea in self.tareas:
                print(tarea)

    def obtener_tarea_con_mayor_prioridad(self):
        """Devuelve y elimina la tarea con mayor prioridad (la que tiene el valor de prioridad más bajo)."""
        if self.tareas:
            tarea = heapq.heappop(self.tareas)  # Extrae la tarea con la más alta prioridad
            print(f"Tarea con mayor prioridad: {tarea}")
            return tarea
        else:
            print("No hay tareas en la cola.")
            return None

    def filtrar_por_prioridad(self, prioridad):
        """Filtra las tareas por prioridad (urgente o normal)."""
        tareas_filtradas = [t for t in self.tareas if t.prioridad == (0 if prioridad == 'urgente' else 1)]
        return tareas_filtradas

    def obtener_tareas_ordenadas(self):
        """Devuelve las tareas ordenadas por prioridad (de mayor a menor)."""
        return sorted(self.tareas)  # Ordena las tareas por prioridad (urgente primero)
