import json

class Tarea:
    def __init__(self, id, descripcion, prioridad):
        self.id = id
        self.descripcion = descripcion
        self.prioridad = prioridad.lower()
        self.completada = False

    def __str__(self):
        estado = "Completada" if self.completada else "Pendiente"
        return f"[{self.id}] {self.descripcion} - {self.prioridad.upper()} - {estado}"

class GestorTareas:
    def __init__(self):
        self.tareas = []
        self.siguiente_id = 1

    def agregar_tarea(self, descripcion, prioridad):
        if prioridad.lower() not in ["urgente", "normal"]:
            print("Prioridad no válida. Debe ser 'urgente' o 'normal'.")
            return
        tarea = Tarea(self.siguiente_id, descripcion, prioridad)
        self.tareas.append(tarea)
        self.siguiente_id += 1
        print("Tarea agregada exitosamente.")

    def listar_tareas(self):
        tareas_urgentes = [t for t in self.tareas if t.prioridad == "urgente"]
        tareas_normales = [t for t in self.tareas if t.prioridad == "normal"]
        for tarea in tareas_urgentes + tareas_normales:
            print(tarea)
        if not self.tareas:
            print("No hay tareas registradas.")

    def completar_tarea(self, id):
        for tarea in self.tareas:
            if tarea.id == id:
                tarea.completada = True
                print("Tarea marcada como completada.")
                return
        print("Tarea no encontrada.")

    def eliminar_tarea(self, id):
        for tarea in self.tareas:
            if tarea.id == id:
                self.tareas.remove(tarea)
                print("Tarea eliminada.")
                return
        print("Tarea no encontrada.")

    def buscar_por_id(self, id):
        for tarea in self.tareas:
            if tarea.id == id:
                print(tarea)
                return
        print("Tarea no encontrada.")

    def filtrar_por_prioridad(self, prioridad):
        if prioridad.lower() not in ["urgente", "normal"]:
            print("Prioridad no válida.")
            return
        filtradas = [t for t in self.tareas if t.prioridad == prioridad.lower()]
        if filtradas:
            for tarea in filtradas:
                print(tarea)
        else:
            print(f"No hay tareas con prioridad '{prioridad}'.")

    def guardar_en_json(self, archivo):
        with open(archivo, "w") as f:
            datos = [
                {
                    "id": t.id,
                    "descripcion": t.descripcion,
                    "prioridad": t.prioridad,
                    "completada": t.completada
                }
                for t in self.tareas
            ]
            json.dump(datos, f)
        print("Tareas guardadas en el archivo JSON.")

    def cargar_desde_json(self, archivo):
        try:
            with open(archivo, "r") as f:
                datos = json.load(f)
                self.tareas = []
                for d in datos:
                    tarea = Tarea(d["id"], d["descripcion"], d["prioridad"])
                    tarea.completada = d["completada"]
                    self.tareas.append(tarea)
                if self.tareas:
                    self.siguiente_id = max(t.id for t in self.tareas) + 1
            print("Tareas cargadas desde JSON.")
        except FileNotFoundError:
            print("Archivo JSON no encontrado. Comenzando sin tareas.")

def menu():
    gestor = GestorTareas()
    gestor.cargar_desde_json("tareas.json")

    while True:
        print("\n--- Menú ---")
        print("1. Crear tarea")
        print("2. Listar tareas")
        print("3. Completar tarea")
        print("4. Eliminar tarea")
        print("5. Buscar por ID")
        print("6. Filtrar por prioridad")
        print("7. Guardar y salir")

        opcion = input("Elige una opción: ")
        if opcion == "1":
            descripcion = input("Descripción de la tarea: ")
            prioridad = input("Prioridad (urgente/normal): ")
            gestor.agregar_tarea(descripcion, prioridad)
        elif opcion == "2":
            gestor.listar_tareas()
        elif opcion == "3":
            try:
                id = int(input("ID de la tarea a completar: "))
                gestor.completar_tarea(id)
            except ValueError:
                print("ID inválido.")
        elif opcion == "4":
            try:
                id = int(input("ID de la tarea a eliminar: "))
                gestor.eliminar_tarea(id)
            except ValueError:
                print("ID inválido.")
        elif opcion == "5":
            try:
                id = int(input("ID de la tarea a buscar: "))
                gestor.buscar_por_id(id)
            except ValueError:
                print("ID inválido.")
        elif opcion == "6":
            prioridad = input("Filtrar por prioridad (urgente/normal): ")
            gestor.filtrar_por_prioridad(prioridad)
        elif opcion == "7":
            gestor.guardar_en_json("tareas.json")
            print("¡Hasta luego!")
            break
        else:
            print("Opción no válida.")

if __name__ == "__main__":
    menu()