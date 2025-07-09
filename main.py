class Tarea:
    def __init__(self, id, descripcion, prioridad='normal'):
        self.id = id
        self.descripcion = descripcion
        self.prioridad = prioridad
        self.completada = False

    def __repr__(self):
        estado = "Completada" if self.completada else "Pendiente"
        return f"[{self.id}] {estado} - {self.descripcion} ({self.prioridad})"

class GestorTareas:
    def __init__(self):
        self.tareas = []
        self.proximo_id = 1  # ID numérico creciente

    def agregar_tarea(self, descripcion, prioridad):
        tarea = Tarea(self.proximo_id, descripcion, prioridad)
        self.proximo_id += 1
        self.tareas.append(tarea)
        print(f"\nTarea creada: {tarea}")

    def completar_tarea(self, tarea_id):
        for tarea in self.tareas:
            if tarea.id == tarea_id:
                tarea.completada = True
                print(f"\nTarea completada: {tarea}")
                return
        print("Tarea no encontrada.")

    def eliminar_tarea(self, tarea_id):
        original_len = len(self.tareas)
        self.tareas = [t for t in self.tareas if t.id != tarea_id]
        if len(self.tareas) < original_len:
            print(f"\nTarea {tarea_id} eliminada.")
        else:
            print("Tarea no encontrada.")

    def listar_tareas(self):
        if not self.tareas:
            print("No hay tareas.")
            return
        tareas_ordenadas = sorted(self.tareas, key=lambda t: (t.prioridad != 'urgente', t.completada))
        print("\nTareas:")
        for tarea in tareas_ordenadas:
            print(f"  {tarea}")

def main():
    gestor = GestorTareas()

    while True:
        print("\n" + "=" * 40)
        gestor.listar_tareas()
        print("\nOpciones:")
        print("1. Crear tarea")
        print("2. Completar tarea")
        print("3. Eliminar tarea")
        print("4. Salir")

        opcion = input("Selecciona una opción (1-4): ").strip()

        if opcion == '1':
            descripcion = input("Descripción de la tarea: ").strip()
            prioridad = input("Prioridad (urgente/normal): ").strip().lower()
            if prioridad not in ['urgente', 'normal']:
                prioridad = 'normal'
            gestor.agregar_tarea(descripcion, prioridad)

        elif opcion == '2':
            try:
                tarea_id = int(input("ID de la tarea a completar: ").strip())
                gestor.completar_tarea(tarea_id)
            except ValueError:
                print("ID inválido.")

        elif opcion == '3':
            try:
                tarea_id = int(input("ID de la tarea a eliminar: ").strip())
                gestor.eliminar_tarea(tarea_id)
            except ValueError:
                print("ID inválido.")

        elif opcion == '4':
            print("Saliendo del gestor de tareas...")
            break

        else:
            print("Opción no válida. Intenta nuevamente.")

if __name__ == "__main__":
    main()
