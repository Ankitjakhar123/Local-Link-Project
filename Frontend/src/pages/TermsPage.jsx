import React, { useEffect, useState } from 'react';
import { Shield, Clock, FileText, ArrowLeft, ShoppingBag, FileCheck, Award } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import SectionContainer from '../components/SectionContainer';
import AnimatedElement from '../components/AnimatedElement';

const TermsPage = () => {
  const location = useLocation();
  const [pageTitle, setPageTitle] = useState("Terms & Conditions");
  const [pageDescription, setPageDescription] = useState("Please read these terms carefully before using our services");
  const [pageIcon, setPageIcon] = useState(FileText);

  useEffect(() => {
    // Check for hash fragments and set appropriate title and description
    if (location.hash === "#refund-policy") {
      setPageTitle("Refund Policy");
      setPageDescription("Learn about our refund eligibility, process, and timeframes");
      setPageIcon(ShoppingBag);
      
      // Scroll to the refund policy section after a short delay
      setTimeout(() => {
        const element = document.getElementById('refund-policy');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else if (location.hash === "#cancellation-policy") {
      setPageTitle("Cancellation Policy");
      setPageDescription("Understanding our service and product cancellation terms");
      setPageIcon(Clock);
    } else if (location.hash === "#service-guarantee") {
      setPageTitle("Service Guarantee");
      setPageDescription("Our commitment to quality and service warranties");
      setPageIcon(Shield);
    } else {
      setPageTitle("Terms & Conditions");
      setPageDescription("Please read these terms carefully before using our services");
      setPageIcon(FileText);
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

      {/* Terms Content */}
      <SectionContainer>
        <div className="max-w-4xl mx-auto">
          {/* Quick links */}
          <AnimatedElement animation="fadeInDown" className="mb-10">
            <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-primary/10 p-6">
              <h2 className="text-xl font-bold mb-4">Quick Links</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { name: "General Terms", href: "#general-terms", icon: FileCheck },
                  { name: "Refund Policy", href: "#refund-policy", icon: ShoppingBag },
                  { name: "Cancellation Policy", href: "#cancellation-policy", icon: Clock },
                  { name: "Service Guarantee", href: "#service-guarantee", icon: Award },
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

          {/* General Terms Section */}
          <AnimatedElement animation="fadeInUp" className="mb-12" id="general-terms">
            <div className="glass-panel rounded-2xl p-8 border border-primary/10">
              <h2 className="text-2xl font-bold mb-6 gradient-text inline-block">
                General Terms & Conditions
              </h2>
              
              <div className="space-y-6 text-muted-foreground">
                <p>
                  Welcome to LocalLink. These Terms and Conditions govern your use of the LocalLink platform and services offered through our website and mobile applications.
                </p>
                
                <h3 className="text-lg font-semibold text-foreground">1. Acceptance of Terms</h3>
                <p>
                  By accessing or using our services, you agree to be bound by these Terms. If you disagree with any part of the terms, you may not access or use our services.
                </p>
                
                <h3 className="text-lg font-semibold text-foreground">2. User Accounts</h3>
                <p>
                  When you create an account with us, you must provide accurate, complete, and current information. You are responsible for safeguarding the password and for all activities that occur under your account.
                </p>
                
                <h3 className="text-lg font-semibold text-foreground">3. Service Description</h3>
                <p>
                  LocalLink provides a platform connecting users with service professionals for various home and personal services. We do not provide the services directly but facilitate the connection between users and service providers.
                </p>
                
                <h3 className="text-lg font-semibold text-foreground">4. User Conduct</h3>
                <p>
                  You agree to use our services only for lawful purposes and in accordance with these Terms. You agree not to use our services in any way that could damage, disable, overburden, or impair our servers or networks.
                </p>
                
                <h3 className="text-lg font-semibold text-foreground">5. Intellectual Property</h3>
                <p>
                  The LocalLink service, including its original content, features, and functionality, is owned by LocalLink and is protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
                </p>
              </div>
            </div>
          </AnimatedElement>

          {/* Refund Policy Section */}
          <AnimatedElement animation="fadeInUp" className="mb-12" id="refund-policy">
            <div className="cyber-card rounded-2xl p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 rounded-full bg-primary/10 text-primary">
                  <ShoppingBag size={24} />
                </div>
                <h2 className="text-2xl font-bold gradient-text">Refund Policy</h2>
              </div>
              
              <div className="space-y-6 text-muted-foreground">
                <p>
                  LocalLink is committed to ensuring complete customer satisfaction. Our refund policy is designed to be fair and transparent.
                </p>
                
                <h3 className="text-lg font-semibold text-foreground">1. Service Refunds</h3>
                <p>
                  <strong className="text-foreground">Eligibility:</strong> Refunds for services are provided if:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>The service professional fails to arrive within the scheduled time slot (after waiting period of 30 minutes).</li>
                  <li>The service quality does not meet the standards described on our platform.</li>
                  <li>The service was not completed as described in the service description.</li>
                  <li>You report dissatisfaction within 24 hours of service completion.</li>
                </ul>
                
                <h3 className="text-lg font-semibold text-foreground">2. Product Refunds</h3>
                <p>
                  <strong className="text-foreground">Eligibility:</strong> Refunds for products are provided if:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>The product is defective or damaged upon delivery.</li>
                  <li>The product delivered doesn't match what was ordered.</li>
                  <li>You report issues within 7 days of receiving the product.</li>
                </ul>
                
                <h3 className="text-lg font-semibold text-foreground">3. Refund Process</h3>
                <p>
                  To request a refund:
                </p>
                <ol className="list-decimal list-inside space-y-2 ml-4">
                  <li>Log in to your LocalLink account.</li>
                  <li>Navigate to "My Bookings" or "My Orders" section.</li>
                  <li>Select the service or product for which you want a refund.</li>
                  <li>Click on "Request Refund" and provide the reason.</li>
                  <li>Submit relevant evidence (photos, videos) if applicable.</li>
                </ol>
                
                <h3 className="text-lg font-semibold text-foreground">4. Refund Timeframe</h3>
                <p>
                  Once approved, refunds will be processed within 5-7 business days. The time it takes for the refund to appear in your account depends on your payment method and financial institution:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Credit/Debit Cards: 3-5 business days</li>
                  <li>UPI/Digital Wallets: 1-3 business days</li>
                  <li>Bank Transfers: 5-7 business days</li>
                </ul>
                
                <h3 className="text-lg font-semibold text-foreground">5. Non-Refundable Items</h3>
                <p>
                  The following are not eligible for refunds:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Services that have been completed to satisfaction and exceeded the 24-hour reporting window.</li>
                  <li>Personalized or custom-ordered products.</li>
                  <li>Services cancelled less than 3 hours before the scheduled time.</li>
                  <li>Products with broken seals, unless defective.</li>
                </ul>
              </div>
            </div>
          </AnimatedElement>

          {/* Cancellation Policy Section */}
          <AnimatedElement animation="fadeInUp" className="mb-12" id="cancellation-policy">
            <div className="glass-panel rounded-2xl p-8 border border-primary/10">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 rounded-full bg-secondary/10 text-secondary">
                  <Clock size={24} />
                </div>
                <h2 className="text-2xl font-bold gradient-text">Cancellation Policy</h2>
              </div>
              
              <div className="space-y-6 text-muted-foreground">
                <p>
                  We understand that plans can change. Our cancellation policy is designed to be flexible while ensuring fairness to our service professionals.
                </p>
                
                <h3 className="text-lg font-semibold text-foreground">1. Service Cancellations</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong className="text-foreground">More than 3 hours before scheduled service:</strong> Full refund with no cancellation fee.</li>
                  <li><strong className="text-foreground">1-3 hours before scheduled service:</strong> 75% refund of the service amount.</li>
                  <li><strong className="text-foreground">Less than 1 hour before scheduled service:</strong> 50% refund of the service amount.</li>
                  <li><strong className="text-foreground">After service professional has arrived:</strong> No refund will be provided.</li>
                </ul>
                
                <h3 className="text-lg font-semibold text-foreground">2. Product Order Cancellations</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong className="text-foreground">Before dispatch:</strong> Full refund with no cancellation fee.</li>
                  <li><strong className="text-foreground">After dispatch, before delivery:</strong> Refund minus shipping costs.</li>
                  <li><strong className="text-foreground">After delivery:</strong> Subject to return policy, not cancellation.</li>
                </ul>
                
                <h3 className="text-lg font-semibold text-foreground">3. Cancellation Process</h3>
                <p>
                  To cancel a service or product order:
                </p>
                <ol className="list-decimal list-inside space-y-2 ml-4">
                  <li>Log in to your LocalLink account.</li>
                  <li>Navigate to "My Bookings" or "My Orders" section.</li>
                  <li>Select the service or product you wish to cancel.</li>
                  <li>Click on "Cancel Booking" or "Cancel Order" button.</li>
                  <li>Provide a reason for cancellation when prompted.</li>
                </ol>
                
                <h3 className="text-lg font-semibold text-foreground">4. Service Professional Cancellations</h3>
                <p>
                  If a service professional cancels, you will be offered:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Full refund with no cancellation fee.</li>
                  <li>Option to reschedule with the same or different professional.</li>
                  <li>Additional service credit as compensation for inconvenience, at our discretion.</li>
                </ul>
              </div>
            </div>
          </AnimatedElement>

          {/* Service Guarantee Section */}
          <AnimatedElement animation="fadeInUp" className="mb-12" id="service-guarantee">
            <div className="cyber-card rounded-2xl p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 rounded-full bg-accent/10 text-accent">
                  <Shield size={24} />
                </div>
                <h2 className="text-2xl font-bold gradient-text">Service Guarantee</h2>
              </div>
              
              <div className="space-y-6 text-muted-foreground">
                <p>
                  At LocalLink, we stand behind the quality of the services provided through our platform. Our Service Guarantee ensures your peace of mind.
                </p>
                
                <h3 className="text-lg font-semibold text-foreground">1. Quality Assurance</h3>
                <p>
                  All service providers on our platform are thoroughly vetted, background-checked, and trained to meet our high standards. If you're not satisfied with the quality of service, you can report it within 24 hours for resolution.
                </p>
                
                <h3 className="text-lg font-semibold text-foreground">2. Service Warranty</h3>
                <p>
                  Many of our services come with a service warranty:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong className="text-foreground">Repairs and Installations:</strong> 30-day warranty against defects or malfunctions.</li>
                  <li><strong className="text-foreground">Pest Control:</strong> 90-day guarantee with free follow-up if pests return.</li>
                  <li><strong className="text-foreground">Cleaning Services:</strong> 24-hour guarantee; if you find areas missed, we'll clean them at no extra cost.</li>
                  <li><strong className="text-foreground">Electrical/Plumbing Work:</strong> 6-month warranty on parts and labor.</li>
                </ul>
                
                <h3 className="text-lg font-semibold text-foreground">3. Resolution Process</h3>
                <p>
                  If you encounter issues with a service:
                </p>
                <ol className="list-decimal list-inside space-y-2 ml-4">
                  <li>Report the issue within the warranty period.</li>
                  <li>Provide details and evidence (photos, videos) of the problem.</li>
                  <li>Our customer service team will evaluate your claim within 24 hours.</li>
                  <li>Once approved, we'll arrange for the service to be redone or issue a full/partial refund.</li>
                </ol>
                
                <h3 className="text-lg font-semibold text-foreground">4. Limitations</h3>
                <p>
                  Our Service Guarantee does not cover:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Issues arising from customer's failure to follow professional's advice or instructions.</li>
                  <li>Damage caused by third parties after service completion.</li>
                  <li>Natural wear and tear or pre-existing conditions not related to the service.</li>
                  <li>Additional requests outside the original scope of work.</li>
                </ul>
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
              <Link to="/privacy" className="text-primary hover:text-primary/80 transition-colors">
                Privacy Policy
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

export default TermsPage; 