import { motion } from 'framer-motion'
import { FaGithub, FaStar, FaCodeBranch } from 'react-icons/fa'

const LANGUAGE_COLORS = {
  Python: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
  Jupyter: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300',
  JavaScript: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
  TypeScript: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
  ECL: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
  R: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300',
}

function LanguageBadge({ language }) {
  if (!language) return null
  const colorClass = LANGUAGE_COLORS[language] || 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-medium ${colorClass}`}>
      {language}
    </span>
  )
}

export default function ProjectCard({ project, index = 0 }) {
  const {
    name,
    description_professional,
    description,
    language,
    stars = 0,
    forks = 0,
    url,
    tags = [],
    highlight = false,
  } = project

  const displayDescription = description_professional || description || 'Repositório GitHub'

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      className={`card flex flex-col h-full ${highlight ? 'ring-1 ring-brand-300 dark:ring-brand-700' : ''}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <FaGithub className="text-gray-400 dark:text-gray-500 shrink-0" size={16} />
          <h3 className="font-semibold text-gray-900 dark:text-white text-sm leading-tight break-all">
            {name}
          </h3>
        </div>
        {highlight && (
          <span className="badge shrink-0 ml-2">⭐ Destaque</span>
        )}
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed flex-1 mb-4">
        {displayDescription}
      </p>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {tags.map((tag) => (
            <span key={tag} className="badge-gray font-mono text-xs">{tag}</span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
          <LanguageBadge language={language} />
          {stars > 0 && (
            <span className="flex items-center gap-1">
              <FaStar size={11} />
              {stars}
            </span>
          )}
          {forks > 0 && (
            <span className="flex items-center gap-1">
              <FaCodeBranch size={11} />
              {forks}
            </span>
          )}
        </div>

        {url && (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium link-primary flex items-center gap-1 hover:underline"
          >
            Ver no GitHub →
          </a>
        )}
      </div>
    </motion.div>
  )
}
