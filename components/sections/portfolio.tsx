"use client"

import { useRef, useState } from "react"
import { motion, useInView } from "framer-motion"
import { ExternalLink, Github, ArrowRight } from "lucide-react"
import Image from "next/image"

const Portfolio = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: "-100px" })
  const [activeProject, setActiveProject] = useState(0)

  const projects = [
    {
      title: "Save Farm",
      subtitle: "Website & Brand Refresh",
      description:
        "Repositioned a rustic farmstay to resonate with modern creators, weekend travelers, and eco-conscious audiences.",
      image: "/placeholder.svg?height=600&width=800",
      tags: ["Next.js", "Brand Design", "SEO"],
      link: "https://savefarm.in",
      github: "#",
      challenge:
        "Reposition a rustic farmstay to resonate with modern creators, weekend travelers, and eco-conscious audiences.",
      solution:
        "Designed and developed a responsive, SEO-optimized website using modern frameworks with aligned brand storytelling.",
      impact:
        "Strengthened digital presence, improved discoverability, and established cohesive brand identity online.",
    },
    {
      title: "IMPACTPURE",
      subtitle: "E-commerce Platform",
      description: "Premium D2C platform for a compact, design-forward water purifier targeting urban households.",
      image: "/placeholder.svg?height=600&width=800",
      tags: ["Next.js", "E-commerce", "3D Models"],
      link: "https://impactpure.vercel.app",
      github: "#",
      challenge: "Launch a premium D2C platform for a compact, design-forward water purifier.",
      solution:
        "Built with Next.js, Tailwind CSS, and Framer Motion featuring 3D model viewer and interactive animations.",
      impact: "Delivered a polished e-commerce platform that elevates brand perception and encourages conversions.",
    },
    {
      title: "Coming Soon",
      subtitle: "Next Project",
      description: "Exciting new project in development. Stay tuned for updates.",
      image: "/placeholder.svg?height=600&width=800",
      tags: ["React", "Design", "Strategy"],
      link: "#",
      github: "#",
      challenge: "To be revealed",
      solution: "In development",
      impact: "Coming soon",
    },
  ]

  return (
    <section ref={containerRef} id="portfolio" className="relative py-32 bg-gradient-to-b from-black to-gray-900">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            Featured{" "}
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Work</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Showcasing our latest projects and the impact we've created for our clients
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Project Navigation */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            {projects.map((project, index) => (
              <motion.div
                key={project.title}
                onClick={() => setActiveProject(index)}
                whileHover={{ x: 10 }}
                className={`cursor-pointer p-6 rounded-2xl transition-all duration-300 ${
                  activeProject === index
                    ? "bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-l-4 border-blue-500"
                    : "bg-white/5 hover:bg-white/10"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-2xl font-bold">{project.title}</h3>
                  <ArrowRight
                    className={`w-5 h-5 transition-transform ${activeProject === index ? "rotate-45" : ""}`}
                  />
                </div>
                <p className="text-blue-400 font-medium mb-2">{project.subtitle}</p>
                <p className="text-gray-400 leading-relaxed">{project.description}</p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {project.tags.map((tag) => (
                    <span key={tag} className="px-3 py-1 bg-white/10 rounded-full text-sm text-gray-300">
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Project Details */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-8"
          >
            <motion.div
              key={activeProject}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="relative group"
            >
              <div className="relative overflow-hidden rounded-3xl">
                <Image
                  src={projects[activeProject].image || "/placeholder.svg"}
                  alt={projects[activeProject].title}
                  width={800}
                  height={600}
                  className="w-full h-96 object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="flex gap-4">
                    <motion.a
                      href={projects[activeProject].link}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium hover:bg-white/30 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Live Site
                    </motion.a>
                    <motion.a
                      href={projects[activeProject].github}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium hover:bg-white/30 transition-colors"
                    >
                      <Github className="w-4 h-4" />
                      Code
                    </motion.a>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Project Details */}
            <motion.div
              key={`details-${activeProject}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-6"
            >
              <div>
                <h4 className="text-lg font-semibold text-blue-400 mb-2">Challenge</h4>
                <p className="text-gray-300">{projects[activeProject].challenge}</p>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-purple-400 mb-2">Solution</h4>
                <p className="text-gray-300">{projects[activeProject].solution}</p>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-green-400 mb-2">Impact</h4>
                <p className="text-gray-300">{projects[activeProject].impact}</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Portfolio
