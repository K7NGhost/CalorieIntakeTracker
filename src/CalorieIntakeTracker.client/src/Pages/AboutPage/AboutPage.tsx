import React from "react";
import { motion } from "framer-motion";
import { Heart, Target, Users, Award, Zap, Shield } from "lucide-react";
import "./AboutPage.css";

// Animation variants
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerParent = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

type Props = {};

const AboutPage = (props: Props) => {
  return (
    <div className="about-page-container">
      {/* Hero Section */}
      <section className="about-hero">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="about-hero-content"
        >
          <h1 className="about-hero-title">
            About <span className="text-orange-500">CalorieIntakeTracker</span>
          </h1>
          <p className="about-hero-subtitle">
            We're on a mission to make nutrition tracking simple, accurate, and sustainable for everyone.
          </p>
        </motion.div>
      </section>

      {/* Mission Section */}
      <section className="about-mission">
        <div className="about-mission-content">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="about-mission-text"
          >
            <h2 className="about-section-title">Our Mission</h2>
            <p className="about-mission-description">
              We believe that healthy eating should be effortless. Traditional calorie counting is time-consuming, 
              inaccurate, and often leads to frustration. That's why we built CalorieIntakeTracker with cutting-edge 
              AI technology to make nutrition tracking as simple as taking a photo.
            </p>
            <p className="about-mission-description">
              Our goal is to help you build sustainable healthy habits by removing the barriers that make nutrition 
              tracking difficult. Whether you're a busy professional, fitness enthusiast, or someone just starting 
              their health journey, we're here to support you.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="about-mission-stats"
          >
            <div className="about-stat-card">
              <div className="about-stat-icon">
                <Users className="text-orange-400" size={32} />
              </div>
              <div className="about-stat-number">50K+</div>
              <div className="about-stat-label">Active Users</div>
            </div>
            <div className="about-stat-card">
              <div className="about-stat-icon">
                <Target className="text-orange-400" size={32} />
              </div>
              <div className="about-stat-number">2M+</div>
              <div className="about-stat-label">Meals Logged</div>
            </div>
            <div className="about-stat-card">
              <div className="about-stat-icon">
                <Award className="text-orange-400" size={32} />
              </div>
              <div className="about-stat-number">95%</div>
              <div className="about-stat-label">Accuracy Rate</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="about-values">
        <div className="about-values-content">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="about-section-title text-center"
          >
            Our Core Values
          </motion.h2>
          
          <motion.div
            variants={staggerParent}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="about-values-grid"
          >
            {[
              {
                icon: <Zap className="text-orange-400" size={32} />,
                title: "Simplicity",
                description: "We believe technology should make life easier, not more complicated. Every feature is designed with simplicity in mind."
              },
              {
                icon: <Shield className="text-orange-400" size={32} />,
                title: "Privacy",
                description: "Your health data is personal. We use industry-leading security practices to protect your information."
              },
              {
                icon: <Heart className="text-orange-400" size={32} />,
                title: "Empathy",
                description: "We understand the challenges of maintaining healthy habits. Our tools are built with real user struggles in mind."
              },
              {
                icon: <Target className="text-orange-400" size={32} />,
                title: "Accuracy",
                description: "We continuously improve our AI models to provide the most accurate nutritional information possible."
              }
            ].map((value, index) => (
              <motion.div
                key={index}
                variants={fadeUp}
                className="about-value-card"
                whileHover={{ y: -5 }}
              >
                <div className="about-value-icon">{value.icon}</div>
                <h3 className="about-value-title">{value.title}</h3>
                <p className="about-value-description">{value.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className="about-team">
        <div className="about-team-content">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="about-section-title text-center"
          >
            Meet Our Team
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="about-team-description"
          >
            We're a passionate team of developers, nutritionists, and health enthusiasts 
            working together to revolutionize how people track their nutrition.
          </motion.p>

          <motion.div
            variants={staggerParent}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="about-team-grid"
          >
            {[
              {
                name: "Kevin Argueta",
                role: "Developer",
                bio: "Former nutritionist with 10+ years helping people achieve their health goals. Passionate about making nutrition accessible to everyone."
              },
              {
                name: "Nathan Harris",
                role: "Developer",
                bio: "AI/ML engineer with expertise in computer vision. Previously worked at Google on image recognition technologies."
              },
              {
                name: "Kamarre Hicks",
                role: "Developer",
                bio: "Registered dietitian and PhD in Nutritional Sciences. Ensures our recommendations are scientifically accurate."
              },
              {
                name: "Mahmoud El Hajj",
                role: "Developer",
                bio: "UX designer focused on creating intuitive health apps. Believes good design can change behavior for the better."
              }

            ].map((member, index) => (
              <motion.div
                key={index}
                variants={fadeUp}
                className="about-team-card"
                whileHover={{ y: -5 }}
              >
                <div className="about-team-avatar">
                  <div className="about-team-avatar-placeholder">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                </div>
                <h3 className="about-team-name">{member.name}</h3>
                <p className="about-team-role">{member.role}</p>
                <p className="about-team-bio">{member.bio}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="about-technology">
        <div className="about-technology-content">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="about-tech-text"
          >
            <h2 className="about-section-title">Powered by Advanced AI</h2>
            <p className="about-tech-description">
              Our food recognition technology uses state-of-the-art computer vision models 
              trained on millions of food images. We continuously improve our accuracy through 
              machine learning and user feedback.
            </p>
            <div className="about-tech-features">
              <div className="about-tech-feature">
                <div className="about-tech-feature-icon">🤖</div>
                <div>
                  <h4 className="about-tech-feature-title">AI Food Recognition</h4>
                  <p className="about-tech-feature-desc">Advanced computer vision identifies foods and estimates portions</p>
                </div>
              </div>
              <div className="about-tech-feature">
                <div className="about-tech-feature-icon">📊</div>
                <div>
                  <h4 className="about-tech-feature-title">Smart Analytics</h4>
                  <p className="about-tech-feature-desc">Personalized insights based on your eating patterns</p>
                </div>
              </div>
              <div className="about-tech-feature">
                <div className="about-tech-feature-icon">🔒</div>
                <div>
                  <h4 className="about-tech-feature-title">Privacy First</h4>
                  <p className="about-tech-feature-desc">Your data is encrypted and never shared without consent</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="about-cta">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="about-cta-content"
        >
          <h2 className="about-cta-title">Ready to Transform Your Nutrition Journey?</h2>
          <p className="about-cta-description">
            Join thousands of users who have simplified their nutrition tracking with CalorieIntakeTracker.
          </p>
          <div className="about-cta-buttons">
            <button className="about-cta-primary">Get Started Free</button>
            <button className="about-cta-secondary">Learn More</button>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default AboutPage;
