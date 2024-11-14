import { CheckCircle, Circle } from "lucide-react";

interface Step {
  title: string;
  description: string;
}

interface StepsProps {
  steps: Step[];
  currentStep: number;
}

export function Steps({ steps, currentStep }: StepsProps) {
  return (
    <div className="relative">
      <div className="absolute left-0 top-[15px] w-full h-0.5 bg-muted" />
      <div className="relative z-10 flex justify-between">
        {steps.map((step, index) => (
          <div
            key={index}
            className="flex flex-col items-center"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-background border">
              {index < currentStep ? (
                <CheckCircle className="h-5 w-5 text-primary" />
              ) : index === currentStep ? (
                <div className="w-2 h-2 rounded-full bg-primary" />
              ) : (
                <Circle className="h-5 w-5 text-muted-foreground" />
              )}
            </div>
            <div className="mt-2 text-center">
              <p className="text-sm font-medium">
                {step.title}
              </p>
              <p className="text-xs text-muted-foreground">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}