# main.py

from gestor_tareas import GestorTareas

def mostrar_menu():
    print("\nGestor de Tareas")
    print("1. Crear tarea")
    print("2. Completar tarea")
    print("3. Eliminar tarea")
    print("4. Mostrar todas las tareas")
    print("5. Filtrar tareas por prioridad")
    print("6. Buscar tarea por ID")
    print("7. Salir")

def main():
    gestor = GestorTareas()

    while True:
        mostrar_menu()
        opcion = input("Elige una opción: ")

        if opcion == "1":
            descripcion = input("Descripción de la tarea: ")
            prioridad = input("Prioridad (normal/urgente): ").lower()
            if prioridad not in ["normal", "urgente"]:
                print("Prioridad no válida. Se asignará como normal.")
                prioridad = "normal"
            gestor.crear_tarea(descripcion, prioridad)

        elif opcion == "2":
            id_tarea = int(input("ID de la tarea a completar: "))
            gestor.completar_tarea(id_tarea)

        elif opcion == "3":
            id_tarea = int(input("ID de la tarea a eliminar: "))
            gestor.eliminar_tarea(id_tarea)

        elif opcion == "4":
            gestor.mostrar_tareas()

        elif opcion == "5":
            prioridad = input("Filtrar por prioridad (normal/urgente): ").lower()
            if prioridad not in ["normal", "urgente"]:
                print("Prioridad no válida.")
            else:
                tareas_filtradas = gestor.filtrar_tareas_por_prioridad(prioridad)
                for tarea in tareas_filtradas:
                    print(tarea)

        elif opcion == "6":
            id_tarea = int(input("ID de la tarea a buscar: "))
            tarea_encontrada = gestor.buscar_tarea_por_id(id_tarea)
            if tarea_encontrada:
                print(f"Tarea encontrada: {tarea_encontrada}")
            else:
                print("Tarea no encontrada.")

        elif opcion == "7":
            print("Saliendo...")
            break

        else:
            print("Opción no válida.")

if __name__ == "__main__":
    main()
