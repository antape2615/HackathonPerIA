import json
import os

ARCHIVO_TAREAS = "tareas.json"

def cargar_tareas():
    if not os.path.exists(ARCHIVO_TAREAS):
        return []
    with open(ARCHIVO_TAREAS, "r") as f:
        return json.load(f)

def guardar_tareas(tareas):
    with open(ARCHIVO_TAREAS, "w") as f:
        json.dump(tareas, f, indent=4)

def mostrar_tareas(tareas):
    if not tareas:
        print("📭 No tienes tareas pendientes.")
        return
    print("\n🗒️  Lista de tareas:")
    for i, tarea in enumerate(tareas, 1):
        estado = "✅" if tarea["completada"] else "🕒"
        print(f"{i}. {estado} {tarea['descripcion']}")

def agregar_tarea(tareas):
    descripcion = input("🔤 Escribe la descripción de la tarea: ").strip()
    if descripcion:
        tareas.append({"descripcion": descripcion, "completada": False})
        guardar_tareas(tareas)
        print("➕ Tarea agregada.")
    else:
        print("⚠️ Descripción vacía. No se agregó la tarea.")

def marcar_completada(tareas):
    mostrar_tareas(tareas)
    try:
        num = int(input("✅ Número de la tarea a marcar como completada: "))
        if 1 <= num <= len(tareas):
            tareas[num - 1]["completada"] = True
            guardar_tareas(tareas)
            print("✔️ Tarea marcada como completada.")
        else:
            print("❌ Número inválido.")
    except ValueError:
        print("⚠️ Ingresa un número válido.")

def eliminar_tarea(tareas):
    mostrar_tareas(tareas)
    try:
        num = int(input("🗑️ Número de la tarea a eliminar: "))
        if 1 <= num <= len(tareas):
            tarea_eliminada = tareas.pop(num - 1)
            guardar_tareas(tareas)
            print(f"🗑️ Tarea eliminada: {tarea_eliminada['descripcion']}")
        else:
            print("❌ Número inválido.")
    except ValueError:
        print("⚠️ Ingresa un número válido.")

def menu():
    tareas = cargar_tareas()
    while True:
        print("\n📋 MENÚ")
        print("1. Ver tareas")
        print("2. Agregar tarea")
        print("3. Marcar tarea como completada")
        print("4. Eliminar tarea")
        print("5. Salir")

        opcion = input("Elige una opción (1-5): ").strip()

        if opcion == "1":
            mostrar_tareas(tareas)
        elif opcion == "2":
            agregar_tarea(tareas)
        elif opcion == "3":
            marcar_completada(tareas)
        elif opcion == "4":
            eliminar_tarea(tareas)
        elif opcion == "5":
            print("👋 ¡Hasta luego!")
            break
        else:
            print("❌ Opción no válida.")

if __name__ == "__main__":
    menu()
