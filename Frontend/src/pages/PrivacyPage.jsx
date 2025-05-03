import React, { useEffect, useState } from 'react';
import { ArrowLeft, Lock, FileText, Shield, Eye, Database, AlertCircle, Key, Globe } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import SectionContainer from '../components/SectionContainer';
import AnimatedElement from '../components/AnimatedElement';

const PrivacyPage = () => {
  const location = useLocation();
  const [pageTitle, setPageTitle] = useState("Privacy Policy");
  const [pageDescription, setPageDescription] = useState("How we collect, use, and protect your personal information");
  const [pageIcon, setPageIcon] = useState(Lock);

  useEffect(() => {
    // Check for hash fragments and set appropriate title and description
    if (location.hash === "#data-collection") {
      setPageTitle("Data Collection");
      setPageDescription("Information we collect about users and how it's gathered");
      setPageIcon(Database);
      
      // Scroll to the section after a short delay
      setTimeout(() => {
        const element = document.getElementById('data-collection');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else if (location.hash === "#data-usage") {
      setPageTitle("How We Use Your Data");
      setPageDescription("Learn how we utilize the information we collect");
      setPageIcon(Eye);
    } else if (location.hash === "#data-protection") {
      setPageTitle("Data Security");
      setPageDescription("How we protect your information and keep it secure");
      setPageIcon(Shield);
    } else if (location.hash === "#user-rights") {
      setPageTitle("Your Privacy Rights");
      setPageDescription("Understanding your rights regarding your personal data");
      setPageIcon(Key);
    } else {
      setPageTitle("Privacy Policy");
      setPageDescription("How we collect, use, and protect your personal information");
      setPageIcon(Lock);
    }
  }, [location.hash]);

  return (
    <div className="bg-background dark">
      {/* Hero Section */}
      <PageHeader 
        title={pageTitle}
        description={pageDescription}
        icon={pageIcon}
      />

      {/* Privacy Policy Content */}
      <SectionContainer>
        <div className="max-w-4xl mx-auto">
          {/* Quick links */}
          <AnimatedElement animation="fadeInDown" className="mb-10">
            <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-primary/10 p-6">
              <h2 className="text-xl font-bold mb-4">Privacy Policy Sections</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { name: "Data Collection", href: "#data-collection", icon: Database },
                  { name: "Data Usage", href: "#data-usage", icon: Eye },
                  { name: "Data Protection", href: "#data-protection", icon: Shield },
                  { name: "Your Rights", href: "#user-rights", icon: Key },
                ].map((link, index) => (
                  <a 
                    key={index}
                    href={link.href}
                    className="flex items-center gap-2 p-3 rounded-xl bg-background/50 border border-border hover:border-primary/30 hover:bg-primary/5 transition-all duration-300"
                  >
                    <link.icon size={18} className="text-primary" />
                    <span className="text-sm font-medium">{link.name}</span>
                  </a>
                ))}
              </div>
            </div>
          </AnimatedElement>

          {/* Last Updated */}
          <AnimatedElement animation="fadeInUp" className="mb-8">
            <div className="text-muted-foreground text-sm">
              Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </div>
          </AnimatedElement>

          {/* Introduction */}
          <AnimatedElement animation="fadeInUp" className="mb-12">
            <div className="glass-panel rounded-2xl p-8 border border-primary/10">
              <h2 className="text-2xl font-bold mb-6 gradient-text inline-block">
                Introduction
              </h2>
              
              <div className="space-y-6 text-muted-foreground">
                <p>
                  LocalLink ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website, mobile application, and services (collectively, the "Service").
                </p>
                <p>
                  By accessing or using our Service, you consent to the collection, use, disclosure, and protection of your information as described in this Privacy Policy. If you do not agree with our policies and practices, do not use our Service.
                </p>
                <p>
                  We may change this Privacy Policy from time to time. We will post any changes on this page and update the "Last Updated" date. We encourage you to review this Privacy Policy periodically.
                </p>
              </div>
            </div>
          </AnimatedElement>

          {/* Data Collection Section */}
          <AnimatedElement animation="fadeInUp" className="mb-12" id="data-collection">
            <div className="cyber-card rounded-2xl p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 rounded-full bg-primary/10 text-primary">
                  <Database size={24} />
                </div>
                <h2 className="text-2xl font-bold gradient-text">Information We Collect</h2>
              </div>
              
              <div className="space-y-6 text-muted-foreground">
                <p>
                  We collect several types of information from and about users of our Service, including:
                </p>
                
                <h3 className="text-lg font-semibold text-foreground">1. Personal Information</h3>
                <p>
                  Personal information is data that can be used to identify you directly or indirectly. We collect the following types of personal information:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong className="text-foreground">Identity Data:</strong> Name, date of birth, gender, profile picture, and government-issued ID (for service providers only).</li>
                  <li><strong className="text-foreground">Contact Data:</strong> Email address, phone number, billing address, and delivery address.</li>
                  <li><strong className="text-foreground">Financial Data:</strong> Payment method details, bank account information (for service providers only).</li>
                  <li><strong className="text-foreground">Transaction Data:</strong> Details of services and products you have purchased, payment history, and service feedback.</li>
                  <li><strong className="text-foreground">Profile Data:</strong> Username, password, preferences, service history, and customer support interactions.</li>
                </ul>
                
                <h3 className="text-lg font-semibold text-foreground">2. Automatically Collected Information</h3>
                <p>
                  When you use our Service, we automatically collect certain information, including:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong className="text-foreground">Device Data:</strong> Information about your device, such as IP address, device type, operating system, browser type, and device identifiers.</li>
                  <li><strong className="text-foreground">Usage Data:</strong> Information about how you use our Service, such as the pages you visit, the time and duration of your visits, and the services you view or search for.</li>
                  <li><strong className="text-foreground">Location Data:</strong> With your permission, we collect your precise or approximate location to provide location-based services.</li>
                  <li><strong className="text-foreground">Cookies and Similar Technologies:</strong> We use cookies and similar tracking technologies to track activity on our Service and to hold certain information.</li>
                </ul>
                
                <h3 className="text-lg font-semibold text-foreground">3. Information from Third Parties</h3>
                <p>
                  We may receive information about you from third parties, including:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong className="text-foreground">Social Media:</strong> When you connect your social media accounts to our Service.</li>
                  <li><strong className="text-foreground">Business Partners:</strong> Information from our business partners, such as payment processors and service providers.</li>
                  <li><strong className="text-foreground">Public Sources:</strong> Information available in public databases or directories.</li>
                </ul>
              </div>
            </div>
          </AnimatedElement>

          {/* Data Usage Section */}
          <AnimatedElement animation="fadeInUp" className="mb-12" id="data-usage">
            <div className="glass-panel rounded-2xl p-8 border border-primary/10">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 rounded-full bg-secondary/10 text-secondary">
                  <Eye size={24} />
                </div>
                <h2 className="text-2xl font-bold gradient-text">How We Use Your Information</h2>
              </div>
              
              <div className="space-y-6 text-muted-foreground">
                <p>
                  We use the information we collect for various purposes, including:
                </p>
                
                <h3 className="text-lg font-semibold text-foreground">1. Providing the Service</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>To facilitate and manage your bookings and orders.</li>
                  <li>To process payments and refunds.</li>
                  <li>To connect you with appropriate service professionals.</li>
                  <li>To provide customer support and respond to your inquiries.</li>
                  <li>To send service updates, confirmations, and reminders.</li>
                </ul>
                
                <h3 className="text-lg font-semibold text-foreground">2. Improving and Developing the Service</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>To analyze usage patterns and trends.</li>
                  <li>To diagnose technical problems and maintain the security of our Service.</li>
                  <li>To develop new features, products, and services.</li>
                  <li>To conduct research and analysis to improve user experience.</li>
                </ul>
                
                <h3 className="text-lg font-semibold text-foreground">3. Marketing and Communication</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>To send promotional messages, offers, and updates about our services (with your consent where required).</li>
                  <li>To personalize your experience and deliver content and product/service offerings relevant to your interests.</li>
                  <li>To administer contests, promotions, surveys, or other site features.</li>
                </ul>
                
                <h3 className="text-lg font-semibold text-foreground">4. Legal and Safety Purposes</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>To comply with legal obligations and regulatory requirements.</li>
                  <li>To enforce our terms, conditions, and policies.</li>
                  <li>To prevent, detect, and address fraud, unauthorized access, and other illegal activities.</li>
                  <li>To protect the rights, property, or safety of LocalLink, our users, and the public.</li>
                </ul>
              </div>
            </div>
          </AnimatedElement>

          {/* Data Sharing Section */}
          <AnimatedElement animation="fadeInUp" className="mb-12">
            <div className="cyber-card rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-6 gradient-text inline-block">
                How We Share Your Information
              </h2>
              
              <div className="space-y-6 text-muted-foreground">
                <p>
                  We may share your information with third parties in the following circumstances:
                </p>
                
                <h3 className="text-lg font-semibold text-foreground">1. Service Providers</h3>
                <p>
                  We share information with service providers who perform services on our behalf, such as:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Payment processing companies</li>
                  <li>Cloud storage providers</li>
                  <li>Customer support services</li>
                  <li>Analytics providers</li>
                  <li>Marketing and advertising partners</li>
                </ul>
                
                <h3 className="text-lg font-semibold text-foreground">2. Service Professionals</h3>
                <p>
                  When you book a service, we share your information with the service professional who will provide the service, including:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Your name and contact information</li>
                  <li>Service location</li>
                  <li>Service details and special instructions</li>
                </ul>
                
                <h3 className="text-lg font-semibold text-foreground">3. Business Transfers</h3>
                <p>
                  If LocalLink is involved in a merger, acquisition, or sale of all or a portion of its assets, your information may be transferred as part of that transaction. We will notify you via email and/or a prominent notice on our Service of any change in ownership or uses of your information.
                </p>
                
                <h3 className="text-lg font-semibold text-foreground">4. Legal Requirements</h3>
                <p>
                  We may disclose your information if required to do so by law or in response to valid requests by public authorities (e.g., a court or government agency).
                </p>
                
                <h3 className="text-lg font-semibold text-foreground">5. With Your Consent</h3>
                <p>
                  We may share your information with third parties when you have given us your consent to do so.
                </p>
              </div>
            </div>
          </AnimatedElement>

          {/* Data Protection Section */}
          <AnimatedElement animation="fadeInUp" className="mb-12" id="data-protection">
            <div className="glass-panel rounded-2xl p-8 border border-primary/10">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 rounded-full bg-accent/10 text-accent">
                  <Shield size={24} />
                </div>
                <h2 className="text-2xl font-bold gradient-text">Data Security</h2>
              </div>
              
              <div className="space-y-6 text-muted-foreground">
                <p>
                  We implement appropriate technical and organizational measures to protect your information from unauthorized access, alteration, disclosure, or destruction.
                </p>
                
                <h3 className="text-lg font-semibold text-foreground">1. Security Measures</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>All sensitive/credit information you supply is encrypted via Secure Socket Layer (SSL) technology.</li>
                  <li>We implement access controls, firewalls, and regular security audits.</li>
                  <li>We regularly review our security procedures to ensure they remain effective and up-to-date.</li>
                  <li>We limit access to personal information to employees, contractors, and service providers who need to know that information to perform their job functions.</li>
                </ul>
                
                <h3 className="text-lg font-semibold text-foreground">2. Data Retention</h3>
                <p>
                  We retain your information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law. We will securely delete or anonymize your information when it is no longer needed.
                </p>
                
                <h3 className="text-lg font-semibold text-foreground">3. Third-Party Security</h3>
                <p>
                  While we take steps to protect your information, please be aware that no security measures are perfect or impenetrable. We cannot guarantee the security of your information transmitted to our Service. Any transmission of information is at your own risk.
                </p>
                
                <h3 className="text-lg font-semibold text-foreground">4. Data Breach</h3>
                <p>
                  In the event of a data breach that affects your personal information, we will notify you in accordance with applicable laws.
                </p>
              </div>
            </div>
          </AnimatedElement>

          {/* Cookies Section */}
          <AnimatedElement animation="fadeInUp" className="mb-12">
            <div className="cyber-card rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-6 gradient-text inline-block">
                Cookies and Tracking Technologies
              </h2>
              
              <div className="space-y-6 text-muted-foreground">
                <p>
                  We and our third-party partners use cookies and similar technologies to enhance your experience, analyze usage, and deliver personalized content.
                </p>
                
                <h3 className="text-lg font-semibold text-foreground">1. Types of Cookies We Use</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong className="text-foreground">Essential Cookies:</strong> Necessary for the Service to function properly.</li>
                  <li><strong className="text-foreground">Preference Cookies:</strong> Enable us to remember your preferences and settings.</li>
                  <li><strong className="text-foreground">Analytics Cookies:</strong> Help us understand how users interact with our Service.</li>
                  <li><strong className="text-foreground">Marketing Cookies:</strong> Used to track visitors across websites to display relevant advertisements.</li>
                </ul>
                
                <h3 className="text-lg font-semibold text-foreground">2. Your Cookie Choices</h3>
                <p>
                  Most web browsers allow you to control cookies through their settings. You can:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Delete cookies from your device</li>
                  <li>Block cookies by activating the setting on your browser that allows you to refuse all or some cookies</li>
                  <li>Set your browser to notify you when you receive a cookie</li>
                </ul>
                <p>
                  Please note that if you choose to block or delete cookies, some features of our Service may not function properly.
                </p>
                
                <h3 className="text-lg font-semibold text-foreground">3. Do Not Track</h3>
                <p>
                  Some browsers have a "Do Not Track" feature that signals to websites that you do not want to have your online activities tracked. Our Service does not currently respond to "Do Not Track" signals.
                </p>
              </div>
            </div>
          </AnimatedElement>

          {/* User Rights Section */}
          <AnimatedElement animation="fadeInUp" className="mb-12" id="user-rights">
            <div className="glass-panel rounded-2xl p-8 border border-primary/10">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 rounded-full bg-primary/10 text-primary">
                  <Key size={24} />
                </div>
                <h2 className="text-2xl font-bold gradient-text">Your Rights and Choices</h2>
              </div>
              
              <div className="space-y-6 text-muted-foreground">
                <p>
                  Depending on your location, you may have certain rights regarding your personal information. These may include:
                </p>
                
                <h3 className="text-lg font-semibold text-foreground">1. Access and Information</h3>
                <p>
                  You have the right to request a copy of the personal information we hold about you and information about how we use it.
                </p>
                
                <h3 className="text-lg font-semibold text-foreground">2. Correction</h3>
                <p>
                  You have the right to request that we correct any inaccurate or incomplete personal information we hold about you.
                </p>
                
                <h3 className="text-lg font-semibold text-foreground">3. Deletion</h3>
                <p>
                  You have the right to request that we delete your personal information in certain circumstances, such as when it is no longer necessary for the purposes for which it was collected.
                </p>
                
                <h3 className="text-lg font-semibold text-foreground">4. Restriction and Objection</h3>
                <p>
                  You have the right to request that we restrict the processing of your personal information or to object to our processing of your personal information in certain circumstances.
                </p>
                
                <h3 className="text-lg font-semibold text-foreground">5. Data Portability</h3>
                <p>
                  You have the right to request that we provide your personal information in a structured, commonly used, and machine-readable format so that you can transfer it to another service provider.
                </p>
                
                <h3 className="text-lg font-semibold text-foreground">6. Marketing Communications</h3>
                <p>
                  You can opt-out of receiving marketing communications from us by:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Following the unsubscribe instructions in our marketing emails</li>
                  <li>Updating your communication preferences in your account settings</li>
                  <li>Contacting us using the contact information provided below</li>
                </ul>
                
                <h3 className="text-lg font-semibold text-foreground">7. Exercising Your Rights</h3>
                <p>
                  To exercise any of the above rights, please contact us using the contact information provided below. We will respond to your request within the timeframe required by applicable law.
                </p>
                <p>
                  Please note that certain information may be exempt from these rights under applicable law, such as information we need to retain for legal purposes or to protect our rights or the rights of others.
                </p>
              </div>
            </div>
          </AnimatedElement>

          {/* International Data Transfers */}
          <AnimatedElement animation="fadeInUp" className="mb-12">
            <div className="cyber-card rounded-2xl p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 rounded-full bg-secondary/10 text-secondary">
                  <Globe size={24} />
                </div>
                <h2 className="text-2xl font-bold gradient-text">International Data Transfers</h2>
              </div>
              
              <div className="space-y-6 text-muted-foreground">
                <p>
                  LocalLink operates globally, and your information may be transferred to, stored, and processed in countries other than the country in which you are resident. These countries may have data protection laws that are different from the laws of your country.
                </p>
                <p>
                  When we transfer your information to other countries, we will protect it as described in this Privacy Policy and in accordance with applicable law. We use appropriate safeguards, such as standard contractual clauses, to ensure that your information receives an adequate level of protection.
                </p>
              </div>
            </div>
          </AnimatedElement>

          {/* Children's Privacy */}
          <AnimatedElement animation="fadeInUp" className="mb-12">
            <div className="glass-panel rounded-2xl p-8 border border-primary/10">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 rounded-full bg-accent/10 text-accent">
                  <AlertCircle size={24} />
                </div>
                <h2 className="text-2xl font-bold gradient-text">Children's Privacy</h2>
              </div>
              
              <div className="space-y-6 text-muted-foreground">
                <p>
                  Our Service is not intended for individuals under the age of 18. We do not knowingly collect personal information from children under 18. If you are a parent or guardian and believe that your child has provided us with personal information, please contact us. If we become aware that we have collected personal information from children without verification of parental consent, we will take steps to remove that information from our servers.
                </p>
              </div>
            </div>
          </AnimatedElement>

          {/* Contact Information */}
          <AnimatedElement animation="fadeInUp" className="mb-12">
            <div className="cyber-card rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-6 gradient-text inline-block">
                Contact Us
              </h2>
              
              <div className="space-y-6 text-muted-foreground">
                <p>
                  If you have any questions or concerns about this Privacy Policy or our privacy practices, please contact us at:
                </p>
                <div className="p-4 bg-background/50 rounded-xl border border-primary/10">
                  <p><strong className="text-foreground">LocalLink</strong></p>
                  <p>123 Service Lane, Jaipur, Rajasthan 302001, India</p>
                  <p>Email: privacy@locallink.in</p>
                  <p>Phone: +91 98765 43210</p>
                </div>
              </div>
            </div>
          </AnimatedElement>

          {/* Back to top and Legal links */}
          <AnimatedElement animation="fadeInUp" className="mt-16 flex flex-col md:flex-row items-center justify-between gap-6">
            <a 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
            >
              <ArrowLeft size={18} />
              Back to Top
            </a>
            
            <div className="flex gap-6">
              <Link to="/terms" className="text-primary hover:text-primary/80 transition-colors">
                Terms & Conditions
              </Link>
              <Link to="/FAQ" className="text-primary hover:text-primary/80 transition-colors">
                FAQ
              </Link>
              <Link to="/contact" className="text-primary hover:text-primary/80 transition-colors">
                Contact Us
              </Link>
            </div>
          </AnimatedElement>
        </div>
      </SectionContainer>
    </div>
  );
};

export default PrivacyPage; 