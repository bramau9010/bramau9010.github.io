import Head from 'next/head'
import { motion } from 'framer-motion'
import ProjectCard from '../components/ProjectCard'
import { getProjects, getGithubData } from '../lib/data'

export default function Projects({ projects, githubRepos }) {
  // Use generated projects if available, fallback to raw github data
  const displayItems = projects.length > 0 ? projects : githubRepos.map(repo => ({
    name: repo.name,
    description_professional: repo.description,
    language: repo.language,
    stars: repo.stars,
    forks: repo.forks,
    url: repo.url,
    tags: repo.topics || [],
    highlight: false,
  }))

  const highlighted = displayItems.filter(p => p.highlight)
  const rest = displayItems.filter(p => !p.highlight)

  return (
    <>
      <Head>
        <title>Projetos — Brayan Mauricio</title>
        <meta name="description" content="Projetos de Data Science e Machine Learning de Brayan Mauricio" />
      </Head>

      <div className="container-page py-16">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-14"
        >
          <h1 className="section-title">Projetos</h1>
          <p className="section-subtitle">
            Repositórios GitHub com projetos de Data Science, ML e Matemática Aplicada
          </p>
        </motion.div>

        {/* Highlighted projects */}
        {highlighted.length > 0 && (
          <section className="mb-12">
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-6 flex items-center gap-2">
              <span>⭐</span> Projetos em Destaque
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {highlighted.map((project, idx) => (
                <ProjectCard key={project.name} project={project} index={idx} />
              ))}
            </div>
          </section>
        )}

        {/* All other projects */}
        {rest.length > 0 && (
          <section>
            {highlighted.length > 0 && (
              <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-6">
                Outros Repositórios
              </h2>
            )}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {rest.map((project, idx) => (
                <ProjectCard key={project.name} project={project} index={highlighted.length + idx} />
              ))}
            </div>
          </section>
        )}

        {displayItems.length === 0 && (
          <div className="text-center py-20 text-gray-400 dark:text-gray-600">
            <p className="text-lg">Projetos sendo carregados...</p>
            <p className="text-sm mt-2">Execute o pipeline para coletar dados do GitHub.</p>
          </div>
        )}

        {/* Link to GitHub */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <a
            href="https://github.com/bramau9010"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline"
          >
            Ver todos no GitHub →
          </a>
        </motion.div>
      </div>
    </>
  )
}

export async function getStaticProps() {
  const projects = getProjects()
  const githubRepos = getGithubData()
  return {
    props: { projects, githubRepos },
  }
}
