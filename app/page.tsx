"use client";

import { motion } from "framer-motion";
import Hero from "@/components/Hero";
import ProfileSection from "@/components/ProfileSection";
import IntroductionSection from "@/components/IntroductionSection";

const Home = () => {
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  return (
    <div className="scroll-container">
      <motion.div
        className="scroll-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        variants={sectionVariants}
      >
        <Hero />
      </motion.div>
      <motion.div
        className="scroll-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        variants={sectionVariants}
      >
        <ProfileSection />
      </motion.div>
      <motion.div
        className="scroll-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        variants={sectionVariants}
      >
        <IntroductionSection />
      </motion.div>
    </div>
  );
};

export default Home;

