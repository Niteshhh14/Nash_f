import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../../components/ui/card';
import { CheckSquare, Check, Circle } from 'lucide-react';
import { Button } from '../../components/ui/button';

interface Task {
  id: string;
  title: string;
  patientName: string;
  timeSlot: string;
  completed: boolean;
}

export const Checklist: React.FC = () => {
  const [tasks, setTasks] = React.useState<Task[]>([
    { id: 'TSK-001', title: 'Confirm Furosemide (Lasix) 40mg pill taken', patientName: 'Sarah Jenkins', timeSlot: 'Morning (08:00)', completed: false },
    { id: 'TSK-002', title: 'Measure and record home weight (target water retention)', patientName: 'Sarah Jenkins', timeSlot: 'Morning (08:00)', completed: true },
    { id: 'TSK-003', title: 'Verify oxygen concentrator cannula fit', patientName: 'Marcus Chen', timeSlot: 'Noon (12:00)', completed: false },
    { id: 'TSK-004', title: 'Confirm Evening Beta-Blocker compliance check', patientName: 'Sarah Jenkins', timeSlot: 'Evening (20:00)', completed: false }
  ]);

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const activeCount = tasks.filter(t => !t.completed).length;

  return (
    <Card className="border-white/55 bg-white/45 backdrop-blur-[12px] shadow-sm">
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div>
          <CardTitle className="text-base font-semibold flex items-center space-x-2 text-[#4E3629]">
            <CheckSquare className="h-4.5 w-4.5 text-[#C7A37E]" />
            <span>Active Care Tasks Checklist</span>
          </CardTitle>
          <CardDescription className="text-[#4E3629]/70">
            Daily checks compiled from patient EHR care directives.
          </CardDescription>
        </div>
        <div className="bg-[#C7A37E]/10 border border-[#C7A37E]/20 text-[#C7A37E] text-[10px] font-bold uppercase tracking-wider rounded px-2.5 py-1">
          {activeCount} Tasks Pending
        </div>
      </CardHeader>
      <CardContent>
        {tasks.length === 0 ? (
          <div className="py-6 text-center text-sm text-[#4E3629]/70">
            No assigned tasks for today.
          </div>
        ) : (
          <div className="space-y-2">
            {tasks.map((task) => (
              <button
                key={task.id}
                onClick={() => toggleTask(task.id)}
                className={`w-full flex items-center justify-between p-3.5 rounded-xl border transition-all duration-150 cursor-pointer text-left ${
                  task.completed
                    ? 'border-[#4E3629]/10 bg-[#4E3629]/5 text-[#4E3629]/50 line-through'
                    : 'border-white/50 bg-white/60 text-[#4E3629] hover:border-[#4E3629]/20 hover:bg-white'
                }`}
              >
                <div className="flex items-center space-x-3">
                  {task.completed ? (
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 shrink-0">
                      <Check className="h-3 w-3" />
                    </div>
                  ) : (
                    <Circle className="h-5 w-5 text-[#4E3629]/40 shrink-0" />
                  )}
                  <div>
                    <p className="text-xs font-semibold">{task.title}</p>
                    <p className="text-[10px] text-[#4E3629]/60 mt-0.5">Dependent: {task.patientName}</p>
                  </div>
                </div>
                <span className="text-[9px] font-semibold uppercase tracking-wider text-[#4E3629]/65 bg-[#4E3629]/5 border border-[#4E3629]/10 px-2 py-0.5 rounded">
                  {task.timeSlot}
                </span>
              </button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
