import Head from 'next/head'
import { motion } from 'framer-motion'
import CareerTimeline from '../components/CareerTimeline'
import { getExperience } from '../lib/data'

export default function Experience({ experiences }) {
  return (
    <>
      <Head>
        <title>Experiência — Brayan Mauricio</title>
        <meta name="description" content="Trajetória profissional de Brayan Mauricio Rodriguez Garzón" />
      </Head>

      <div className="container-page py-16">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-14"
        >
          <h1 className="section-title">Experiência Profissional</h1>
          <p className="section-subtitle">Mais de 10 anos atuando em Matemática, Estatística e Data Science</p>
        </motion.div>

        <CareerTimeline experiences={experiences} />
      </div>
    </>
  )
}

export async function getStaticProps() {
  const data = getExperience()
  return {
    props: { experiences: data.experiences },
  }
}
