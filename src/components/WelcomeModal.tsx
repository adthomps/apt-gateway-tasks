import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles } from "lucide-react";

interface WelcomeModalProps {
  open: boolean;
  onComplete: (goal: string) => void;
}

export function WelcomeModal({ open, onComplete }: WelcomeModalProps) {
  const [goal, setGoal] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (goal.trim()) {
      onComplete(goal.trim());
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center space-y-4">
          <div className="mx-auto w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center shadow-glow">
            <Sparkles className="w-6 h-6 text-primary-foreground" />
          </div>
          <DialogTitle className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Welcome to PayFlow
          </DialogTitle>
          <DialogDescription className="text-base">
            Let's get you set up with payments in just a few steps. What's your main goal today?
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          <div className="space-y-2">
            <Label htmlFor="goal" className="text-sm font-medium">
              Your Goal
            </Label>
            <Input
              id="goal"
              placeholder="e.g., Add Buy Now button to my website"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="text-base"
              autoFocus
            />
          </div>
          
          <div className="space-y-3">
            <Button 
              type="submit" 
              className="w-full bg-gradient-primary hover:shadow-elevated transition-all duration-200"
              disabled={!goal.trim()}
            >
              Start Setup
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              This will create a personalized checklist for you
            </p>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}