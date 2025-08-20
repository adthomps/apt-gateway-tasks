import { CheckCircle, Circle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'active' | 'completed';
}

interface OnboardingSidebarProps {
  steps: OnboardingStep[];
  currentStep: number;
}

export function OnboardingSidebar({ steps, currentStep }: OnboardingSidebarProps) {
  const completedSteps = steps.filter(step => step.status === 'completed').length;
  const progressPercentage = (completedSteps / steps.length) * 100;

  return (
    <div className="w-80 bg-card border-r border-border h-screen p-6 overflow-y-auto">
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold mb-2">Setup Progress</h2>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Steps completed</span>
              <span className="font-medium">{completedSteps}/{steps.length}</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div 
                className="bg-gradient-primary h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>

        <div className="space-y-1">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={cn(
                "flex items-start gap-3 p-3 rounded-lg transition-all duration-200",
                step.status === 'active' && "bg-accent border border-primary/20",
                step.status === 'completed' && "bg-success/5"
              )}
            >
              <div className="mt-0.5">
                {step.status === 'completed' ? (
                  <CheckCircle className="w-5 h-5 text-success" />
                ) : step.status === 'active' ? (
                  <Clock className="w-5 h-5 text-primary animate-pulse" />
                ) : (
                  <Circle className="w-5 h-5 text-muted-foreground" />
                )}
              </div>
              <div className="space-y-1 min-w-0 flex-1">
                <h3 className={cn(
                  "font-medium text-sm leading-tight",
                  step.status === 'completed' && "text-success",
                  step.status === 'active' && "text-primary",
                  step.status === 'pending' && "text-muted-foreground"
                )}>
                  {step.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {completedSteps === steps.length && (
          <div className="p-4 bg-gradient-secondary rounded-lg border border-success/20">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-success" />
              <h3 className="font-semibold text-success">All Done!</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              You're ready to start accepting payments
            </p>
          </div>
        )}
      </div>
    </div>
  );
}