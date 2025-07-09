class Tarea:
    def __init__(self, id_tarea, descripcion, prioridad="normal"):
        self.id_tarea = id_tarea
        self.descripcion = descripcion
        self.prioridad = prioridad
        self.completada = False
    
    def marcar_completada(self):
        """Marca la tarea como completada"""
        self.completada = True
    
    def __repr__(self):
        """Representación de la tarea"""
        return f"Tarea(ID: {self.id_tarea}, Descripción: '{self.descripcion}', Prioridad: {self.prioridad}, Completada: {self.completada})"


class GestorTareas:
    def __init__(self):
        """Inicializa el gestor de tareas"""
        self.tareas = []
        self.contador_id = 1  # Para asignar IDs únicos a cada tarea
    
    def crear_tarea(self, descripcion, prioridad="normal"):
        """Crear una nueva tarea"""
        nueva_tarea = Tarea(self.contador_id, descripcion, prioridad)
        self.tareas.append(nueva_tarea)
        self.contador_id += 1
        print(f"Tarea creada: {nueva_tarea}")
    
    def eliminar_tarea(self, id_tarea):
        """Eliminar una tarea por su ID"""
        tarea_a_eliminar = self.buscar_tarea(id_tarea)
        if tarea_a_eliminar:
            self.tareas.remove(tarea_a_eliminar)
            print(f"Tarea eliminada: {tarea_a_eliminar}")
        else:
            print(f"No se encontró tarea con ID: {id_tarea}")
    
    def marcar_completada(self, id_tarea):
        """Marcar una tarea como completada"""
        tarea = self.buscar_tarea(id_tarea)
        if tarea:
            tarea.marcar_completada()
            print(f"Tarea marcada como completada: {tarea}")
        else:
            print(f"No se encontró tarea con ID: {id_tarea}")
    
    def buscar_tarea(self, id_tarea):
        """Buscar una tarea por su ID"""
        for tarea in self.tareas:
            if tarea.id_tarea == id_tarea:
                return tarea
        return None
    
    def filtrar_por_prioridad(self, prioridad):
        """Filtrar las tareas por prioridad (normal/urgente)"""
        tareas_filtradas = [tarea for tarea in self.tareas if tarea.prioridad == prioridad]
        return tareas_filtradas
    
    def mostrar_tareas(self):
        """Mostrar todas las tareas (ordenadas por prioridad)"""
        tareas_ordenadas = sorted(self.tareas, key=lambda x: x.prioridad == 'normal')
        for tarea in tareas_ordenadas:
            print(tarea)


# Función principal para interactuar con el usuario
def menu():
    gestor = GestorTareas()
    
    while True:
        print("\n--- Gestor de Tareas ---")
        print("1. Crear tarea")
        print("2. Eliminar tarea")
        print("3. Marcar tarea como completada")
        print("4. Filtrar tareas por prioridad")
        print("5. Mostrar todas las tareas")
        print("6. Salir")
        
        opcion = input("Selecciona una opción: ")
        
        if opcion == "1":
            descripcion = input("Descripción de la tarea: ")
            # Validar que la prioridad solo sea "normal" o "urgente"
            while True:
                prioridad = input("Prioridad (normal/urgente): ").lower()
                if prioridad in ["normal", "urgente"]:
                    break
                else:
                    print("Opción de prioridad no válida. Debe ser 'normal' o 'urgente'.")
            gestor.crear_tarea(descripcion, prioridad)
        
        elif opcion == "2":
            try:
                id_tarea = int(input("ID de la tarea a eliminar: "))
                gestor.eliminar_tarea(id_tarea)
            except ValueError:
                print("ID no válido.")
        
        elif opcion == "3":
            try:
                id_tarea = int(input("ID de la tarea a marcar como completada: "))
                gestor.marcar_completada(id_tarea)
            except ValueError:
                print("ID no válido.")
        
        elif opcion == "4":
            prioridad = input("Filtrar por prioridad (normal/urgente): ").lower()
            if prioridad not in ["normal", "urgente"]:
                print("Prioridad no válida.")
            else:
                tareas = gestor.filtrar_por_prioridad(prioridad)
                print(f"Tareas con prioridad {prioridad}:")
                for tarea in tareas:
                    print(tarea)
        
        elif opcion == "5":
            print("Todas las tareas:")
            gestor.mostrar_tareas()
        
        elif opcion == "6":
            print("¡Hasta luego!")
            break
        
        else:
            print("Opción no válida. Intenta de nuevo.")


# Ejecutar el menú
if __name__ == "__main__":
    menu()
