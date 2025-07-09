import uuid

class Task:
    def __init__(self, nombre, descripcion, prioridad):
        self.id = uuid.uuid4()
        self.nombre = nombre
        self.descripcion = descripcion
        if prioridad not in ["urgente", "normal"]:
            raise Exception("Solo permite prioridad urgente o normal")
        self.prioridad = prioridad


        