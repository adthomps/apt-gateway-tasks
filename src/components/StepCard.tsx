import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Copy, Eye, EyeOff, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface StepCardProps {
  step: {
    id: string;
    title: string;
    description: string;
    action?: string;
    content?: string;
    codeSnippet?: string;
    validationText?: string;
  };
  onComplete: () => void;
  isActive: boolean;
}

export function StepCard({ step, onComplete, isActive }: StepCardProps) {
  const [showCode, setShowCode] = useState(false);
  const [isValidated, setIsValidated] = useState(false);
  const { toast } = useToast();

  const handleCopyCode = () => {
    if (step.codeSnippet) {
      navigator.clipboard.writeText(step.codeSnippet);
      toast({
        title: "Code copied!",
        description: "The code snippet has been copied to your clipboard.",
      });
    }
  };

  const handleAction = () => {
    if (step.id === 'test-mode') {
      setIsValidated(true);
      onComplete();
    } else if (step.id === 'api-keys') {
      // Simulate API key generation
      setTimeout(() => {
        setIsValidated(true);
        onComplete();
      }, 1000);
    } else if (step.id === 'checkout-button') {
      setShowCode(true);
    } else if (step.id === 'copy-code') {
      handleCopyCode();
      setIsValidated(true);
      onComplete();
    } else if (step.id === 'email-notifications') {
      setIsValidated(true);
      onComplete();
    } else if (step.id === 'search-transaction') {
      // Open in new tab simulation
      window.open('#', '_blank');
      setIsValidated(true);
      onComplete();
    }
  };

  if (!isActive) {
    return (
      <Card className="opacity-50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg">{step.title}</CardTitle>
            <Badge variant="secondary">Waiting</Badge>
          </div>
          <CardDescription>{step.description}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="shadow-elevated border-primary/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg">{step.title}</CardTitle>
            <Badge className="bg-gradient-primary">Active</Badge>
          </div>
          {isValidated && (
            <CheckCircle className="w-5 h-5 text-success" />
          )}
        </div>
        <CardDescription>{step.description}</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {step.content && (
          <div className="p-4 bg-accent rounded-lg">
            <p className="text-sm">{step.content}</p>
          </div>
        )}

        {step.codeSnippet && showCode && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">Code Snippet</h4>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyCode}
                className="flex items-center gap-2"
              >
                <Copy className="w-4 h-4" />
                Copy
              </Button>
            </div>
            <pre className="p-4 bg-muted rounded-lg text-sm overflow-x-auto">
              <code>{step.codeSnippet}</code>
            </pre>
          </div>
        )}

        <div className="flex gap-2">
          <Button
            onClick={handleAction}
            disabled={isValidated}
            className="bg-gradient-primary hover:shadow-elevated transition-all duration-200"
          >
            {isValidated ? (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Completed
              </>
            ) : (
              step.action || 'Complete Step'
            )}
          </Button>

          {step.id === 'checkout-button' && showCode && !isValidated && (
            <Button
              variant="outline"
              onClick={() => {
                setIsValidated(true);
                onComplete();
              }}
            >
              Mark as Done
            </Button>
          )}

          {step.id === 'search-transaction' && (
            <Button variant="outline" size="sm">
              <ExternalLink className="w-4 h-4 mr-2" />
              Open Dashboard
            </Button>
          )}
        </div>

        {step.validationText && isValidated && (
          <div className="flex items-center gap-2 text-sm text-success">
            <CheckCircle className="w-4 h-4" />
            {step.validationText}
          </div>
        )}
      </CardContent>
    </Card>
  );
}