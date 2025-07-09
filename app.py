import os

class Tarea:
    def __init__(self, nombre, prioridad):
        self.nombre = nombre
        self.set_prioridad(prioridad)

    def set_prioridad(self, prioridad):
        if prioridad not in ["urgente", "normal"]:
            raise ValueError("La prioridad debe ser 'urgente' o 'normal'.")
        self.prioridad = prioridad

    def __str__(self):
        return f"{self.nombre} ({self.prioridad})"

class GestorTareas:
    def __init__(self):
        self.tareas = []

    def agregar_tarea(self, tarea):
        self.tareas.append(tarea)

    def obtener_tareas_prioritizadas(self):
        return sorted(self.tareas, key=lambda t: 0 if t.prioridad == "urgente" else 1)

    def guardar_tareas(self, nombre_archivo):
        tareas_ordenadas = self.obtener_tareas_prioritizadas()
        
        # Genero contenido en el txt
        contenido = "Registro de Tareas\n\n"
        contenido += "Tareas Urgentes:\n"
        
        # Gestiono las tareas urgentes
        contador = 1
        for tarea in tareas_ordenadas:
            if tarea.prioridad == "urgente":
                contenido += f"{contador}. {tarea.nombre}\n"
                contador += 1
        
        contenido += "\nTareas Normales:\n"
        
        # Gestiono las tareas normales
        for tarea in tareas_ordenadas:
            if tarea.prioridad == "normal":
                contenido += f"{contador}. {tarea.nombre}\n"
                contador += 1

        desktop_path = os.path.join(os.path.expanduser("~"), "Desktop")
        ruta_archivo = os.path.join(desktop_path, f"{nombre_archivo}.txt")

        with open(ruta_archivo, 'w') as file:
            file.write(contenido)

        print(f"Archivo creado en: {ruta_archivo}")

# Creo la aplicacion para ejecutar, esto se ejecuta con python app.py y le damos un nombre al archivo
if __name__ == "__main__":
    gestor = GestorTareas()
    
    # Defino las tareas teniendo en cuenta que pueden llegar en un json por medio de apis como flask o FastApi
    tareas_data = [
        ("Crear Front-end para login", "urgente"),
        ("Crear MER del proyecto", "normal"),
        ("Crear endpoint para ingreso de rutas", "urgente"),
        ("Hacer pruebas", "normal"),
        ("Crear relaciones base de datos", "urgente")
    ]

    # Agrego tareas al gestor
    for nombre, prioridad in tareas_data:
        tarea = Tarea(nombre, prioridad)
        gestor.agregar_tarea(tarea)

    # Solicito el nombre de un archivo para guardar
    nombre_archivo = input("Ingresa el nombre del archivo (sin extensión): ")
    gestor.guardar_tareas(nombre_archivo)
