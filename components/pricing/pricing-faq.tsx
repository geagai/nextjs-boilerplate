
'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

const faqs = [
  {
    question: 'What is NextGeag BP?',
    answer: 'NextGeag BP is a comprehensive Next.js 15 boilerplate that includes authentication, payments, mobile support, and enterprise-grade features. It\'s designed to help developers ship production-ready applications faster.'
  },
  {
    question: 'Can I upgrade or downgrade my plan anytime?',
    answer: 'Yes, you can upgrade or downgrade your plan at any time. Changes will be prorated and reflected in your next billing cycle.'
  },
  {
    question: 'Is there a free trial?',
    answer: 'Yes, all paid plans come with a 14-day free trial. You can cancel anytime during the trial period without being charged.'
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards (Visa, MasterCard, American Express) and PayPal through our secure Stripe integration.'
  },
  {
    question: 'Do you offer refunds?',
    answer: 'Yes, we offer a 30-day money-back guarantee. If you\'re not satisfied with NextGeag BP, contact us for a full refund.'
  },
  {
    question: 'Is the source code included?',
    answer: 'Yes, you get full access to the source code. You can modify, customize, and deploy it however you like.'
  },
  {
    question: 'What kind of support do you provide?',
    answer: 'Free plan includes community support, Starter and Pro plans include email support, and Elite plan includes dedicated support with SLA guarantees.'
  },
  {
    question: 'Can I use this for commercial projects?',
    answer: 'Yes, all plans include commercial usage rights. You can use NextGeag BP to build and sell your own applications.'
  }
]

export function PricingFAQ() {
  const [openItems, setOpenItems] = useState<number[]>([])

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="max-w-4xl mx-auto"
    >
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
        <p className="text-xl text-muted-foreground">
          Everything you need to know about NextGeag BP
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="border rounded-lg overflow-hidden"
          >
            <button
              onClick={() => toggleItem(index)}
              className="w-full px-6 py-4 text-left bg-card hover:bg-muted/50 transition-colors flex items-center justify-between"
            >
              <span className="font-medium">{faq.question}</span>
              {openItems.includes(index) ? (
                <ChevronUp className="h-5 w-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-5 w-5 text-muted-foreground" />
              )}
            </button>
            
            {openItems.includes(index) && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="px-6 py-4 bg-muted/30 border-t"
              >
                <p className="text-muted-foreground leading-relaxed">
                  {faq.answer}
                </p>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      <div className="text-center mt-12">
        <p className="text-muted-foreground mb-4">
          Still have questions? We're here to help.
        </p>
        <a 
          href="mailto:hello@nextgeag-bp.com"
          className="text-primary hover:underline font-medium"
        >
          Contact our support team
        </a>
      </div>
    </motion.section>
  )
}
