import { motion } from 'framer-motion'
import Link from 'next/link'
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa'

export default function HeroSection({ profile }) {
  const { name, title, headline, contacts } = profile

  return (
    <section className="py-20 md:py-28">
      <div className="container-page">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Greeting */}
            <p className="font-mono text-brand-600 dark:text-brand-400 text-sm font-medium mb-4">
              Olá, meu nome é
            </p>

            {/* Name */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
              {name}
            </h1>

            {/* Title */}
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-500 dark:text-gray-400 mb-6">
              {title}
            </h2>

            {/* Headline */}
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-10 leading-relaxed max-w-2xl">
              {headline}
            </p>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-4">
              <Link href="/projects" className="btn-primary">
                Ver Projetos
              </Link>
              <Link href="/contact" className="btn-outline">
                Entre em Contato
              </Link>
            </div>
          </motion.div>

          {/* Social links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex items-center gap-5 mt-12"
          >
            {contacts.github && (
              <a
                href={contacts.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                aria-label="GitHub"
              >
                <FaGithub size={22} />
              </a>
            )}
            {contacts.linkedin && (
              <a
                href={contacts.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                aria-label="LinkedIn"
              >
                <FaLinkedin size={22} />
              </a>
            )}
            {contacts.email && (
              <a
                href={`mailto:${contacts.email}`}
                className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                aria-label="Email"
              >
                <FaEnvelope size={22} />
              </a>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
