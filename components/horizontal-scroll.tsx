import { motion, useTransform, useScroll } from "framer-motion";
import { useRef } from "react";

const HorizontalScroll = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-100%"]);

  return (
    <section ref={targetRef} className="absolute top-0 h-[400vh]">
      <div className="sticky top-0 flex h-screen items-center">
        <motion.div style={{ x }}>
          {children}
        </motion.div>
      </div>
    </section>
  );
};

export default HorizontalScroll