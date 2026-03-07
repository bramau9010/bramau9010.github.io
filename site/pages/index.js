import Head from 'next/head'
import Link from 'next/link'
import { motion } from 'framer-motion'
import HeroSection from '../components/HeroSection'
import SkillsBadges from '../components/SkillsBadges'
import { getProfile, getSkills } from '../lib/data'

export default function Home({ profile, skills }) {
  return (
    <>
      <Head>
        <title>Brayan Mauricio — Data Scientist & Matemático Aplicado</title>
        <meta name="description" content={profile.headline} />
      </Head>

      {/* Hero */}
      <HeroSection profile={profile} />

      {/* Skills preview */}
      <section className="py-16 border-t border-gray-100 dark:border-gray-900">
        <div className="container-page">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="section-title">Stack Tecnológico</h2>
            <p className="section-subtitle">Ferramentas e tecnologias que uso no dia a dia</p>
            <SkillsBadges categories={skills.categories} />

            <div className="mt-10">
              <Link href="/projects" className="btn-outline">
                Ver Projetos →
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick about */}
      <section className="py-16 border-t border-gray-100 dark:border-gray-900 bg-gray-50 dark:bg-gray-900/50">
        <div className="container-page">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-2xl"
          >
            <h2 className="section-title">Sobre mim</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
              {profile.bio}
            </p>
            <Link href="/about" className="btn-outline">
              Saiba mais →
            </Link>
          </motion.div>
        </div>
      </section>
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
