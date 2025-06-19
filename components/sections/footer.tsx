"use client"

import { motion } from "framer-motion"
import { ArrowUp, Linkedin, Instagram, Github } from "lucide-react"

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "Services", href: "#services" },
    { name: "Portfolio", href: "#portfolio" },
    { name: "Contact", href: "#contact" },
  ]

  const socialLinks = [
    {
      name: "LinkedIn",
      href: "https://linkedin.com/company/insync-solutions",
      icon: Linkedin,
      color: "hover:text-blue-400",
    },
    {
      name: "Instagram",
      href: "https://instagram.com/insync.solutions",
      icon: Instagram,
      color: "hover:text-pink-400",
    },
    {
      name: "Behance",
      href: "https://behance.net/insyncsolutions",
      icon: Github,
      color: "hover:text-purple-400",
    },
  ]

  return (
    <footer className="relative bg-gradient-to-t from-gray-900 to-black border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-4 gap-12">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2"
          >
            <motion.div whileHover={{ scale: 1.05 }} className="text-3xl font-bold mb-4">
              InSync<span className="text-blue-500">.</span>
            </motion.div>
            <p className="text-gray-400 text-lg leading-relaxed max-w-md">
              Crafting meaningful digital experiences through design, content, and code — all driven by clear purpose
              and strategy.
            </p>
            <div className="flex items-center gap-4 mt-6">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.2, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-3 bg-white/5 rounded-xl border border-white/10 transition-all duration-300 ${social.color} hover:border-white/20`}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h3 className="text-xl font-semibold mb-6">Navigation</h3>
            <ul className="space-y-4">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <motion.a
                    href={link.href}
                    whileHover={{ x: 5 }}
                    className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center gap-2 group"
                  >
                    <span className="w-0 h-px bg-blue-500 transition-all duration-300 group-hover:w-4" />
                    {link.name}
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-xl font-semibold mb-6">Get in Touch</h3>
            <div className="space-y-4 text-gray-400">
              <motion.a
                href="mailto:insyncsolutions06@gmail.com"
                whileHover={{ x: 5 }}
                className="block hover:text-white transition-colors duration-300"
              >
                insyncsolutions06@gmail.com
              </motion.a>
              <motion.a
                href="https://wa.me/919082210545"
                whileHover={{ x: 5 }}
                className="block hover:text-white transition-colors duration-300"
              >
                +91 9082210545
              </motion.a>
              <motion.a
                href="https://instagram.com/insync.solutions"
                whileHover={{ x: 5 }}
                className="block hover:text-white transition-colors duration-300"
              >
                @insync.solutions
              </motion.a>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col md:flex-row items-center justify-between pt-12 mt-12 border-t border-white/10"
        >
          <p className="text-gray-400 text-sm">© {new Date().getFullYear()} InSync Solutions. All rights reserved.</p>

          <motion.button
            onClick={scrollToTop}
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="mt-4 md:mt-0 p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(59,130,246,0.1),transparent_70%)]" />
    </footer>
  )
}

export default Footer
