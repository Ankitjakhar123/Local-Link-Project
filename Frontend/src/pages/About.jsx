import React from 'react';
import { Users, Shield, Award, Clock, Info, Medal, Globe, TrendingUp } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import SectionContainer from '../components/SectionContainer';
import AnimatedElement from '../components/AnimatedElement';

const AboutPage = () => {
  return (
    <div className="bg-background dark">
      {/* Hero Section */}
      <PageHeader 
        title="About LocalLink"
        description="India's largest home services platform connecting customers with the best service professionals"
        icon={Info}
        backgroundImage="https://images.pexels.com/photos/3184423/pexels-photo-3184423.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
      />

      {/* Mission Section */}
      <SectionContainer
        title="Our Mission"
        icon={TrendingUp}
        subtitle="To empower millions of service professionals across the world to deliver services at home like never before."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="space-y-6">
              <AnimatedElement animation="fadeInUp" delay={0.1} className="flex items-start">
                <div className="mr-4 p-3 rounded-full bg-primary/10 text-primary">
                  <Shield size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Quality Assurance</h3>
                  <p className="text-muted-foreground">
                    We ensure the highest quality standards through rigorous training and quality checks. Our service professionals are background verified and skilled in their respective domains.
                  </p>
                </div>
              </AnimatedElement>
              
              <AnimatedElement animation="fadeInUp" delay={0.2} className="flex items-start">
                <div className="mr-4 p-3 rounded-full bg-secondary/10 text-secondary">
                  <Users size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Professional Excellence</h3>
                  <p className="text-muted-foreground">
                    Our professionals are vetted, trained, and equipped with the latest tools and technologies. We constantly upskill our workforce to deliver exceptional service.
                  </p>
                </div>
              </AnimatedElement>
              
              <AnimatedElement animation="fadeInUp" delay={0.3} className="flex items-start">
                <div className="mr-4 p-3 rounded-full bg-accent/10 text-accent">
                  <Clock size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Convenience</h3>
                  <p className="text-muted-foreground">
                    Book services at your convenience, 7 days a week with flexible scheduling. Our app-based platform enables you to track, schedule, and manage services effortlessly.
                  </p>
                </div>
              </AnimatedElement>
            </div>
          </div>
          
          <AnimatedElement animation="fadeInRight" delay={0.4} className="relative">
            <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl border border-primary/20 glow-on-hover">
              <img 
                src="https://images.pexels.com/photos/3760529/pexels-photo-3760529.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                alt="LocalLink Mission" 
                className="w-full h-full object-cover"
              />
              {/* Overlay effect */}
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60"></div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -bottom-5 -right-5 w-20 h-20 border-r-4 border-b-4 border-secondary z-0"></div>
            <div className="absolute -top-5 -left-5 w-20 h-20 border-l-4 border-t-4 border-primary z-0"></div>
          </AnimatedElement>
        </div>
      </SectionContainer>

      {/* Stats Section */}
      <SectionContainer
        bgClassName="bg-gradient-to-r from-background via-card to-background"
      >
        <AnimatedElement animation="staggerContainer">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <AnimatedElement animation="fadeInUp" className="cyber-card p-6 text-center">
              <div className="text-5xl font-bold text-primary mb-3">5M+</div>
              <p className="text-muted-foreground">Happy Customers</p>
            </AnimatedElement>
            
            <AnimatedElement animation="fadeInUp" delay={0.1} className="cyber-card p-6 text-center">
              <div className="text-5xl font-bold text-secondary mb-3">35K+</div>
              <p className="text-muted-foreground">Service Professionals</p>
            </AnimatedElement>
            
            <AnimatedElement animation="fadeInUp" delay={0.2} className="cyber-card p-6 text-center">
              <div className="text-5xl font-bold text-accent mb-3">25+</div>
              <p className="text-muted-foreground">Cities</p>
            </AnimatedElement>
            
            <AnimatedElement animation="fadeInUp" delay={0.3} className="cyber-card p-6 text-center">
              <div className="text-5xl font-bold text-primary mb-3">4.8/5</div>
              <p className="text-muted-foreground">Average Rating</p>
            </AnimatedElement>
          </div>
        </AnimatedElement>
      </SectionContainer>

      {/* Team Section */}
      <SectionContainer
        title="Leadership Team"
        icon={Users}
        subtitle="Meet the visionaries behind LocalLink"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              name: "Abhiraj Bhal",
              position: "Co-Founder & CEO",
              image: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
              delay: 0
            },
            {
              name: "Varun Khaitan",
              position: "Co-Founder & COO",
              image: "https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
              delay: 0.1
            },
            {
              name: "Raghav Chandra",
              position: "Co-Founder & CTO",
              image: "https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
              delay: 0.2
            }
          ].map((member, index) => (
            <AnimatedElement 
              key={index} 
              animation="fadeInUp" 
              delay={member.delay}
              className="card-3d group"
            >
              <div className="glass-panel rounded-2xl overflow-hidden border border-primary/20 group-hover:border-primary/50 transition-all duration-500">
                <div className="h-64 overflow-hidden relative">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-500"></div>
                </div>
                <div className="p-6 text-center relative">
                  {/* Decorative line */}
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-1 bg-primary rounded-full"></div>
                  
                  <h3 className="text-xl font-bold mb-1 group-hover:text-primary transition-colors duration-300">{member.name}</h3>
                  <p className="text-muted-foreground">{member.position}</p>
                </div>
              </div>
            </AnimatedElement>
          ))}
        </div>
      </SectionContainer>

      {/* Awards Section */}
      <SectionContainer
        title="Awards & Recognition"
        icon={Award}
        subtitle="Celebrating our achievements in the service industry"
        bgClassName="bg-gradient-to-b from-background via-card/50 to-background"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Best Service Platform",
              year: "2024",
              organization: "Tech Awards India",
              icon: Globe,
              delay: 0
            },
            {
              title: "Excellence in Customer Service",
              year: "2023",
              organization: "Service Industry Awards",
              icon: Shield,
              delay: 0.1
            },
            {
              title: "Innovation in Technology",
              year: "2023",
              organization: "Digital India Awards",
              icon: Medal,
              delay: 0.2
            }
          ].map((award, index) => (
            <AnimatedElement 
              key={index} 
              animation="zoomIn" 
              delay={award.delay}
              className="relative group"
            >
              <div className="gradient-border p-8 transition-all duration-500 hover:shadow-xl h-full">
                <award.icon className="text-primary mb-6" size={40} />
                <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors duration-300">{award.title}</h3>
                <p className="text-muted-foreground mb-4">{award.organization}</p>
                <div className="text-sm font-bold text-accent/90 inline-block px-3 py-1 rounded-full bg-accent/10 border border-accent/20">
                  {award.year}
                </div>
              </div>
            </AnimatedElement>
          ))}
        </div>
      </SectionContainer>

      {/* Core Values Section */}
      <SectionContainer
        title="Our Core Values"
        icon={Award}
        subtitle="The principles that guide everything we do"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              title: "Customer Obsession",
              description: "We put customers first and work backwards from their needs to deliver exceptional experiences.",
              delay: 0
            },
            {
              title: "Service Excellence",
              description: "We strive for excellence in every service we provide, setting high standards for quality and professionalism.",
              delay: 0.1
            },
            {
              title: "Innovation & Technology",
              description: "We leverage cutting-edge technology to simplify and enhance the service experience for both customers and professionals.",
              delay: 0.2
            },
            {
              title: "Social Impact",
              description: "We aim to create meaningful livelihoods for service professionals and empower them with skills and dignity.",
              delay: 0.3
            }
          ].map((value, index) => (
            <AnimatedElement 
              key={index}
              animation="fadeInUp"
              delay={value.delay}
              className="cyber-card p-8"
            >
              <h3 className="text-2xl font-bold mb-3 text-primary">{value.title}</h3>
              <p className="text-muted-foreground">{value.description}</p>
            </AnimatedElement>
          ))}
        </div>
      </SectionContainer>
    </div>
  );
};

export default AboutPage;