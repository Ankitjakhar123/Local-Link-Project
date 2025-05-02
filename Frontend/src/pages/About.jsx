import React from 'react';
import { Users, Shield, Award, Clock } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="pt-24 pb-16">
      {/* Hero Section */}
      <div className="bg-primary/10 py-16">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">About Urban Company</h1>
            <p className="text-lg text-muted-foreground">
              India's largest home services platform connecting customers with the best service professionals
            </p>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
            <p className="text-lg text-muted-foreground mb-6">
              To empower millions of service professionals across the world to deliver services at home like never before.
            </p>
            <div className="space-y-4">
              <div className="flex items-start">
                <Shield className="text-primary mt-1 mr-3" size={24} />
                <div>
                  <h3 className="font-semibold mb-1">Quality Assurance</h3>
                  <p className="text-muted-foreground">
                    We ensure the highest quality standards through rigorous training and quality checks.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <Users className="text-primary mt-1 mr-3" size={24} />
                <div>
                  <h3 className="font-semibold mb-1">Professional Excellence</h3>
                  <p className="text-muted-foreground">
                    Our professionals are vetted, trained, and equipped with the latest tools and technologies.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <Clock className="text-primary mt-1 mr-3" size={24} />
                <div>
                  <h3 className="font-semibold mb-1">Convenience</h3>
                  <p className="text-muted-foreground">
                    Book services at your convenience, 7 days a week with flexible scheduling.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div>
            <img 
              src="https://images.pexels.com/photos/3760529/pexels-photo-3760529.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
              alt="Urban Company Mission" 
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-card border-y border-border py-16">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">5M+</div>
              <p className="text-muted-foreground">Happy Customers</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">35K+</div>
              <p className="text-muted-foreground">Service Professionals</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">25+</div>
              <p className="text-muted-foreground">Cities</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">4.8/5</div>
              <p className="text-muted-foreground">Average Rating</p>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="container py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Leadership Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              name: "Abhiraj Bhal",
              position: "Co-Founder & CEO",
              image: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            },
            {
              name: "Varun Khaitan",
              position: "Co-Founder & COO",
              image: "https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            },
            {
              name: "Raghav Chandra",
              position: "Co-Founder & CTO",
              image: "https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            }
          ].map((member, index) => (
            <div key={index} className="bg-card border border-border rounded-lg overflow-hidden">
              <div className="h-64 overflow-hidden">
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 text-center">
                <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                <p className="text-muted-foreground">{member.position}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Awards Section */}
      <div className="bg-muted/20 py-16">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">Awards & Recognition</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Best Service Platform",
                year: "2024",
                organization: "Tech Awards India"
              },
              {
                title: "Excellence in Customer Service",
                year: "2023",
                organization: "Service Industry Awards"
              },
              {
                title: "Innovation in Technology",
                year: "2023",
                organization: "Digital India Awards"
              }
            ].map((award, index) => (
              <div key={index} className="bg-card border border-border rounded-lg p-6">
                <Award className="text-primary mb-4" size={32} />
                <h3 className="text-xl font-semibold mb-2">{award.title}</h3>
                <p className="text-muted-foreground">{award.organization}</p>
                <p className="text-sm text-primary mt-2">{award.year}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;