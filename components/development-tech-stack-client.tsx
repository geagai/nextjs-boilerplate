'use client'

import { motion } from 'framer-motion'

interface DevelopmentTechStackClientProps {
  adminSettings: any
}

export default function DevelopmentTechStackClient({ adminSettings }: DevelopmentTechStackClientProps) {
  const llmModels = [
    "OpenAI GPT-4", "Gemini 2.0", "DeepSeek R1", "Qwen 2.5-Max", "Llama 3.2", 
    "BERT", "LaMDA", "Orca", "Mistral", "PaLM2", "Claude", "Hugging Face Models"
  ]

  const developmentTools = [
    "AutoGen Studio", "CrewAI", "LangChain", "Vector Databases", "Data Lakes",
    "API Architecture", "Microservices", "Docker", "Kubernetes", "Redis", "n8n"
  ]

  const platforms = [
    "AWS", "Google Cloud", "Azure", "Supabase", "MongoDB", "PostgreSQL",
    "Elasticsearch", "Apache Kafka", "GraphQL", "REST APIs"
  ]

  const categories = [
    {
      title: "Large Language Models",
      subtitle: "Industry-leading LLMs with proprietary Model Context Protocols",
      items: llmModels,
      gradient: "from-blue-500/10 to-purple-500/10"
    },
    {
      title: "Development Stack", 
      subtitle: "Cutting-edge tools for memory, logic, and context",
      items: developmentTools,
      gradient: "from-green-500/10 to-blue-500/10"
    },
    {
      title: "Infrastructure & Data",
      subtitle: "Scalable architecture for high-speed retrieval and knowledge grounding",
      items: platforms,
      gradient: "from-purple-500/10 to-pink-500/10"
    }
  ]

  return (
    <section className="py-24 bg-gradient-to-b from-muted/20 to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center max-w-4xl mx-auto mb-16"
        >
          <h2 
            className="text-4xl sm:text-5xl font-bold tracking-tight mb-6 whitespace-nowrap"
            style={{ color: adminSettings?.headline_text_color || adminSettings?.dark_headline_text_color }}
          >
            A Tech Stack Built for Intelligence at Scale
          </h2>
          <p 
            className="text-xl leading-relaxed"
            style={{ color: adminSettings?.paragraph_text_color || adminSettings?.dark_paragraph_text_color }}
          >
            We bring together industry-leading technologies and frameworks to create truly next-generation AI experiences.
          </p>
        </motion.div>

        <div className="space-y-16">
          {categories.map((category, categoryIndex) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: categoryIndex * 0.2 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <h3 
                className="text-2xl sm:text-3xl font-bold mb-4"
                style={{ color: adminSettings?.headline_text_color || adminSettings?.dark_headline_text_color }}
              >
                {category.title}
              </h3>
              <p 
                className="text-lg mb-8 max-w-2xl mx-auto"
                style={{ color: adminSettings?.paragraph_text_color || adminSettings?.dark_paragraph_text_color }}
              >
                {category.subtitle}
              </p>
              
              <div className={`relative p-8 rounded-3xl bg-gradient-to-br ${category.gradient} border border-primary/10`}>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {category.items.map((item, index) => (
                    <motion.div
                      key={item}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="group"
                    >
                      <div 
                        className="p-4 rounded-xl border-2 border-transparent hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer"
                        style={{ backgroundColor: adminSettings?.background_color || '#ffffff' }}
                      >
                        <div 
                          className="text-sm font-semibold text-center group-hover:scale-105 transition-transform duration-300"
                          style={{ color: adminSettings?.paragraph_text_color || adminSettings?.dark_paragraph_text_color }}
                        >
                          {item}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-16 p-8 rounded-3xl border-2" 
          style={{ 
            borderColor: adminSettings?.primary_color || '#3872BB',
            background: `linear-gradient(135deg, ${adminSettings?.primary_color || '#3872BB'}10, transparent)`
          }}
        >
          <h3 
            className="text-2xl font-bold mb-4"
            style={{ color: adminSettings?.headline_text_color || adminSettings?.dark_headline_text_color }}
          >
            Ready to leverage our technology stack?
          </h3>
          <p 
            className="text-lg mb-6 max-w-2xl mx-auto"
            style={{ color: adminSettings?.paragraph_text_color || adminSettings?.dark_paragraph_text_color }}
          >
            Let's discuss how our advanced AI infrastructure can power your next project.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center px-8 py-4 rounded-lg font-semibold text-lg hover:opacity-90 transition-opacity"
            style={{ 
              backgroundColor: adminSettings?.primary_color || adminSettings?.dark_primary_color || '#3872BB',
              color: adminSettings?.button_text_color || '#ffffff'
            }}
          >
            Start Your AI Journey
          </a>
        </motion.div>
      </div>
    </section>
  )
}
