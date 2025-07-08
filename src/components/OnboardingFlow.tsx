'use client'

import { useState, useEffect } from 'react'
import { X, ChevronRight, ChevronLeft, Zap, FileText, Shield, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface OnboardingStep {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  highlight?: string
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Darrow',
    description: 'Your AI-powered legal document assistant. Create professional legal documents in minutes.',
    icon: <Sparkles className="h-8 w-8" />,
    highlight: 'Generate 3 documents per day'
  },
  {
    id: 'documents',
    title: '5 Document Types Supported',
    description: 'From Delaware Charters to YC SAFEs, we support the most common startup legal documents.',
    icon: <FileText className="h-8 w-8" />,
    highlight: 'Delaware Charter, YC SAFE, Offer Letter, RSPA, Board Consent'
  },
  {
    id: 'ai-powered',
    title: 'AI-Powered Generation',
    description: 'Our AI fills in legal templates with your information while preserving all legal language.',
    icon: <Zap className="h-8 w-8" />,
    highlight: 'Never modifies legal language'
  },
  {
    id: 'secure',
    title: 'Secure & Professional',
    description: 'Export to DOCX and PDF formats. Your documents are stored securely and privately.',
    icon: <Shield className="h-8 w-8" />,
    highlight: 'Professional exports with proper formatting'
  }
]

interface OnboardingFlowProps {
  isOpen: boolean
  onClose: () => void
  onComplete: () => void
}

export default function OnboardingFlow({ isOpen, onClose, onComplete }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const goToNextStep = () => {
    if (isAnimating) return
    
    if (currentStep < onboardingSteps.length - 1) {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentStep(currentStep + 1)
        setIsAnimating(false)
      }, 150)
    } else {
      handleComplete()
    }
  }

  const goToPreviousStep = () => {
    if (isAnimating) return
    
    if (currentStep > 0) {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentStep(currentStep - 1)
        setIsAnimating(false)
      }, 150)
    }
  }

  const handleComplete = () => {
    onComplete()
    onClose()
  }

  const handleSkip = () => {
    onComplete()
    onClose()
  }

  if (!isOpen) return null

  const currentStepData = onboardingSteps[currentStep]
  const isLastStep = currentStep === onboardingSteps.length - 1

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-90 backdrop-blur-sm animate-fade-in"
        onClick={handleSkip}
      />
      
      {/* Modal */}
      <div className="relative bg-black border border-silver rounded-lg shadow-2xl max-w-lg w-full animate-scale-in">
        {/* Close Button */}
        <button
          onClick={handleSkip}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-800 transition-colors z-10"
          aria-label="Skip onboarding"
        >
          <X className="w-5 h-5 text-gray-light hover:text-white" />
        </button>

        {/* Progress Bar */}
        <div className="px-8 pt-6">
          <div className="flex justify-between text-xs text-gray-light mb-2">
            <span>Step {currentStep + 1} of {onboardingSteps.length}</span>
            <span>{Math.round(((currentStep + 1) / onboardingSteps.length) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-1">
            <div 
              className="bg-silver h-1 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${((currentStep + 1) / onboardingSteps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="px-8 py-8">
          <div className={cn(
            "transition-all duration-300",
            isAnimating ? "opacity-0 transform translate-x-4" : "opacity-100 transform translate-x-0"
          )}>
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-silver bg-opacity-20 rounded-full text-silver animate-glow">
                {currentStepData.icon}
              </div>
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-white text-center mb-4">
              {currentStepData.title}
            </h2>

            {/* Description */}
            <p className="text-gray-light text-center mb-6 leading-relaxed">
              {currentStepData.description}
            </p>

            {/* Highlight */}
            {currentStepData.highlight && (
              <div className="bg-silver bg-opacity-10 border border-silver border-opacity-30 rounded-lg p-4 mb-6">
                <p className="text-silver text-sm text-center font-medium">
                  ✨ {currentStepData.highlight}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="px-8 pb-6">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={goToPreviousStep}
              disabled={currentStep === 0}
              className="gap-2"
            >
              <ChevronLeft size={16} />
              Previous
            </Button>

            <div className="flex gap-2">
              {onboardingSteps.map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all duration-300",
                    index === currentStep 
                      ? "bg-silver scale-125" 
                      : index < currentStep 
                        ? "bg-silver opacity-60" 
                        : "bg-gray-600"
                  )}
                />
              ))}
            </div>

            <Button
              onClick={goToNextStep}
              className="gap-2"
            >
              {isLastStep ? 'Get Started' : 'Next'}
              {!isLastStep && <ChevronRight size={16} />}
            </Button>
          </div>

          {/* Skip Link */}
          <div className="text-center mt-4">
            <button
              onClick={handleSkip}
              className="text-gray-light hover:text-white text-sm transition-colors"
            >
              Skip tutorial
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Hook to manage onboarding state
 */
export function useOnboarding() {
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(true) // Default to true for now
  const [showOnboarding, setShowOnboarding] = useState(false)

  useEffect(() => {
    // Check if user has seen onboarding (check both new and legacy keys)
    const seen = localStorage.getItem('darrow-onboarding-seen') || localStorage.getItem('ai-law-agent-onboarding-seen')
    if (!seen) {
      setHasSeenOnboarding(false)
      setShowOnboarding(true)
    }
  }, [])

  const completeOnboarding = () => {
    localStorage.setItem('darrow-onboarding-seen', 'true')
    // Also remove legacy key if it exists
    localStorage.removeItem('ai-law-agent-onboarding-seen')
    setHasSeenOnboarding(true)
    setShowOnboarding(false)
  }

  const resetOnboarding = () => {
    localStorage.removeItem('darrow-onboarding-seen')
    localStorage.removeItem('ai-law-agent-onboarding-seen')
    setHasSeenOnboarding(false)
    setShowOnboarding(true)
  }

  return {
    hasSeenOnboarding,
    showOnboarding,
    setShowOnboarding,
    completeOnboarding,
    resetOnboarding
  }
}