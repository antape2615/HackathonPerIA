import json
import uuid

tareas = []

def mostrar_tareas():
    for t in tareas:
        estado = '✓' if t['completada'] else '✗'
        print(f"[{estado}] {t['descrip']} | ID: {t['id']} | Prioridad: {t['prioridad']}")

def guardar():
    with open("tareas.json", "w") as f:
        json.dump(tareas, f)

def cargar():
    global tareas
    try:
        with open("tareas.json", "r") as f:
            tareas = json.load(f)
    except:
        tareas = []

def agregar():
    desc = input("Descripción: ")
    prio = input("Prioridad: ")
    tarea = {
        "id": str(uuid.uuid4()),
        "descripcion": desc,
        "prioridad": prio,
        "completada": False
    }
    tareas.append(tarea)

def completar():
    id_t = input("ID a completar: ")
    for t in tareas:
        if t["id"] == id_t:
            t["completada"] = True

def eliminar():
    id_t = input("ID a eliminar: ")
    global tareas
    tareas = [t for t in tareas if t["id"] != id_t]

def buscar():
    id_t = input("ID a buscar: ")
    for t in tareas:
        if t["id"] == id_t:
            print(t)
            return
    print("No encontrada")

def filtrar():
    prio = input("Prioridad a filtrar: ")
    for t in tareas:
        if t["prioridad"] == prio:
            print(t)

def menu():
    cargar()
    while True:
        print("\n1. Agregar\n2. Completar\n3. Eliminar\n4. Ver\n5. Buscar\n6. Filtrar\n7. Salir")
        op = input("Opción: ")
        if op == "1":
            agregar()
        elif op == "2":
            completar()
        elif op == "3":
            eliminar()
        elif op == "4":
            mostrar_tareas()
        elif op == "5":
            buscar()
        elif op == "6":
            filtrar()
        elif op == "7":
            guardar()
            break

menu()
