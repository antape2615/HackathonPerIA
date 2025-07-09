class Tarea:
    """Representa una tarea con descripción, prioridad e ID único."""

    def __init__(self, id_: int, descripcion: str, prioridad: str = 'normal'):
        self.id = id_
        self.descripcion = descripcion
        self.prioridad = prioridad
        self.completada = False

    def __str__(self):
        estado = "Completada" if self.completada else "Pendiente"
        return f"[{self.id}] {estado} - {self.descripcion} ({self.prioridad})"


class GestorTareas:
    """Gestiona la creación, modificación y listado de tareas."""

    def __init__(self):
        self.tareas = []
        self._proximo_id = 1

    def agregar_tarea(self, descripcion: str, prioridad: str = 'normal'):
        tarea = Tarea(self._proximo_id, descripcion, prioridad)
        self._proximo_id += 1
        self.tareas.append(tarea)
        print(f"\nTarea creada: {tarea}")

    def completar_tarea(self, tarea_id: int):
        tarea = self._buscar_tarea_por_id(tarea_id)
        if tarea:
            tarea.completada = True
            print(f"\nTarea completada: {tarea}")
        else:
            print("Tarea no encontrada.")

    def eliminar_tarea(self, tarea_id: int):
        tarea = self._buscar_tarea_por_id(tarea_id)
        if tarea:
            self.tareas.remove(tarea)
            print(f"\nTarea eliminada: {tarea}")
        else:
            print("Tarea no encontrada.")

    def listar_tareas(self):
        if not self.tareas:
            print("No hay tareas.")
            return

        tareas_ordenadas = sorted(
            self.tareas,
            key=lambda t: (t.prioridad != 'urgente', t.completada)
        )

        print("\nTareas:")
        for tarea in tareas_ordenadas:
            print(f"  {tarea}")

    def _buscar_tarea_por_id(self, tarea_id: int):
        return next((t for t in self.tareas if t.id == tarea_id), None)


def mostrar_menu():
    print("\nOpciones:")
    print("1. Crear tarea")
    print("2. Completar tarea")
    print("3. Eliminar tarea")
    print("4. Salir")


def main():
    gestor = GestorTareas()

    while True:
        print("\n" + "=" * 40)
        gestor.listar_tareas()
        mostrar_menu()

        opcion = input("Selecciona una opción (1-4): ").strip()

        if opcion == '1':
            descripcion = input("Descripción de la tarea: ").strip()
            prioridad = input("Prioridad (urgente/normal): ").strip().lower()
            if prioridad not in ['urgente', 'normal']:
                print("Prioridad inválida. Se usará 'normal' por defecto.")
                prioridad = 'normal'
            gestor.agregar_tarea(descripcion, prioridad)

        elif opcion == '2':
            try:
                tarea_id = int(input("ID de la tarea a completar: ").strip())
                gestor.completar_tarea(tarea_id)
            except ValueError:
                print("ID inválido. Debe ser un número.")

        elif opcion == '3':
            try:
                tarea_id = int(input("ID de la tarea a eliminar: ").strip())
                gestor.eliminar_tarea(tarea_id)
            except ValueError:
                print("ID inválido. Debe ser un número.")

        elif opcion == '4':
            print("Saliendo del gestor de tareas...")
            break

        else:
            print("Opción no válida. Intenta nuevamente.")


if __name__ == "__main__":
    main()
