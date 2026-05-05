'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { updateProfile } from '@/lib/actions/profile'
import { toast } from 'sonner'

interface Step {
  title: string
  description: string
  items: string[]
}

const STEPS: Record<string, Step[]> = {
  founder: [
    {
      title: 'Company Setup',
      description: 'Let\'s get your company details in order.',
      items: ['Complete company profile', 'Upload pitch deck', 'Define target market'],
    },
    {
      title: 'Growth Plan',
      description: 'Tell us about your milestones.',
      items: ['Define Q1 goals', 'Set funding targets', 'Identify key hires'],
    },
  ],
  mentor: [
    {
      title: 'Mentor Profile',
      description: 'Set up your mentoring preferences.',
      items: ['Add expertise tags', 'Set availability', 'Complete bio'],
    },
    {
      title: 'Connection Preferences',
      description: 'How would you like to help?',
      items: ['Select preferred stages', 'Select preferred sectors'],
    },
  ],
  investor: [
    {
      title: 'Investment Thesis',
      description: 'What kind of startups are you looking for?',
      items: ['Select target sectors', 'Define investment range', 'Set preferred stages'],
    },
    {
      title: 'Network Setup',
      description: 'Connect with the ecosystem.',
      items: ['Follow top startups', 'Set alert preferences'],
    },
  ],
}

export function OnboardingFlow({ role }: { role: string }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [completedItems, setCompletedItems] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const steps = STEPS[role.toLowerCase()] || []
  const step = steps[currentStep]

  const toggleItem = (item: string) => {
    setCompletedItems((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    )
  }

  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      setLoading(true)
      try {
        await updateProfile({ onboarding_completed: true })
        toast.success('Onboarding complete!')
        router.push(`/${role.toLowerCase()}`)
      } catch (error) {
        toast.error('Failed to complete onboarding')
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <div className="max-w-md mx-auto py-12">
      <Card className="border-2 border-indigo-100 shadow-xl">
        <CardHeader>
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-black uppercase tracking-widest text-indigo-600">
              Step {currentStep + 1} of {steps.length}
            </span>
            <div className="flex gap-1">
              {steps.map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "h-1 w-8 rounded-full transition-colors",
                    i <= currentStep ? "bg-indigo-600" : "bg-slate-200"
                  )}
                />
              ))}
            </div>
          </div>
          <CardTitle className="text-2xl font-black">{step.title}</CardTitle>
          <CardDescription>{step.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {step.items.map((item) => (
            <div key={item} className="flex items-center space-x-3 p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
              <Checkbox
                id={item}
                checked={completedItems.includes(item)}
                onCheckedChange={() => toggleItem(item)}
              />
              <Label
                htmlFor={item}
                className="text-sm font-bold cursor-pointer flex-1"
              >
                {item}
              </Label>
            </div>
          ))}
        </CardContent>
        <CardFooter>
          <Button
            className="w-full h-12 rounded-xl font-black text-lg shadow-lg shadow-indigo-100"
            onClick={handleNext}
            disabled={loading}
          >
            {currentStep < steps.length - 1 ? 'Next Step' : 'Launch Dashboard'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

import { cn } from '@/lib/utils'
