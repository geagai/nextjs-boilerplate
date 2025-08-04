
'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { hexToHsl } from '@/lib/utils'

interface FaqItem {
  question: string
  answer: string
}

interface PricingFAQProps {
  faqs?: FaqItem[] | null
  headerBackgroundColor?: string | null
  darkHeaderBackgroundColor?: string | null
}

const defaultFaqs: FaqItem[] = [
    {
      question: "Is there a free trial available?",
      answer:
        "Yes, you can try our service for free for 14 days. If you want, we’ll provide you with a free, personalized 30-minute onboarding call to get you up and running as soon as possible.",
    },
    {
      question: "Can I change my plan later?",
      answer:
        "Of course. Our pricing scales with your company. Chat to our friendly team to find a solution that works for you.",
    },
    {
      question: "What is your cancellation policy?",
      answer:
        "We understand that things change. You can cancel your plan at any time and we’ll refund you the difference already paid.",
    },
    {
      question: "Can other info be added to an invoice?",
      answer:
        "Yes, you can try our service for free for 14 days. If you want, we’ll provide you with a free, personalized 30-minute onboarding call to get you up and running as soon as possible.",
    },
    {
      question: "How does billing work?",
      answer:
        "Of course. Our pricing scales with your company. Chat to our friendly team to find a solution that works for you.",
    },
    {
      question: "How do I change my account email?",
      answer:
        "We understand that things change. You can cancel your plan at any time and we’ll refund you the difference already paid.",
    },
]

export function PricingFAQ({ faqs, headerBackgroundColor, darkHeaderBackgroundColor }: PricingFAQProps) {
  const faqList = faqs && faqs.length > 0 ? faqs : defaultFaqs

  const lightBg = headerBackgroundColor ? hexToHsl(headerBackgroundColor) : 'hsl(var(--header-bg))'
  const darkBg = darkHeaderBackgroundColor ? hexToHsl(darkHeaderBackgroundColor) : 'hsl(var(--header-bg))'

  return (
    <section className="mt-24">
      {/* Only set margin-top: 0 for h3.flex in this section */}
      <style>{`section.mt-24 h3.flex { margin-top: 0 !important; }`}</style>
      <div className="max-w-3xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-8 text-headline">
          Frequently Asked Questions
        </h2>
        <Accordion type="single" collapsible className="w-full">
          {faqList.map((faq, index) => (
            <AccordionItem
              value={`item-${index}`}
              key={index}
              className="border border-[#d8d8d8] rounded-lg mb-2 overflow-hidden"
              style={{ '--light-bg': lightBg, '--dark-bg': darkBg } as React.CSSProperties}
            >
              <AccordionTrigger 
                className="text-lg font-medium text-left px-6 py-4 bg-[var(--light-bg)] dark:bg-[var(--dark-bg)] hover:no-underline"
              >
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-base text-paragraph px-6 pt-4 pb-6">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
