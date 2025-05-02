// src/components/Refund.js
import React from "react";
import { motion } from "framer-motion";

const Refund = () => {
  const content = {
    title: "Refund Policy",
    content: [
      {
        question: "Can I get a refund for services?",
        answer:
          "Yes, refunds are applicable if the service is cancelled before dispatch or if you’re unsatisfied due to verified service issues.",
      },
      {
        question: "What about product refunds?",
        answer:
          "Products can be returned within 7 days of delivery, provided they are unused and in original packaging.",
      },
    ],
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-r from-blue-100 to-green-100 dark:from-gray-900 dark:to-gray-950 flex flex-col items-center justify-start py-16 px-4 mt-20 overflow-hidden">
      {/* Decorative Circles */}
      <div className="absolute top-[-60px] left-[-40px] w-72 h-72 bg-blue-400 opacity-20 blur-[120px] rounded-full z-0"></div>
      <div className="absolute bottom-[-60px] right-[-40px] w-72 h-72 bg-purple-500 opacity-20 blur-[120px] rounded-full z-0"></div>

      <motion.div
        className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-4xl w-full p-8 space-y-8 relative z-10"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h1 className="text-4xl font-bold text-center text-gray-800 dark:text-white">
          {content.title}
        </h1>

        <div className="space-y-6">
          {content.content.map((item, index) => (
            <motion.div
              key={index}
              className="bg-blue-50 dark:bg-gray-700 rounded-xl p-6 shadow-md"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-xl font-semibold text-blue-800 dark:text-blue-300 mb-2">
                {item.question}
              </h2>
              <p className="text-gray-700 dark:text-gray-200">{item.answer}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Refund;
