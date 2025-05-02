import React from 'react';
import { Phone, Mail, MapPin, Send } from 'lucide-react';

const ContactPage = () => {
  return (
    <div className="pt-24 pb-16">
      {/* Hero Section */}
      <div className="bg-primary/10 py-16">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">Contact Local Link</h1>
            <p className="text-lg text-muted-foreground">
              Need help or have a question? Reach out to us and we'll get back to you as soon as possible.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Form Section */}
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Form */}
          <div>
            <h2 className="text-3xl font-bold mb-4">Send Us a Message</h2>
            <form className="space-y-6">
              <div>
                <label className="block font-medium mb-1 dark:text-white">Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="w-full border border-border bg-background p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <div>
                <label className="block font-medium mb-1 dark:text-white">Email</label>
                <input
                  type="email"
                  placeholder="john@example.com"
                  className="w-full border border-border bg-background p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <div>
                <label className="block font-medium mb-1 dark:text-white">Message</label>
                <textarea
                  rows="4"
                  placeholder="How can we help you?"
                  className="w-full border border-border bg-background p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="flex items-center gap-2 bg-primary text-white font-medium px-6 py-3 rounded-full shadow hover:scale-105 transition-transform duration-300"
              >
                <Send size={18} />
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Info + Map */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold mb-4">Reach Us</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="text-primary mt-1" />
                  <div>
                    <h4 className="font-semibold">Address</h4>
                    <p className="text-muted-foreground">123 Service Lane, Jaipur, Rajasthan 302001, India</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="text-primary mt-1" />
                  <div>
                    <h4 className="font-semibold">Phone</h4>
                    <p className="text-muted-foreground">+91 98765 43210</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="text-primary mt-1" />
                  <div>
                    <h4 className="font-semibold">Email</h4>
                    <p className="text-muted-foreground">support@locallink.in</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden border border-dashed border-border shadow-lg">
              <iframe
                title="Local Link Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3558.0993509250247!2d75.78727307532658!3d26.897681860577378!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396db4e5ea2df0cf%3A0x9c5b43ef16b49769!2sJECRC%20University!5e0!3m2!1sen!2sin!4v1712200000000!5m2!1sen!2sin"
                width="100%"
                height="220"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </div>

      {/* Footer note */}
      <div className="text-sm text-muted-foreground text-center border-t border-border pt-6">
        © 2025 Local Link. All rights reserved.
      </div>
    </div>
  );
};

export default ContactPage;
