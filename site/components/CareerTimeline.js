import { motion } from 'framer-motion'

const COMPANY_COLORS = {
  'Pefisa': 'bg-brand-500',
  'Poli USP': 'bg-emerald-500',
  'UFRJ': 'bg-amber-500',
  'UEPG': 'bg-amber-500',
}

function getColor(company) {
  const key = Object.keys(COMPANY_COLORS).find(k => company.includes(k))
  return key ? COMPANY_COLORS[key] : 'bg-gray-400'
}

export default function CareerTimeline({ experiences }) {
  if (!experiences?.length) return null

  return (
    <div className="relative">
      {experiences.map((exp, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: idx * 0.1, duration: 0.4 }}
          className="relative pl-10 pb-10 last:pb-0"
        >
          {/* Timeline line */}
          {idx < experiences.length - 1 && (
            <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-800" />
          )}

          {/* Dot */}
          <div className={`absolute left-2 top-1.5 w-4 h-4 rounded-full border-2 border-white dark:border-gray-950 ${getColor(exp.company)}`} />

          <div className="card">
            <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white text-lg leading-snug">
                  {exp.role}
                </h3>
                <p className="text-brand-600 dark:text-brand-400 font-medium text-sm mt-0.5">
                  {exp.company}
                </p>
              </div>
              <div className="text-right shrink-0">
                <span className="badge-gray font-mono text-xs">{exp.period}</span>
                {exp.location && (
                  <p className="text-xs text-gray-400 dark:text-gray-600 mt-1">{exp.location}</p>
                )}
              </div>
            </div>

            <ul className="space-y-1.5 mt-3">
              {exp.bullets.map((bullet, bIdx) => (
                <li key={bIdx} className="flex gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <span className="text-brand-500 shrink-0 mt-0.5">▸</span>
                  {bullet}
                </li>
              ))}
            </ul>

            {exp.technologies?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-4 pt-3 border-t border-gray-100 dark:border-gray-800">
                {exp.technologies.map((tech) => (
                  <span key={tech} className="badge-gray font-mono text-xs">{tech}</span>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  )
}
