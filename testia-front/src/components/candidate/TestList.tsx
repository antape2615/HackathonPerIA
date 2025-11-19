import { TestCard, Test } from './TestCard';

interface TestListProps {
  tests: Test[];
}

export function TestList({ tests }: TestListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {tests.map((test, index) => (
        <TestCard key={test.title} test={test} index={index} />
      ))}
    </div>
  );
}
