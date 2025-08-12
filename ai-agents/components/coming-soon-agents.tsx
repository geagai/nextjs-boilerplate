"use client"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { 
  TrendingUp, 
  MessageSquare, 
  FileText, 
  Code, 
  Volume2, 
  Newspaper, 
  Target, 
  Heart, 
  BarChart3, 
  Share2 
} from 'lucide-react'

interface ComingSoonAgent {
  id: string
  name: string
  description: string
  icon: React.ReactNode
}

const comingSoonAgents: ComingSoonAgent[] = [
  {
    id: 'crypto-analysis',
    name: 'Cryptocurrency Analysis Agent',
    description: 'Get predictions on crypto prices of any cryptocurrency for a 1 to 24 hour timeframe for short term crypto trading and options contracts.',
    icon: <TrendingUp className="w-12 h-12" />
  },
  {
    id: 'customer-support',
    name: 'Customer Support Agent',
    description: 'An embedable agent that is connected to your CRM and can answer customer inquiries about your business, orders, shipping times and more.',
    icon: <MessageSquare className="w-12 h-12" />
  },
  {
    id: 'pdf-analyzer',
    name: 'PDF Analyzer',
    description: 'Upload a PDF or report and get detailed answers about any questions.',
    icon: <FileText className="w-12 h-12" />
  },
  {
    id: 'code-generation',
    name: 'Code Generation Agent',
    description: 'Writes, reviews, and documents code automatically for faster development workflows.',
    icon: <Code className="w-12 h-12" />
  },
  {
    id: 'text-to-speech',
    name: 'Text to Speech Agent',
    description: 'Transforms blog posts into audio content for accessibility and content repurposing.',
    icon: <Volume2 className="w-12 h-12" />
  },
  {
    id: 'local-news',
    name: 'Local News Aggregator Agent',
    description: 'Fetches, filters, and summarizes neighborhood news for local market insights.',
    icon: <Newspaper className="w-12 h-12" />
  },
  {
    id: 'lead-generation',
    name: 'Lead Generation Agent',
    description: 'Scrapes, scores, and organizes sales leads to accelerate your sales pipeline.',
    icon: <Target className="w-12 h-12" />
  },
  {
    id: 'health-fitness',
    name: 'Health & Fitness Coach Agent',
    description: 'Personalized workout plans, nutrition advice, and health tracking for your fitness journey.',
    icon: <Heart className="w-12 h-12" />
  },
  {
    id: 'product-launch',
    name: 'Product Launch Intelligence Agent',
    description: 'Competitive research and sentiment analysis to optimize your product launch strategy.',
    icon: <BarChart3 className="w-12 h-12" />
  },
  {
    id: 'social-media',
    name: 'Social Media Post Generator Agent',
    description: 'Creates engaging social media content tailored to your brand voice and audience.',
    icon: <Share2 className="w-12 h-12" />
  }
]

export function ComingSoonAgents() {
  return (
    <div className="mt-16">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Coming Soon</h2>
        <p className="text-muted-foreground">Exciting new AI agents are in development</p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {comingSoonAgents.map((agent) => (
          <Card key={agent.id} className="flex flex-col relative min-h-[220px] opacity-75">
            <div className="absolute top-4 right-4 text-muted-foreground">
              {agent.icon}
            </div>
            <CardHeader>
              <CardTitle className="text-primary pr-10">{agent.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col h-full justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  {agent.description}
                </p>
              </div>
              <div className="flex justify-end mt-4">
                <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                  Coming Soon
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
