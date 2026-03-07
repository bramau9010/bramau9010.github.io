import Head from 'next/head'
import { motion } from 'framer-motion'
import { FaGithub, FaLinkedin, FaEnvelope, FaExternalLinkAlt } from 'react-icons/fa'
import { getProfile } from '../lib/data'

const contactItems = (contacts) => [
  {
    icon: <FaLinkedin size={24} />,
    label: 'LinkedIn',
    value: 'brayan-mauricio-rodriguez-garzon',
    href: contacts.linkedin,
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'hover:bg-blue-50 dark:hover:bg-blue-900/20',
    description: 'Conecte-se profissionalmente',
  },
  {
    icon: <FaGithub size={24} />,
    label: 'GitHub',
    value: 'bramau9010',
    href: contacts.github,
    color: 'text-gray-800 dark:text-white',
    bg: 'hover:bg-gray-100 dark:hover:bg-gray-800',
    description: 'Veja meus projetos e código',
  },
  ...(contacts.email ? [{
    icon: <FaEnvelope size={24} />,
    label: 'Email',
    value: contacts.email,
    href: `mailto:${contacts.email}`,
    color: 'text-brand-600 dark:text-brand-400',
    bg: 'hover:bg-brand-50 dark:hover:bg-brand-900/20',
    description: 'Envie uma mensagem direta',
  }] : []),
].filter(item => item.href)

export default function Contact({ profile }) {
  const items = contactItems(profile.contacts)

  return (
    <>
      <Head>
        <title>Contato — Brayan Mauricio</title>
        <meta name="description" content="Entre em contato com Brayan Mauricio Rodriguez Garzón" />
      </Head>

      <div className="container-page py-16">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-14 max-w-xl"
        >
          <h1 className="section-title">Contato</h1>
          <p className="section-subtitle">
            Aberto para oportunidades, colaborações acadêmicas e networking profissional.
          </p>
        </motion.div>

        {/* Contact cards */}
        <div className="max-w-2xl space-y-4">
          {items.map((item, idx) => (
            <motion.a
              key={item.label}
              href={item.href}
              target={item.href.startsWith('mailto') ? '_self' : '_blank'}
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`flex items-center gap-5 p-5 rounded-xl border border-gray-200 dark:border-gray-800
                         bg-white dark:bg-gray-900 transition-all duration-200 group ${item.bg}`}
            >
              <div className={`${item.color} transition-colors`}>
                {item.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {item.label}
                  </span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-mono mt-0.5">
                  {item.value}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-600 mt-0.5">
                  {item.description}
                </p>
              </div>
              <FaExternalLinkAlt
                size={12}
                className="text-gray-300 dark:text-gray-700 group-hover:text-gray-500 dark:group-hover:text-gray-400 transition-colors"
              />
            </motion.a>
          ))}
        </div>

        {/* Note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-12 text-sm text-gray-400 dark:text-gray-600 max-w-md"
        >
          Localizado em São Paulo, SP — Brasil. Disponível para conversas sobre
          Data Science, Machine Learning, Analytics e oportunidades acadêmicas.
        </motion.p>
      </div>
    </>
  )
}

export async function getStaticProps() {
  const profile = getProfile()
  return {
    props: { profile },
  }
}
