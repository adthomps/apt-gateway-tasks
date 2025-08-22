import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, Search } from "lucide-react";

interface WelcomeModalProps {
  open: boolean;
  onComplete: (goal: string) => void;
}

// Predefined goal suggestions - can be expanded with LLM in the future
const SUGGESTED_GOALS = [
  "Add Buy Now button to my website",
  "Set up subscription payments",
  "Accept donations on my site", 
  "Create a checkout page",
  "Add payment to mobile app",
  "Set up recurring billing",
  "Process one-time payments",
  "Add payment form to landing page",
  "Integrate with existing checkout",
  "Set up marketplace payments",
  "Accept international payments",
  "Create payment links",
  "Add tip jar functionality",
  "Set up membership payments",
  "Process event ticket sales"
];

export function WelcomeModal({ open, onComplete }: WelcomeModalProps) {
  const [goal, setGoal] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (goal.trim().length > 0) {
      const filtered = SUGGESTED_GOALS.filter(suggestion =>
        suggestion.toLowerCase().includes(goal.toLowerCase())
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(filtered.length > 0 && goal !== filtered[0]);
    } else {
      setShowSuggestions(false);
      setFilteredSuggestions([]);
    }
  }, [goal]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node) &&
          inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGoal(e.target.value);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setGoal(suggestion);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleInputFocus = () => {
    if (filteredSuggestions.length > 0 && goal.trim()) {
      setShowSuggestions(true);
    }
  };

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
          <div className="space-y-2 relative">
            <Label htmlFor="goal" className="text-sm font-medium">
              Your Goal
            </Label>
            <div className="relative">
              <Input
                ref={inputRef}
                id="goal"
                placeholder="e.g., Add Buy Now button to my website"
                value={goal}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                className="text-base pr-10"
                autoFocus
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            </div>
            
            {showSuggestions && filteredSuggestions.length > 0 && (
              <div 
                ref={suggestionsRef}
                className="absolute z-50 w-full mt-1 bg-background border border-border rounded-md shadow-lg max-h-60 overflow-y-auto"
              >
                {filteredSuggestions.slice(0, 5).map((suggestion, index) => (
                  <button
                    key={index}
                    type="button"
                    className="w-full px-3 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer border-b border-border/50 last:border-b-0"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion}
                  </button>
                ))}
                {filteredSuggestions.length > 5 && (
                  <div className="px-3 py-2 text-xs text-muted-foreground border-t border-border/50">
                    +{filteredSuggestions.length - 5} more suggestions...
                  </div>
                )}
              </div>
            )}
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