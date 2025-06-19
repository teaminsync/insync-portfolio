"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform, useInView } from "framer-motion"

const About = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: "-100px" })

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], ["100px", "-100px"])

  const textVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.2,
        duration: 0.8,
        ease: [0.6, -0.05, 0.01, 0.99],
      },
    }),
  }

  const stats = [
    { number: "50+", label: "Projects Delivered" },
    { number: "25+", label: "Happy Clients" },
    { number: "3+", label: "Years Experience" },
    { number: "100%", label: "Client Satisfaction" },
  ]

  return (
    <section ref={containerRef} id="about" className="relative py-32 bg-gradient-to-b from-black to-gray-900">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div style={{ y }} className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Text Content */}
          <motion.div initial="hidden" animate={isInView ? "visible" : "hidden"} className="space-y-8">
            <motion.h2 custom={0} variants={textVariants} className="text-5xl md:text-6xl font-bold leading-tight">
              Crafting{" "}
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                meaningful
              </span>{" "}
              digital experiences
            </motion.h2>

            <div className="space-y-6 text-lg text-gray-300 leading-relaxed">
              <motion.p custom={1} variants={textVariants}>
                At InSync Solutions, we craft meaningful digital experiences through design, content, and code — all
                driven by clear purpose and strategy.
              </motion.p>

              <motion.p custom={2} variants={textVariants}>
                Our work builds strong digital presences that do more than just look good; they generate real growth and
                leads for your brand.
              </motion.p>

              <motion.p custom={3} variants={textVariants}>
                We don't simply deliver services — we create aligned digital solutions that connect with your vision and
                help your brand succeed.
              </motion.p>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <motion.div initial="hidden" animate={isInView ? "visible" : "hidden"} className="grid grid-cols-2 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                custom={index + 4}
                variants={textVariants}
                whileHover={{ scale: 1.05, y: -5 }}
                className="text-center p-6 bg-gradient-to-br from-white/5 to-white/10 rounded-2xl backdrop-blur-sm border border-white/10"
              >
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-400 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Decorative Elements */}
      <motion.div
        animate={{
          rotate: [0, 360],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 20,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
        className="absolute top-20 right-10 w-64 h-64 border border-blue-500/10 rounded-full"
      />
    </section>
  )
}

export default About
