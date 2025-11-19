import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SidebarNav } from '../components/admin/SidebarNav';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { PlusIcon, SearchIcon, EditIcon, TrashIcon, UsersIcon } from 'lucide-react';

interface Test {
  id: string;
  title: string;
  level: 'Junior' | 'Mid' | 'Senior';
  language: string;
  assignedCount: number;
  completedCount: number;
  createdAt: string;
}

const mockTests: Test[] = [
  {
    id: '1',
    title: 'Suma de dos números',
    level: 'Junior',
    language: 'JavaScript',
    assignedCount: 12,
    completedCount: 8,
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    title: 'Búsqueda binaria',
    level: 'Mid',
    language: 'Python',
    assignedCount: 8,
    completedCount: 5,
    createdAt: '2024-01-14',
  },
  {
    id: '3',
    title: 'Sistema de diseño distribuido',
    level: 'Senior',
    language: 'Java',
    assignedCount: 4,
    completedCount: 2,
    createdAt: '2024-01-13',
  },
];

const levelConfig = {
  Junior: 'bg-primary/10 text-primary border-primary/20',
  Mid: 'bg-secondary/10 text-secondary border-secondary/20',
  Senior: 'bg-tertiary/10 text-tertiary border-tertiary/20',
};

export function AdminTestsPage() {
  const navigate = useNavigate();
  const [tests, setTests] = useState<Test[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
    setTimeout(() => {
      setTests(mockTests);
    }, 500);
  }, []);

  const filteredTests = tests.filter((test) =>
    test.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-background">
      <SidebarNav />
      
      <main className="flex-1 ml-64 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between mb-12">
              <div>
                <h1 className="text-3xl font-alt font-bold text-foreground">Gestión de pruebas</h1>
                <p className="text-muted-foreground mt-2">
                  Crea, edita y administra las pruebas técnicas
                </p>
              </div>
              <Button
                onClick={() => navigate('/admin/tests/wizard')}
                className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <PlusIcon className="w-4 h-4" />
                Nueva prueba
              </Button>
            </div>

            <div className="mb-8">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar pruebas..."
                  className="pl-10 bg-card text-foreground border-border"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {filteredTests.map((test, index) => (
                <motion.div
                  key={test.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="bg-card text-card-foreground border-border hover:border-primary/50 transition-colors">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-xl font-alt font-semibold text-foreground mb-3">
                            {test.title}
                          </CardTitle>
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className={levelConfig[test.level]}>
                              {test.level}
                            </Badge>
                            <Badge variant="outline" className="bg-muted text-muted-foreground">
                              {test.language}
                            </Badge>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <UsersIcon className="w-4 h-4" />
                              <span>
                                {test.completedCount}/{test.assignedCount} completadas
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => navigate(`/admin/tests/${test.id}`)}
                            className="bg-transparent text-foreground hover:bg-muted"
                          >
                            <EditIcon className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="bg-transparent text-destructive hover:bg-destructive hover:text-destructive-foreground"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Creada el {new Date(test.createdAt).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {filteredTests.length === 0 && (
              <div className="text-center py-24">
                <p className="text-muted-foreground">No se encontraron pruebas</p>
              </div>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
