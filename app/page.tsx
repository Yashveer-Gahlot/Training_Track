"use client";

import { motion } from "framer-motion";
import useUser from "@/hooks/useUser";
import Hero from "@/components/Hero";
import IntroductionSection from "@/components/IntroductionSection";
import Loader from "@/components/Loader";
import SimpleUserSection from "@/components/SimpleUserSection";

const Home = () => {
  const { user, isLoading } = useUser();

  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  if (isLoading) {
    return <Loader />;
  }

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
        <SimpleUserSection />
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
