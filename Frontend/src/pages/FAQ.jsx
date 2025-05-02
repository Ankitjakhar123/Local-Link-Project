// src/components/FAQ.js
import React from "react";
import { motion } from "framer-motion";

const FAQ = () => {
  const content = {
    title: "FAQs",
    content: [
      {
        question: "What is Local Link?",
        answer:
          "Local Link is a unified platform that offers trusted home services like plumbing, pest control, and cleaning, along with essential home maintenance products.",
      },
      {
        question: "How do I book a service?",
        answer:
          "Simply browse the Home Services section, choose the service you need, and schedule a time slot that works for you.",
      },
      {
        question: "Are your service providers verified?",
        answer:
          "Yes, every professional listed on Local Link undergoes strict background verification.",
      },
    ],
  };

  return (
    <div className="pt-24 pb-16 bg-background text-foreground">
      {/* Hero Section */}
      <div className="bg-primary/10 py-16">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">{content.title}</h1>
            <p className="text-lg text-muted-foreground">
              Everything you need to know about Local Link services.
            </p>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {content.content.map((item, index) => (
            <motion.div
              key={index}
              className="bg-card border border-border rounded-xl p-6 shadow-sm"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <h3 className="text-xl font-semibold mb-2">{item.question}</h3>
              <p className="text-muted-foreground">{item.answer}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;
