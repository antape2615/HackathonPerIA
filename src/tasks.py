
class Tasks:
    def __init__(self):
        self.tasks = []
        self.prioridad_tareas = []

    def add_task(self, task):
        self.tasks.append(task.__dict__)
        if task.prioridad == "urgente":
            self.prioridad_tareas.insert(0,task.__dict__)
        self.prioridad_tareas.append(task.__dict__)
    def search_by_id(self, id):
        for item in self.tasks:
            if item.get("id") == id:
                return item.get(id).__dict__
        
    
    def search_by_prioridad(self, prioridad):
        response = []
        for item in self.tasks:
            if item.get("prioridad") == prioridad:
                response.append(item.__dict__)

        return response
    
