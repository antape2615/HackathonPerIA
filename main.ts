class Tarea:
    _id_counter = 1

    def __init__(self, descripcion, prioridad="normal"):
        self.id = Tarea._id_counter
        Tarea._id_counter += 1

        self.descripcion = descripcion
        self.prioridad = prioridad  # "urgente" o "normal"
        self.completada = False

    def completar(self):
        self.completada = True

    def __repr__(self):
        estado = "✓" if self.completada else "✗"
        return f"[{self.id}] ({self.prioridad}) {self.descripcion} - Completada: {estado}"


class ListaTareas:
    def __init__(self):
        self.tareas = []

    def agregar_tarea(self, descripcion, prioridad="normal"):
        tarea = Tarea(descripcion, prioridad)
        self.tareas.append(tarea)
        self._ordenar_por_prioridad()
        print(f"Tarea agregada: {tarea}")

    def _ordenar_por_prioridad(self):
        # Ordena para que las urgentes vayan primero
        self.tareas.sort(key=lambda t: 0 if t.prioridad == "urgente" else 1)

    def eliminar_tarea(self, tarea_id):
        for tarea in self.tareas:
            if tarea.id == tarea_id:
                self.tareas.remove(tarea)
                print(f"Tarea eliminada: {tarea}")
                return True
        print(f"No se encontró tarea con ID {tarea_id}")
        return False

    def completar_tarea(self, tarea_id):
        for tarea in self.tareas:
            if tarea.id == tarea_id:
                tarea.completar()
                print(f"Tarea completada: {tarea}")
                return True
        print(f"No se encontró tarea con ID {tarea_id}")
        return False

    def buscar_por_id(self, tarea_id):
        for tarea in self.tareas:
            if tarea.id == tarea_id:
                return tarea
        return None

    def filtrar_por_prioridad(self, prioridad):
        return [t for t in self.tareas if t.prioridad == prioridad]

    def mostrar_tareas(self):
        if not self.tareas:
            print("No hay tareas.")
            return
        print("Lista de tareas:")
        for tarea in self.tareas:
            print(tarea)


# Ejemplo de uso
if __name__ == "__main__":
    lista = ListaTareas()

    lista.agregar_tarea("Comprar leche", "normal")
    lista.agregar_tarea("Pagar factura", "urgente")
    lista.agregar_tarea("Lavar el coche", "normal")
    lista.agregar_tarea("Enviar correo al jefe", "urgente")

    lista.mostrar_tareas()

    lista.completar_tarea(2)
    lista.eliminar_tarea(3)

    print("\nTareas urgentes:")
    urgentes = lista.filtrar_por_prioridad("urgente")
    for t in urgentes:
        print(t)

    print("\nBuscar tarea con ID 1:")
    tarea = lista.buscar_por_id(1)
    print(tarea if tarea else "No encontrada")

class Tarea:
    _id_counter = 1

    def __init__(self, descripcion, prioridad="normal"):
        self.id = Tarea._id_counter
        Tarea._id_counter += 1
        self.descripcion = descripcion
        self.prioridad = prioridad  # "urgente" o "normal"
        self.completada = False

    def completar(self):
        self.completada = True

    def __repr__(self):
        estado = "✓" if self.completada else "✗"
        return f"[{self.id}] ({self.prioridad}) {self.descripcion} - Completada: {estado}"


class ListaTareas:
    def __init__(self):
        self.tareas = []

    def agregar_tarea(self, descripcion, prioridad="normal"):
        tarea = Tarea(descripcion, prioridad)
        self.tareas.append(tarea)
        self._ordenar_por_prioridad()
        print(f"Tarea agregada: {tarea}")

    def _ordenar_por_prioridad(self):
        self.tareas.sort(key=lambda t: 0 if t.prioridad == "urgente" else 1)

    def eliminar_tarea(self, tarea_id):
        for tarea in self.tareas:
            if tarea.id == tarea_id:
                self.tareas.remove(tarea)
                print(f"Tarea eliminada: {tarea}")
                return True
        print(f"No se encontró tarea con ID {tarea_id}")
        return False

    def completar_tarea(self, tarea_id):
        for tarea in self.tareas:
            if tarea.id == tarea_id:
                tarea.completar()
                print(f"Tarea completada: {tarea}")
                return True
        print(f"No se encontró tarea con ID {tarea_id}")
        return False

    def buscar_por_id(self, tarea_id):
        for tarea in self.tareas:
            if tarea.id == tarea_id:
                return tarea
        return None

    def filtrar_por_prioridad(self, prioridad):
        return [t for t in self.tareas if t.prioridad == prioridad]

    def mostrar_tareas(self):
        if not self.tareas:
            print("No hay tareas.")
            return
        print("Lista de tareas:")
        for tarea in self.tareas:
            print(tarea)


def menu():
    lista = ListaTareas()
    while True:
        print("\n--- Gestor de Tareas ---")
        print("1. Agregar tarea")
        print("2. Completar tarea")
        print("3. Eliminar tarea")
        print("4. Mostrar todas las tareas")
        print("5. Buscar tarea por ID")
        print("6. Filtrar tareas por prioridad")
        print("7. Salir")

        opcion = input("Elige una opción: ")

        if opcion == "1":
            descripcion = input("Descripción de la tarea: ")
            prioridad = input("Prioridad (urgente/normal): ").lower()
            if prioridad not in ["urgente", "normal"]:
                prioridad = "normal"
            lista.agregar_tarea(descripcion, prioridad)

        elif opcion == "2":
            try:
                tarea_id = int(input("ID de la tarea a completar: "))
                lista.completar_tarea(tarea_id)
            except ValueError:
                print("Por favor ingresa un número válido.")

        elif opcion == "3":
            try:
                tarea_id = int(input("ID de la tarea a eliminar: "))
                lista.eliminar_tarea(tarea_id)
            except ValueError:
                print("Por favor ingresa un número válido.")

        elif opcion == "4":
            lista.mostrar_tareas()

        elif opcion == "5":
            try:
                tarea_id = int(input("ID de la tarea a buscar: "))
                tarea = lista.buscar_por_id(tarea_id)
                if tarea:
                    print(tarea)
                else:
                    print("Tarea no encontrada.")
            except ValueError:
                print("Por favor ingresa un número válido.")

        elif opcion == "6":
            prioridad = input("Filtrar por prioridad (urgente/normal): ").lower()
            if prioridad not in ["urgente", "normal"]:
                print("Prioridad inválida.")
            else:
                tareas = lista.filtrar_por_prioridad(prioridad)
                if tareas:
                    for t in tareas:
                        print(t)
                else:
                    print(f"No hay tareas con prioridad {prioridad}.")

        elif opcion == "7":
            print("Saliendo...")
            break

        else:
            print("Opción no válida, intenta de nuevo.")


if __name__ == "__main__":
    menu()
