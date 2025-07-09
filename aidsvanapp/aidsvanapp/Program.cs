using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace aidsvanapp
{
    internal class Program
    {
        public static GestorTareas gestor { get; set; }

        public static int numeroTarea { get; set; }

        private static string opcion {  get; set; }
        static void Main(string[] args)
        {
            numeroTarea = 1;
            gestor = new GestorTareas();
            gestor.tareas = new List<Tarea>();
            PintarOpciones();
        }
        
        static void PintarOpciones()
        {
            Console.Clear();
            opcion = string.Empty;
            Console.Title = "Lector de tareas";
            Console.WriteLine("1. Crear Tarea");
            Console.WriteLine("2. Completar Tarea");
            Console.WriteLine("3. Eliminar Tarea");
            Console.WriteLine("4. Filtrar Tareas");
            Console.WriteLine("5. Asignar prioridad");
            opcion = Console.ReadLine();
            ProcesarOpciones(opcion);
        }

        static void ProcesarOpciones(string opcion)
        {
            Console.Clear();
            switch (opcion)
            {
                case "1":
                    ProcesarCrear();
                break;
                case "2":
                    ProcesarCompletar();
                break;
                case "3":
                    ProcesarEliminar();
                break;
                case "4":
                    ProcesarFiltrar();
                break;
                case "5":
                    ProcesarAsignar();
                break;
                default: Console.WriteLine("La opción ingresada no es válida");
                break;
            }
        }

        static int ParseInt(string number)
        {
            int iresult = 0;
            int.TryParse(number, out iresult);
            return iresult;
        }

        static void ProcesarAsignar()
        {
            Console.Write("Ingrese el número de tarea que desea asignar la prioridad:");
            string stask = Console.ReadLine();
            Console.WriteLine($"Ingrese la prioridad que dese asignar a la tarea {stask}:");
            string sprioridad = Console.ReadLine();
            AsignarPrioridad(ParseInt(stask), sprioridad);
        }

        static void ProcesarFiltrar()
        {
            Console.Write("Ingrese el número de tarea o prioridad de las tareas que desea buscar:");
            string stask = Console.ReadLine();
            FiltrarTareas(stask);
            Console.WriteLine(gestor);
        }

        static void ProcesarCompletar()
        {
            Console.Write("Ingrese el número de tarea que desea completar:");
            string stask = Console.ReadLine();
            CompletarTarea(ParseInt(stask));
            PintarOpciones();
        }
        static void ProcesarPrioridad()
        {
            Console.Write("Ingrese el número de tarea que desea completar:");
            string stask = Console.ReadLine();
            CompletarTarea(ParseInt(stask));
            PintarOpciones();
        }

        static void ProcesarEliminar()
        {
            Console.Write("Ingrese el número de tarea que desea eliminar:");
            string stask = Console.ReadLine();
            EliminarTarea(ParseInt(stask));
            PintarOpciones();
        }

        static void ProcesarCrear()
        {
            Console.WriteLine("Ingrese la prioridad de la tarea (urgente / normal)");
            CrearTarea(Console.ReadLine());
            PintarOpciones();
        }

        static void OrdenarTareas()
        {
            List<Tarea> urgentes = gestor.tareas.FindAll(x => x.prioridad == "urgente").ToList();            
            List<Tarea> normales = gestor.tareas.FindAll(x => x.prioridad == "normal").ToList();
            gestor.tareas.Clear();
            if (urgentes.Count > 0)
                gestor.tareas.AddRange(urgentes);
            if (normales.Count > 0)
                gestor.tareas.AddRange(normales);
        }

        static List<Tarea> FiltrarTareas(string sprioridad)
        {
            return gestor.tareas.FindAll(x => x.numtarea == ParseInt(sprioridad) || x.prioridad == sprioridad).ToList();
        }

        static void EliminarTarea(int itarea)
        {
            Tarea tmp = gestor.tareas.FirstOrDefault(x => x.numtarea == itarea);
            if (tmp != null)
            {
                gestor.tareas.Remove(tmp);
            }
            else
            {
                Console.WriteLine("La tarea ingresada no existe");
            }
        }

        static void CompletarTarea(int itarea)
        {
            Tarea tmp = gestor.tareas.FirstOrDefault(x => x.numtarea == itarea);
            if (tmp != null)
            {
                tmp.completa = true;
                gestor.tareas[itarea] = tmp;
            }
            else
            {
                Console.WriteLine("La tarea ingresada no existe");
            }
        }

        static void AsignarPrioridad(int itarea, string sprioridad)
        {
            if (sprioridad == "urgente" || sprioridad == "normal")
            {
                Tarea tmp = gestor.tareas.FirstOrDefault(x => x.numtarea == itarea);
                if (tmp != null)
                {
                    tmp.prioridad = sprioridad;
                    gestor.tareas[itarea] = tmp;
                }
                else
                {
                    Console.WriteLine("La tarea ingresada no existe");
                }
            }
            else
            {
                Console.WriteLine("La prioridad de la tarea solo puede ser normal o urgente");
            }
        }

        static void CrearTarea(string sprioridad)
        {
            if (sprioridad == "urgente" || sprioridad == "normal")
            {
                Tarea tarea = new Tarea()
                {
                    numtarea = numeroTarea,
                    prioridad = sprioridad,
                    completa = false,
                };
                gestor.tareas.Add(tarea);
                numeroTarea++;
                OrdenarTareas();
                Console.WriteLine("Tarea creada:");
                Console.WriteLine(gestor);
            }
            else
            {
                Console.WriteLine("La prioridad de la tarea solo puede ser normal o urgente");
            }
        }
    }
}
