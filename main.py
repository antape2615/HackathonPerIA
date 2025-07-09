from src.task import Task
from src.tasks import Tasks

while True:
    print("\t Programa de tareas")
    print("1. Crear tarea")
    print("2. Buscar tarea por id")
    print("3. Buscar tareas por prioridad")
    print("4. Mostrar tareas")
    print("5. cerrar")
    tasks = Tasks()
    valor = int(input("Escriba la opcion"))
    if valor == 1:
        nombre = str(input("Escriba nombre"))
        descripcion = str(input("Escriba descripcion"))
        prioridad = str(input("Escriba prioridad"))
        task = Task(nombre, descripcion, prioridad)
        print(task.id)
        tasks.add_task(task)
    elif valor == 2:
        id = str(input("Escriba id"))
        task = tasks.search_by_id(id)
        print(task)
    elif valor == 3:
        prioridad = input("Escriba prioridad")
        t = tasks.search_by_prioridad(prioridad)
        print(t)
    elif valor == 4:
        print(tasks.tasks)
    else:
        break
