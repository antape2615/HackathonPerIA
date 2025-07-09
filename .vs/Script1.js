class Task {
    constructor(id, description, priority) {
        this.id = id;
        this.description = description;
        this.priority = priority;
        this.completed = false;
    }

    completeTask() {
        this.completed = true;
    }

    toString() {
        const status = this.completed ? "Completed" : "Not Completed";
        return `ID: ${this.id}, Description: ${this.description}, Priority: ${this.priority}, Status: ${status}`;
    }
}

class TaskManager {
    constructor() {
        this.tasks = [];
        this.idCounter = 1;
    }

    addTask(description, priority) {
        if (priority !== "urgent" && priority !== "normal") {
            console.log("Invalid priority. Please use 'urgent' or 'normal'.");
            return;
        }

        const task = new Task(this.idCounter, description, priority);
        this.tasks.push(task);
        this.idCounter++;
        this.sortTasks();
        console.log(`Task added: ${task.toString()}`);
    }

    sortTasks() {
        this.tasks.sort((a, b) => {
            if (a.priority === "urgent" && b.priority === "normal") {
                return -1;
            } else if (a.priority === "normal" && b.priority === "urgent") {
                return 1;
            } else {
                return 0;
            }
        });
    }

    completeTask(id) {
        const task = this.tasks.find((task) => task.id === id);
        if (task) {
            task.completeTask();
            console.log(`Task ${id} completed.`);
        } else {
            console.log(`Task ${id} not found.`);
        }
    }

    deleteTask(id) {
        const index = this.tasks.findIndex((task) => task.id === id);
        if (index !== -1) {
            this.tasks.splice(index, 1);
            console.log(`Task ${id} deleted.`);
        } else {
            console.log(`Task ${id} not found.`);
        }
    }

    searchTask(id) {
        const task = this.tasks.find((task) => task.id === id);
        if (task) {
            console.log(task.toString());
        } else {
            console.log(`Task ${id} not found.`);
        }
    }

    filterTasks(priority) {
        if (priority !== "urgent" && priority !== "normal") {
            console.log("Invalid priority. Please use 'urgent' or 'normal'.");
            return;
        }

        const filteredTasks = this.tasks.filter((task) => task.priority === priority);
        if (filteredTasks.length > 0) {
            filteredTasks.forEach((task) => console.log(task.toString()));
        } else {
            console.log(`No tasks with priority ${priority} found.`);
        }
    }

    displayTasks() {
        if (this.tasks.length > 0) {
            this.tasks.forEach((task) => console.log(task.toString()));
        } else {
            console.log("No tasks available.");
        }
    }
}

const taskManager = new TaskManager();

const main = () => {
    console.log("Task Management System");
    console.log("1. Add task");
    console.log("2. Complete task");
    console.log("3. Delete task");
    console.log("4. Search task");
    console.log("5. Filter tasks");
    console.log("6. Display tasks");
    console.log("7. Exit");

    const readline = require("readline").createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    readline.question("Choose an option: ", (option) => {
        switch (option) {
            case "1":
                readline.question("Enter task description: ", (description) => {
                    readline.question("Enter task priority (urgent/normal): ", (priority) => {
                        taskManager.addTask(description, priority);
                        main();
                    });
                });
                break;
            case "2":
                readline.question("Enter task ID: ", (id) => {
                    taskManager.completeTask(parseInt(id));
                    main();
                });
                break;
            case "3":
                readline.question("Enter task ID: ", (id) => {
                    taskManager.deleteTask(parseInt(id));
                    main();
                });
                break;
            case "4":
                readline.question("Enter task ID: ", (id) => {
                    taskManager.searchTask(parseInt(id));
                    main();
                });
                break;
            case "5":
                readline.question("Enter priority (urgent/normal): ", (priority) => {
                    taskManager.filterTasks(priority);
                    main();
                });
                break;
            case "6":
                taskManager.displayTasks();
                main();
                break;
            case "7":
                console.log("Exiting...");
                break;
            default
// JavaScript source code
