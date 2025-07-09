tareas = [
    {'Nombre': 'Tarea1', 'Prioridad': 'Normal'},
    {'Nombre': 'Tarea2', 'Prioridad': 'Normal'},
    {'Nombre': 'Tarea3', 'Prioridad': 'Urgente'}
]

def crear_tarea(nombre, prioridad):
    if prioridad not in ['Normal', 'Urgente']:
        print("Prioridad inválida. Usa 'Normal' o 'Urgente'.")
        return
    tarea = {'Nombre': nombre.strip(), 'Prioridad': prioridad}
    tareas.append(tarea)
    print(f'Tarea "{nombre}" con prioridad "{prioridad}" creada.')

def ejecutar_tareas_por_prioridad():
    global tareas
    if not tareas:
        print("No hay tareas para completar.")
        return

    tareas_ordenadas = sorted(tareas, key=lambda x: x['Prioridad'] != 'Urgente')
    
    print("\n*** Ejecutando Tareas ***")
    for tarea in tareas_ordenadas:
        print(f'- Completando: {tarea["Nombre"]} ({tarea["Prioridad"]})')
    
    tareas.clear()
    print("Todas las tareas han sido completadas.")

def mostrar_tareas_por_prioridad(prioridad):
    prioridad = prioridad.capitalize()
    tareas_filtradas = [t for t in tareas if t['Prioridad'] == prioridad]
    
    if tareas_filtradas:
        print(f"\n*** Tareas con prioridad '{prioridad}' ***")
        for t in tareas_filtradas:
            print(f'- {t["Nombre"]} ({t["Prioridad"]})')
    else:
        print(f"No hay tareas con prioridad '{prioridad}'.")

def eliminar_tarea(nombre):
    global tareas
    nombre = nombre.strip()
    if any(t['Nombre'] == nombre for t in tareas):
        tareas = [t for t in tareas if t['Nombre'] != nombre]
        print(f'Tarea "{nombre}" eliminada.')
    else:
        print(f'No se encontró ninguna tarea llamada "{nombre}".')

def menu():
    salir = False
    while not salir:
        print("\n--- MENÚ DE TAREAS ---")
        print("1. Ver tareas")
        print("2. Crear tarea")
        print("3. Ejecutar tareas automáticamente por prioridad")
        print("4. Eliminar tarea")
        print("5. Ver tareas por prioridad")
        print("6. Salir")

        opcion = input("Elige una opción: ").strip()

        if opcion == '1':
            if tareas:
                print("\n*** Lista de Tareas ***")
                for tarea in tareas:
                    print(f"- {tarea['Nombre']} ({tarea['Prioridad']})")
            else:
                print("No hay tareas pendientes.")

        elif opcion == '2':
            nombre = input("Nombre de la nueva tarea: ").strip()
            prioridad = input("¿Qué prioridad tiene? (Normal/Urgente): ").strip().capitalize()
            crear_tarea(nombre, prioridad)

        elif opcion == '3':
            ejecutar_tareas_por_prioridad()

        elif opcion == '4':
            nombre = input("Nombre de la tarea a eliminar: ")
            eliminar_tarea(nombre)

        elif opcion == '5':
            prioridad = input("Ingrese la prioridad a filtrar (Normal/Urgente): ")
            mostrar_tareas_por_prioridad(prioridad)

        elif opcion == '6':
            salir = True
            print("Saliendo del programa...")

        else:
            print("Opción no válida. Intenta de nuevo.")

menu()
