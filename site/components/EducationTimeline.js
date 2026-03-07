import { motion } from 'framer-motion'

const STATUS_CONFIG = {
  completed: { label: 'Concluído', color: 'bg-emerald-500', textColor: 'text-emerald-700 dark:text-emerald-400' },
  in_progress: { label: 'Em curso', color: 'bg-brand-500', textColor: 'text-brand-600 dark:text-brand-400' },
  incomplete: { label: 'Créditos concluídos', color: 'bg-amber-400', textColor: 'text-amber-700 dark:text-amber-400' },
}

export default function EducationTimeline({ education }) {
  if (!education?.length) return null

  return (
    <div className="relative space-y-6">
      {education.map((edu, idx) => {
        const status = STATUS_CONFIG[edu.status] || STATUS_CONFIG.completed
        return (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1, duration: 0.4 }}
            className="flex gap-4"
          >
            {/* Dot */}
            <div className="relative flex flex-col items-center">
              <div className={`w-3 h-3 rounded-full mt-1.5 shrink-0 ${status.color}`} />
              {idx < education.length - 1 && (
                <div className="w-0.5 flex-1 bg-gray-200 dark:bg-gray-800 mt-1" />
              )}
            </div>

            {/* Content */}
            <div className="pb-2 flex-1">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
                <h3 className="font-semibold text-gray-900 dark:text-white text-base">
                  {edu.degree}
                </h3>
                <span className={`text-xs font-medium ${status.textColor}`}>
                  {status.label}
                </span>
              </div>
              <p className="text-brand-600 dark:text-brand-400 text-sm font-medium mt-0.5">
                {edu.institution}
              </p>
              <div className="flex items-center gap-3 mt-1 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-mono text-xs">{edu.period}</span>
                {edu.location && <span>· {edu.location}</span>}
              </div>
              {(edu.highlight || edu.note) && (
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 italic">
                  {edu.highlight || edu.note}
                </p>
              )}
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
