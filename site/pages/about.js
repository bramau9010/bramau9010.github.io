import Head from 'next/head'
import { motion } from 'framer-motion'
import EducationTimeline from '../components/EducationTimeline'
import SkillsBadges from '../components/SkillsBadges'
import { getProfile, getSkills } from '../lib/data'

export default function About({ profile, skills }) {
  return (
    <>
      <Head>
        <title>Sobre — Brayan Mauricio</title>
        <meta name="description" content="Trajetória acadêmica e profissional de Brayan Mauricio Rodriguez Garzón" />
      </Head>

      <div className="container-page py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-14"
        >
          <h1 className="section-title">Sobre mim</h1>
          <p className="section-subtitle">Matemático, Cientista de Dados, Professor</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Bio */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Trajetória
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-base mb-6">
              {profile.bio}
            </p>
            <div className="space-y-2">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                📍 {profile.location}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                🎯 Interesses: {profile.interests.join(', ')}
              </p>
            </div>
          </motion.div>

          {/* Education */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Formação Acadêmica
            </h2>
            <EducationTimeline education={profile.education} />
          </motion.div>
        </div>

        {/* Skills full */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-16 pt-10 border-t border-gray-200 dark:border-gray-800"
        >
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-8">
            Stack Tecnológico Completo
          </h2>
          <SkillsBadges categories={skills.categories} />
        </motion.div>
      </div>
    </>
  )
}

export async function getStaticProps() {
  const profile = getProfile()
  const skills = getSkills()
  return {
    props: { profile, skills },
  }
}
