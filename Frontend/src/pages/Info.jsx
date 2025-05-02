import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const Info = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  // const path = location.pathname.split("/").pop();

  // const sectionMap = {
  //   faq: "faq",
  //   refund: "refund",
  //   terms: "terms",
  //   privacy: "privacy",
  //   how: "how",
  //   mission: "mission",
  // };

  // const section = sectionMap[path] || "faq";
  const path = location.pathname.split("/").pop();

// const sectionAlias = {
//   "faq": "faq",
//   "refund-policy": "refund",
//   "terms-and-conditions": "terms",
//   "privacy-policy": "privacy",
//   "how-it-works": "how",
//   "our-mission": "mission"
// };
const sectionAlias = {
  faq: "faq",
  "refund-policy": "refund",
  "terms": "terms",
  "terms-and-conditions": "terms",
  "privacy": "privacy",
  "privacy-policy": "privacy",
  "how": "how",
  "how-it-works": "how",
  "mission": "mission",
  "our-mission": "mission"
};


const section = sectionAlias[path] || "faq";


  const contentMap = {
    faq: {
      title: "FAQs",
      content: [
        {
          question: "What is Local Link?",
          answer:
            "Local Link is a unified platform that offers trusted home services like plumbing, pest control, and cleaning, along with essential home maintenance products."
        },
        {
          question: "How do I book a service?",
          answer:
            "Simply browse the Home Services section, choose the service you need, and schedule a time slot that works for you."
        },
        {
          question: "Are your service providers verified?",
          answer:
            "Yes, every professional listed on Local Link undergoes strict background verification."
        }
      ]
    },
    refund: {
      title: "Refund Policy",
      content: [
        {
          question: "Can I get a refund for services?",
          answer:
            "Yes, refunds are applicable if the service is cancelled before dispatch or if you’re unsatisfied due to verified service issues."
        },
        {
          question: "What about product refunds?",
          answer:
            "Products can be returned within 7 days of delivery, provided they are unused and in original packaging."
        }
      ]
    },
    terms: {
      title: "Terms & Conditions",
      content: [
        {
          question: "Service Usage",
          answer:
            "By using Local Link, you agree to comply with our guidelines, including appropriate conduct, timely payments, and accurate information submission."
        },
        {
          question: "Limitation of Liability",
          answer:
            "We are not liable for indirect damages resulting from service misuse, delays, or third-party actions."
        }
      ]
    },
    privacy: {
      title: "Privacy Policy",
      content: [
        {
          question: "How is my data used?",
          answer:
            "Your data is used only to enhance your experience – like saving preferences, streamlining services, and order history."
        },
        {
          question: "Is my data shared?",
          answer:
            "We do not sell your data. It may be shared with verified partners only to complete your service request."
        }
      ]
    },
    how: {
      title: "How It Works",
      content: [
        {
          question: "Browse & Choose",
          answer:
            "Explore services or products, view ratings, and choose what suits your need."
        },
        {
          question: "Book & Track",
          answer:
            "Book with one tap and track progress or delivery in real-time."
        },
        {
          question: "Review & Repeat",
          answer:
            "Review your experience and rely on Local Link again for future needs."
        }
      ]
    },
    mission: {
      title: "Our Mission",
      content: [
        {
          question: "The EDP Beginning",
          answer:
            "Local Link was born from an Entrepreneurship Development Program, aiming to empower local talent and connect households with trusted, verified services."
        },
        {
          question: "Vision",
          answer:
            "Our vision is to revolutionize local services by offering a modern, tech-enabled, transparent experience."
        },
        {
          question: "Commitment",
          answer:
            "We commit to quality, trust, and accessibility – ensuring every Indian home finds reliable help with a click."
        }
      ]
    }
  };

  const currentContent = contentMap[section];

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
          {currentContent.title}
        </h1>

        <div className="space-y-6">
          {currentContent.content.map((item, index) => (
            <motion.div
              key={index}
              className="bg-blue-50 dark:bg-gray-700 rounded-xl p-6 shadow-md"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-xl font-semibold text-blue-800 dark:text-blue-300 mb-2">
                {item.question}
              </h2>
              <p className="text-gray-700 dark:text-gray-200">
                {item.answer}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Info;
