// src/components/FAQ.js
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, ChevronDown, ChevronUp } from "lucide-react";
import PageHeader from '../components/PageHeader';
import SectionContainer from '../components/SectionContainer';
import AnimatedElement from '../components/AnimatedElement';

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqItems = [
    {
      question: "What is LocalLink?",
      answer:
        "LocalLink is a unified platform that offers trusted home services like plumbing, pest control, and cleaning, along with essential home maintenance products. We connect you with verified professionals who deliver high-quality services at your doorstep.",
      category: "General"
    },
    {
      question: "How do I book a service?",
      answer:
        "Simply browse the Home Services section, choose the service you need, and schedule a time slot that works for you. Our intuitive booking process allows you to specify your requirements, select add-ons, and make secure payments online.",
      category: "Booking"
    },
    {
      question: "Are your service providers verified?",
      answer:
        "Yes, every professional listed on LocalLink undergoes strict background verification. We check their identity, professional credentials, and conduct thorough background checks. All professionals are also trained to follow our service standards and safety protocols.",
      category: "Safety & Quality"
    },
    {
      question: "What if I'm not satisfied with the service?",
      answer: 
        "Your satisfaction is our priority. If you're not satisfied with the service, you can report the issue within 24 hours, and we'll send a professional to fix it free of charge. In some cases, we also offer refunds as per our service guarantee policy.",
      category: "Policy"
    },
    {
      question: "Can I reschedule or cancel my booking?",
      answer: 
        "Yes, you can reschedule or cancel your booking through the app or website. Rescheduling is free if done at least 3 hours before the scheduled time. For cancellations, please refer to our cancellation policy for applicable charges.",
      category: "Booking"
    },
    {
      question: "How are your prices determined?",
      answer: 
        "Our prices are standardized based on market rates and the complexity of the service. We provide transparent pricing with no hidden charges. The final price you see during booking includes all taxes and service charges.",
      category: "Pricing"
    },
    {
      question: "Do you offer any warranty on services?",
      answer: 
        "Yes, most of our services come with a service warranty ranging from 7 days to 6 months, depending on the service type. The warranty details are clearly mentioned on the service page before you book.",
      category: "Policy"
    },
    {
      question: "How can I pay for services?",
      answer: 
        "We accept multiple payment methods including credit/debit cards, net banking, UPI, and digital wallets. You can also pay in cash after the service is completed, though we encourage digital payments for contactless transactions.",
      category: "Payment"
    }
  ];

  // Group FAQs by category
  const groupedFAQs = faqItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <div className="bg-background dark">
      {/* Hero Section */}
      <PageHeader 
        title="Frequently Asked Questions"
        description="Everything you need to know about LocalLink services and policies"
        icon={HelpCircle}
      />

      {/* FAQ Accordion Section */}
      <SectionContainer>
        <div className="max-w-4xl mx-auto">
          {Object.entries(groupedFAQs).map(([category, items], categoryIndex) => (
            <AnimatedElement 
              key={category} 
              animation="fadeInUp" 
              delay={categoryIndex * 0.1}
              className="mb-12"
            >
              <h2 className="text-2xl font-bold mb-6 gradient-text inline-block relative">
                {category} Questions
                <motion.div 
                  className="absolute -bottom-1 left-0 h-1 w-20 bg-gradient-to-r from-secondary via-primary to-accent rounded-full"
                  animate={{ 
                    boxShadow: ['0 0 5px rgba(132, 90, 223, 0.3)', '0 0 15px rgba(132, 90, 223, 0.5)', '0 0 5px rgba(132, 90, 223, 0.3)'] 
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </h2>
              
              <div className="space-y-4">
                {items.map((item, index) => {
                  const isActive = activeIndex === `${category}-${index}`;
                  
                  return (
                    <AnimatedElement
                      key={index}
                      animation="fadeInUp"
                      delay={0.05 * index}
                      className={`border ${isActive ? 'border-primary/40' : 'border-border'} rounded-xl overflow-hidden transition-all duration-300 ${isActive ? 'shadow-lg shadow-primary/10' : ''}`}
                    >
                      <div
                        className={`p-5 flex justify-between items-center cursor-pointer ${isActive ? 'bg-primary/5' : 'bg-card'}`}
                        onClick={() => toggleFAQ(`${category}-${index}`)}
                      >
                        <h3 className={`text-xl font-semibold ${isActive ? 'text-primary' : ''}`}>
                          {item.question}
                        </h3>
                        <div className={`rounded-full p-1 ${isActive ? 'bg-primary/20 text-primary' : 'bg-muted/30 text-muted-foreground'}`}>
                          {isActive ? (
                            <ChevronUp size={20} />
                          ) : (
                            <ChevronDown size={20} />
                          )}
                        </div>
                      </div>
                      
                      <AnimatePresence>
                        {isActive && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="p-5 pt-0 border-t border-border">
                              <p className="text-muted-foreground">{item.answer}</p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </AnimatedElement>
                  );
                })}
              </div>
            </AnimatedElement>
          ))}
        </div>
        
        {/* Contact section */}
        <AnimatedElement 
          animation="fadeInUp"
          className="mt-16 text-center max-w-2xl mx-auto"
        >
          <div className="p-8 glass-panel rounded-2xl border border-primary/20">
            <h3 className="text-2xl font-bold mb-3">Still have questions?</h3>
            <p className="text-muted-foreground mb-5">
              If you couldn't find the answer to your question, our support team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/contact" 
                className="btn btn-primary"
              >
                Contact Support
              </a>
              <a 
                href="tel:+918800088000" 
                className="btn btn-outline"
              >
                Call: +91 88000 88000
              </a>
            </div>
          </div>
        </AnimatedElement>
      </SectionContainer>
    </div>
  );
};

export default FAQ;
