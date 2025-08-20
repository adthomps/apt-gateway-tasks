import { useState, useEffect } from "react";
import { WelcomeModal } from "./WelcomeModal";
import { OnboardingSidebar, OnboardingStep } from "./OnboardingSidebar";
import { StepCard } from "./StepCard";
import { Button } from "@/components/ui/button";
import { CheckCircle, Sparkles } from "lucide-react";

const generateStepsFromGoal = (goal: string): OnboardingStep[] => {
  const baseSteps = [
    {
      id: 'test-mode',
      title: 'Confirm Test Mode',
      description: 'Ensure you\'re in test mode for safe development',
      action: 'Confirm Test Mode',
      content: 'Test mode allows you to simulate payments without real transactions. Always develop in test mode first.',
      validationText: 'Test mode confirmed'
    },
    {
      id: 'api-keys',
      title: 'Generate API Keys',
      description: 'Create your publishable and secret keys',
      action: 'Generate Keys',
      content: 'API keys authenticate your application with our payment system. Keep your secret key secure.',
      validationText: 'API keys generated successfully'
    },
    {
      id: 'checkout-button',
      title: 'Create Checkout Button',
      description: 'Add a payment button to your website',
      action: 'Show Code',
      content: 'This button will redirect customers to a secure checkout page.',
      codeSnippet: `<script src="https://js.payflow.com/v3/"></script>
<button id="checkout-button">Buy Now</button>
<script>
  document.getElementById('checkout-button').addEventListener('click', function() {
    PayFlow.redirectToCheckout({
      items: [{
        price: 'price_1234567890',
        quantity: 1,
      }],
      mode: 'payment',
      successUrl: 'https://your-website.com/success',
      cancelUrl: 'https://your-website.com/cancel',
    });
  });
</script>`,
      validationText: 'Checkout button code ready'
    },
    {
      id: 'copy-code',
      title: 'Copy Integration Code',
      description: 'Copy the code snippet to your website',
      action: 'Copy Code',
      content: 'Paste this code into your HTML file where you want the checkout button to appear.',
      validationText: 'Code copied to clipboard'
    },
    {
      id: 'email-notifications',
      title: 'Confirm Email Notifications',
      description: 'Set up payment confirmation emails',
      action: 'Enable Notifications',
      content: 'Email notifications keep you and your customers informed about payment status.',
      validationText: 'Email notifications enabled'
    },
    {
      id: 'search-transaction',
      title: 'Search Transactions',
      description: 'Learn to view and manage payments',
      action: 'View Dashboard',
      content: 'The transaction dashboard shows all your payments, refunds, and customer details.',
      validationText: 'Dashboard accessed successfully'
    }
  ];

  // Customize steps based on goal
  if (goal.toLowerCase().includes('subscription')) {
    baseSteps[2] = {
      ...baseSteps[2],
      title: 'Create Subscription Button',
      description: 'Add a recurring payment button',
      codeSnippet: baseSteps[2].codeSnippet?.replace('mode: \'payment\'', 'mode: \'subscription\'')
    };
  }

  return baseSteps.map(step => ({
    ...step,
    status: 'pending' as const
  }));
};

export function OnboardingFlow() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [userGoal, setUserGoal] = useState("");
  const [steps, setSteps] = useState<OnboardingStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (steps.length > 0 && currentStep < steps.length) {
      setSteps(prev => prev.map((step, index) => ({
        ...step,
        status: index < currentStep ? 'completed' : index === currentStep ? 'active' : 'pending'
      })));
    }
  }, [currentStep, steps.length]);

  const handleWelcomeComplete = (goal: string) => {
    setUserGoal(goal);
    const generatedSteps = generateStepsFromGoal(goal);
    setSteps(generatedSteps);
    setShowWelcome(false);
    setCurrentStep(0);
  };

  const handleStepComplete = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setIsComplete(true);
    }
  };

  const handleRestart = () => {
    setShowWelcome(true);
    setUserGoal("");
    setSteps([]);
    setCurrentStep(0);
    setIsComplete(false);
  };

  if (isComplete) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <div className="space-y-4">
            <div className="mx-auto w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center shadow-glow">
              <CheckCircle className="w-10 h-10 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Congratulations! 🎉
            </h1>
            <p className="text-xl text-muted-foreground">
              You've successfully completed the PayFlow setup
            </p>
          </div>
          
          <div className="p-6 bg-gradient-secondary rounded-lg border">
            <h2 className="text-lg font-semibold mb-2">Your Goal: "{userGoal}"</h2>
            <p className="text-muted-foreground mb-4">
              You're now ready to accept payments! Your integration is live in test mode.
            </p>
            <div className="flex gap-3 justify-center">
              <Button className="bg-gradient-primary hover:shadow-elevated">
                Go to Dashboard
              </Button>
              <Button variant="outline" onClick={handleRestart}>
                Start New Setup
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <WelcomeModal 
        open={showWelcome} 
        onComplete={handleWelcomeComplete}
      />
      
      {!showWelcome && (
        <div className="min-h-screen bg-background flex">
          <OnboardingSidebar 
            steps={steps}
            currentStep={currentStep}
          />
          
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="space-y-2">
                <h1 className="text-2xl font-bold">Setting up: {userGoal}</h1>
                <p className="text-muted-foreground">
                  Complete each step below to get your payment system ready
                </p>
              </div>
              
              {steps.map((step, index) => (
                <StepCard
                  key={step.id}
                  step={step}
                  onComplete={handleStepComplete}
                  isActive={index === currentStep}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}