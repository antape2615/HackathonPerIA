from gestor_tareas import GestorTareas  # Importa GestorTareas desde gestor_tareas.py

def menu():
    gestor = GestorTareas()
    
    while True:
        print("\n--- Menú de Gestión de Tareas ---")
        print("1. Crear tarea")
        print("2. Completar tarea")
        print("3. Eliminar tarea")
        print("4. Mostrar tareas")
        print("5. Filtrar tareas por prioridad")
        print("6. Ver tareas ordenadas por prioridad")
        print("7. Obtener tarea con mayor prioridad")
        print("8. Salir")
        
        opcion = input("Seleccione una opción: ")

        if opcion == '1':
            descripcion = input("Ingrese la descripción de la tarea: ")
            prioridad = input("Ingrese la prioridad (urgente/normal): ").lower()
            if prioridad not in ['urgente', 'normal']:
                print("Prioridad no válida. Use 'urgente' o 'normal'.")
                continue
            gestor.crear_tarea(descripcion, prioridad)
        
        elif opcion == '2':
            id_tarea = int(input("Ingrese el ID de la tarea a completar: "))
            gestor.completar_tarea(id_tarea)
        
        elif opcion == '3':
            id_tarea = int(input("Ingrese el ID de la tarea a eliminar: "))
            gestor.eliminar_tarea(id_tarea)
        
        elif opcion == '4':
            gestor.mostrar_tareas()
        
        elif opcion == '5':
            prioridad = input("Ingrese la prioridad a filtrar (urgente/normal): ").lower()
            if prioridad not in ['urgente', 'normal']:
                print("Prioridad no válida.")
                continue
            tareas_filtradas = gestor.filtrar_por_prioridad(prioridad)
            for tarea in tareas_filtradas:
                print(tarea)
        
        elif opcion == '6':
            tareas_ordenadas = gestor.obtener_tareas_ordenadas()
            for tarea in tareas_ordenadas:
                print(tarea)
        
        elif opcion == '7':
            gestor.obtener_tarea_con_mayor_prioridad()
        
        elif opcion == '8':
            print("Saliendo...")
            break
        
        else:
            print("Opción no válida. Intente nuevamente.")

if __name__ == "__main__":
    menu()
