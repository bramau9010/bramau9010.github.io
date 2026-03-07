import { motion } from 'framer-motion'

const levelColors = {
  expert: 'bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300 border-brand-200 dark:border-brand-800',
  advanced: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
  intermediate: 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
}

function SkillBadge({ skill }) {
  const colorClass = levelColors[skill.level] || levelColors.intermediate
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${colorClass}`}>
      {skill.name}
    </span>
  )
}

export default function SkillsBadges({ categories, compact = false }) {
  if (!categories?.length) return null

  const displayCategories = compact ? categories.slice(0, 2) : categories

  return (
    <div className={compact ? 'space-y-4' : 'space-y-8'}>
      {displayCategories.map((category, catIdx) => (
        <motion.div
          key={category.name}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: catIdx * 0.1, duration: 0.4 }}
        >
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <span>{category.icon}</span>
            {category.name}
          </h3>
          <div className="flex flex-wrap gap-2">
            {category.skills.map((skill) => (
              <SkillBadge key={skill.name} skill={skill} />
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  )
}
