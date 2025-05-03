import React, { useState } from 'react';
import { Phone, Mail, MapPin, Send, MessageSquare, Clock, Check, Loader } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import SectionContainer from '../components/SectionContainer';
import AnimatedElement from '../components/AnimatedElement';

const ContactPage = () => {
  const [formStatus, setFormStatus] = useState({ state: 'idle', message: '' });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormStatus({ state: 'loading', message: '' });
    
    // Simulate form submission
    setTimeout(() => {
      setFormStatus({ 
        state: 'success', 
        message: 'Thank you for your message! We will get back to you shortly.' 
      });
      
      // Clear form
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    }, 1500);
  };

  return (
    <div className="bg-background dark">
      {/* Hero Section */}
      <PageHeader 
        title="Contact Us"
        description="Need help or have a question? Reach out to us and we'll get back to you as soon as possible."
        icon={MessageSquare}
        backgroundImage="https://images.pexels.com/photos/4145153/pexels-photo-4145153.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
      />

      {/* Contact Form Section */}
      <SectionContainer>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Form */}
          <AnimatedElement animation="fadeInLeft" className="order-2 lg:order-1">
            <div className="bg-card/50 backdrop-blur-md rounded-2xl border border-primary/10 p-8 shadow-xl">
              <h2 className="text-3xl font-bold mb-6 gradient-text relative inline-block">
                Send Us a Message
                <div className="absolute -bottom-1 left-0 h-1 w-24 bg-gradient-to-r from-secondary via-primary to-accent rounded-full"></div>
              </h2>
              
              {formStatus.state === 'success' ? (
                <div className="bg-success/10 border border-success/30 rounded-xl p-6 flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0">
                    <Check className="text-success" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-success mb-1">Message Sent!</h3>
                    <p className="text-muted-foreground">{formStatus.message}</p>
                  </div>
                </div>
              ) : (
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block font-medium mb-2">Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className="w-full bg-background/50 border-2 border-primary/10 focus:border-primary/30 p-4 rounded-xl transition-all duration-300"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-medium mb-2">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        className="w-full bg-background/50 border-2 border-primary/10 focus:border-primary/30 p-4 rounded-xl transition-all duration-300"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block font-medium mb-2">Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+91 98765 43210"
                        className="w-full bg-background/50 border-2 border-primary/10 focus:border-primary/30 p-4 rounded-xl transition-all duration-300"
                      />
                    </div>
                    <div>
                      <label className="block font-medium mb-2">Subject</label>
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full bg-background/50 border-2 border-primary/10 focus:border-primary/30 p-4 rounded-xl transition-all duration-300"
                        required
                      >
                        <option value="">Select a subject</option>
                        <option value="Customer Support">Customer Support</option>
                        <option value="Booking Issue">Booking Issue</option>
                        <option value="Payment Issue">Payment Issue</option>
                        <option value="Service Feedback">Service Feedback</option>
                        <option value="Partnership Inquiry">Partnership Inquiry</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block font-medium mb-2">Message</label>
                    <textarea
                      rows="5"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="How can we help you?"
                      className="w-full bg-background/50 border-2 border-primary/10 focus:border-primary/30 p-4 rounded-xl transition-all duration-300"
                      required
                    ></textarea>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={formStatus.state === 'loading'}
                    className="btn btn-primary flex items-center gap-2 py-3 px-6 rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 w-full md:w-auto"
                  >
                    {formStatus.state === 'loading' ? (
                      <>
                        <Loader className="animate-spin" size={18} />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send size={18} />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </AnimatedElement>

          {/* Contact Info + Map */}
          <AnimatedElement animation="fadeInRight" className="order-1 lg:order-2">
            <div className="space-y-8">
              <div className="bg-card/50 backdrop-blur-md rounded-2xl border border-primary/10 p-8 shadow-xl">
                <h2 className="text-3xl font-bold mb-6 gradient-text relative inline-block">
                  Reach Us
                  <div className="absolute -bottom-1 left-0 h-1 w-24 bg-gradient-to-r from-secondary via-primary to-accent rounded-full"></div>
                </h2>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="text-primary" size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">Our Office</h4>
                      <p className="text-muted-foreground">123 Service Lane, Jaipur, Rajasthan 302001, India</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0">
                      <Phone className="text-secondary" size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">Call Us</h4>
                      <p className="text-muted-foreground mb-1">Customer Support: +91 98765 43210</p>
                      <p className="text-muted-foreground">Business Inquiries: +91 98765 43211</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <Mail className="text-accent" size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">Email Us</h4>
                      <p className="text-muted-foreground mb-1">Support: support@locallink.in</p>
                      <p className="text-muted-foreground">Info: info@locallink.in</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Clock className="text-primary" size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">Working Hours</h4>
                      <p className="text-muted-foreground mb-1">Monday - Saturday: 9:00 AM - 8:00 PM</p>
                      <p className="text-muted-foreground">Sunday: 10:00 AM - 6:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl overflow-hidden border border-primary/10 shadow-xl glow-on-hover">
                <iframe
                  title="LocalLink Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3558.0993509250247!2d75.78727307532658!3d26.897681860577378!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396db4e5ea2df0cf%3A0x9c5b43ef16b49769!2sJECRC%20University!5e0!3m2!1sen!2sin!4v1712200000000!5m2!1sen!2sin"
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </AnimatedElement>
        </div>
      </SectionContainer>

      {/* Global presence section */}
      <SectionContainer
        title="Our Global Presence"
        subtitle="LocalLink is growing worldwide to provide exceptional service across multiple regions"
        bgClassName="bg-gradient-to-b from-background via-card/20 to-background"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { city: "Mumbai", country: "India", address: "123 Service St, Andheri East", phone: "+91 98765 43212" },
            { city: "Delhi", country: "India", address: "456 Link Avenue, Connaught Place", phone: "+91 98765 43213" },
            { city: "Bangalore", country: "India", address: "789 Professional Road, Koramangala", phone: "+91 98765 43214" },
          ].map((office, index) => (
            <AnimatedElement 
              key={index} 
              animation="fadeInUp" 
              delay={index * 0.1}
              className="bg-card/50 backdrop-blur-sm border border-primary/10 rounded-2xl p-6 hover:shadow-xl transition-all duration-300"
            >
              <h3 className="text-xl font-bold mb-1">{office.city}</h3>
              <p className="text-muted-foreground mb-4">{office.country}</p>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <MapPin size={16} className="text-primary mt-1 flex-shrink-0" />
                  <span>{office.address}</span>
                </div>
                <div className="flex items-start gap-3">
                  <Phone size={16} className="text-primary mt-1 flex-shrink-0" />
                  <span>{office.phone}</span>
                </div>
              </div>
            </AnimatedElement>
          ))}
        </div>
      </SectionContainer>
    </div>
  );
};

export default ContactPage;
