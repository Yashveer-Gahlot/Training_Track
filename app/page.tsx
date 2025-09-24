"use client";

import { motion } from "framer-motion";
import useUser from "@/hooks/useUser";
import Hero from "@/components/Hero";
import IntroductionSection from "@/components/IntroductionSection";
import Profile from "@/components/Profile";
import Settings from "@/components/Settings";
import Loader from "@/components/Loader";
import { Card, CardContent } from "@/components/ui/card";

const Home = () => {
  // The hook now directly provides the user state for the conditional rendering.
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
        <Card className="w-full max-w-2xl">
          <CardContent className="pt-6">
            {/* This is the key change. We no longer pass props. 
              The Profile and Settings components will get the data they need from the context themselves.
            */}
            {user ? <Profile /> : <Settings />}
          </CardContent>
        </Card>
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

