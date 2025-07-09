
def crear_tarea:
    descripcion = input("Ingrese la descripcion de la tarea: ")
    while True:
        prioridad = input("Inserte la prioridad de la tarea (Urgente o Normal): ").lower()
        if prioridad in ["urgente" , "normal"]
            break
        else:
            print("Prioridad invalida ingrese por favor una correcta.")
    tarea = {f"Descripcion: {descripcion}, Prioridad: {prioridad}"}
    tareas.append(tarea)
    print("Tarea creada.")

def lista_tareas():
    if not tareas:
        print("No hay tareas pendientes.")
        return
    
    orden_tareas = sorted(tareas, key = lambda t: t["prioridad"] == "normal")
    print("\lista tareas: ")
    for idx, tarea in enumerate(orden_tareas, start=1):
        print(f"{idx}.{tarea["descripcion"]} (Prioridad: {tarea["prioridad"].capitalize()})")


def actualizar_tarea():
    listar_tareas()
    if not tareas:
        return
    try:
        idx = int(input("ingrese el numero de la tarea a actualizar: "))
        if <= idx <= len(tareas):
            descripcion = input("Nueva descripcion de la tarea: ")
            while True:
                prioridad = input("Nueva prioridad (Urgente o Normal): ")
                if prioridad in ["urgente", "normal"]:
                    break
                else:
                    print("Error con la prioridad. Solo se admite 'Urgente' o 'Normal' ")
            tareas[idx-1] = {f"Descripcion: {descripcion} Prioridad: {prioridad}"}
            print("Estado de latarea actualizada")
        else:
            print("Numero invalido")
        except ValueError:
            print("Ingrese un numero valido")

def eliminar_tarea():
    listar_tareas()
    if not tareas:
        return
    try:
        idx = int(input("Ingrese el numero de la tarea para eliminar."))
        if 1 <= idx <= len(tareas):
            tareas.pop(idx-1)
            print("Tarea eliminada.")
        else:
            print("Numero invalido.")
        except ValueError:
            print("Debe ingresar un numero valido.")

def menu():
    while True:
        print("CRUD de tareas en consola.")
        print("1. Crear tarea")
        print("2 Listar tareas")
        print("3 Actualizar tareas.")
        print("4 Eliminar tarea")
        print("5 salir")

        opcion = input("Selecciona una opcion: ")

        if opcion == "1":
            crear_tarea()
        elif opcion == "2"
            listar_tareas()
        elif opcion == "3"
            actualizar_tarea()
        elif opcion == "4":
            eliminar_tarea()
        elif opcion == "5":
            salir()
        else:
            print("Escoge una opcion valida.")
menu()