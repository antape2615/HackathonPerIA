import json

class Tarea:
    def __init__(self, id, descripcion, prioridad="normal"):
        self.id = id
        self.descripcion = descripcion
        self.estado = False  # False significa no completada
        self.prioridad = prioridad

        # Validamos que la prioridad sea válida
        if self.prioridad not in ['normal', 'urgente']:
            raise ValueError("La prioridad debe ser 'normal' o 'urgente'.")

    def __str__(self):
        estado = "Completada" if self.estado else "Pendiente"
        return f"Tarea ID: {self.id} | Descripción: {self.descripcion} | Prioridad: {self.prioridad} | Estado: {estado}"

    def to_dict(self):
        return {
            'id': self.id,
            'descripcion': self.descripcion,
            'estado': self.estado,
            'prioridad': self.prioridad
        }

    @staticmethod
    def from_dict(data):
        return Tarea(data['id'], data['descripcion'], data['prioridad'])

class GestorTareas:
    def __init__(self, archivo_datos="data.json"):
        self.tareas = []
        self.contador_id = 1
        self.archivo_datos = archivo_datos

        # Intentar cargar las tareas desde el archivo
        self.cargar_tareas()

    def cargar_tareas(self):
        try:
            with open(self.archivo_datos, 'r', encoding='utf-8') as file:
                datos = json.load(file)
                self.tareas = [Tarea.from_dict(tarea) for tarea in datos]
                if self.tareas:
                    self.contador_id = max(tarea.id for tarea in self.tareas) + 1
        except (FileNotFoundError, json.JSONDecodeError):
            # Si el archivo no existe o está vacío, iniciamos sin tareas
            self.tareas = []

    def guardar_tareas(self):
        with open(self.archivo_datos, 'w', encoding='utf-8') as file:
            json.dump([tarea.to_dict() for tarea in self.tareas], file, indent=4)

    def crear_tarea(self, descripcion, prioridad="normal"):
        tarea = Tarea(self.contador_id, descripcion, prioridad)
        self.tareas.append(tarea)
        self.contador_id += 1
        self.guardar_tareas()
        print(f"Tarea creada: {tarea}")

    def completar_tarea(self, id_tarea):
        for tarea in self.tareas:
            if tarea.id == id_tarea:
                tarea.estado = True
                self.guardar_tareas()
                print(f"Tarea completada: {tarea}")
                return
        print("Tarea no encontrada.")

    def eliminar_tarea(self, id_tarea):
        for tarea in self.tareas:
            if tarea.id == id_tarea:
                self.tareas.remove(tarea)
                self.guardar_tareas()
                print(f"Tarea eliminada: {tarea}")
                return
        print("Tarea no encontrada.")

    def buscar_tarea_por_id(self, id_tarea):
        for tarea in self.tareas:
            if tarea.id == id_tarea:
                return tarea
        return None

    def filtrar_tareas_por_prioridad(self, prioridad):
        if prioridad not in ['normal', 'urgente']:
            print("Prioridad no válida.")
            return []
        return [tarea for tarea in self.tareas if tarea.prioridad == prioridad]

    def mostrar_tareas(self):
        if not self.tareas:
            print("No hay tareas.")
        for tarea in self.tareas:
            print(tarea)

    def mostrar_tareas_prioritarias(self):
        urgentes = [tarea for tarea in self.tareas if tarea.prioridad == "urgente"]
        normales = [tarea for tarea in self.tareas if tarea.prioridad == "normal"]
        
        print("Tareas Urgentes:")
        for tarea in urgentes:
            print(tarea)
        
        print("\nTareas Normales:")
        for tarea in normales:
            print(tarea)
