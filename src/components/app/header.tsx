import { BrainCircuit } from 'lucide-react';

export function Header() {
  return (
    <header className="px-4 lg:px-6 h-16 flex items-center border-b bg-background/50 backdrop-blur-sm sticky top-0 z-50">
      <a className="flex items-center justify-center gap-2" href="/">
        <BrainCircuit className="h-6 w-6 text-primary" />
        <span className="text-xl font-semibold">StudySphere</span>
      </a>
    </header>
  );
}
