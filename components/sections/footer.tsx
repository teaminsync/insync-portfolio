"use client"

import { motion } from "framer-motion"
import { ArrowUp, Linkedin, Instagram, Mail } from "lucide-react"

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const navLinks = [
    { name: "Home", href: "#home" },
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
      name: "Mail",
      href: "mailto:insyncsolutions06@gmail.com",
      icon: Mail,
      color: "hover:text-gray-400",
    },
  ]

  return (
    <footer
      className="relative bg-black text-white"
      style={{
        borderTopLeftRadius: "60px 24px",
        borderTopRightRadius: "60px 24px",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <motion.div className="text-3xl font-bold mb-4">
              insync<span className="text-white">.</span>
            </motion.div>
            <p className="text-gray-400 text-lg leading-relaxed max-w-md">
              Crafting intelligent digital experiences through data driven design, content, and code, all powered by
              clear purpose and strategy.
            </p>
            <div className="flex items-center gap-4 mt-6">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
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
            viewport={{ once: true }}
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
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-semibold mb-6">Get in Touch</h3>
            <div className="space-y-4 text-gray-400">
              <motion.a
                href="mailto:insyncsolutions06@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
                className="block hover:text-white transition-colors duration-300"
              >
                Email: insyncsolutions06@gmail.com
              </motion.a>
              <motion.a
                href="https://wa.me/919082210545"
                target="_blank"
                rel="noopener noreferrer"
                className="block hover:text-white transition-colors duration-300"
              >
                Phone: +91 9082210545
              </motion.a>
              <motion.a
                href="https://instagram.com/insync.solutions"
                target="_blank"
                rel="noopener noreferrer"
                className="block hover:text-white transition-colors duration-300"
              >
                Mumbai, Maharashtra
              </motion.a>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row items-center justify-between pt-12 mt-12 border-t border-white/10"
        >
          <p className="text-gray-400 text-sm">© {new Date().getFullYear()} InSync Solutions. All rights reserved.</p>

          <motion.button
            onClick={scrollToTop}
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="mt-4 md:mt-0 p-3 bg-white rounded-full text-black transition-all duration-300"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </div>
    </footer>
  )
}

export default Footer
