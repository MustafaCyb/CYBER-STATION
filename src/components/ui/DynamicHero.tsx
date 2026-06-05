import React from 'react';
import { motion } from 'framer-motion';

interface DynamicHeroProps {
  title: string;
  subtitle: string;
  exploreText: string;
  readText: string;
  exploreLink: string;
  readLink: string;
}

export const DynamicHero: React.FC<DynamicHeroProps> = ({ 
  title, 
  subtitle, 
  exploreText, 
  readText, 
  exploreLink, 
  readLink 
}) => {
  return (
    <section className="hero">
      <motion.div 
        className="hero-badge"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <span className="dot"></span>
        <span>Cybersecurity Research Hub</span>
      </motion.div>
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
      >
        <span className="gradient-text">{title}</span>
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
      >
        {subtitle}
      </motion.p>
      <motion.div 
        className="hero-actions"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
      >
        <a href={exploreLink} className="btn btn-primary">{exploreText}</a>
        <a href={readLink} className="btn btn-ghost">{readText}</a>
      </motion.div>
    </section>
  );
};
