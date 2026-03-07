/**
 * Data loading utilities — reads JSON files from data/ at build time.
 * Used in getStaticProps() in each page.
 *
 * The data/ directory is at the root of the monorepo (../data relative to site/).
 */

import fs from 'fs'
import path from 'path'

// data/ is one level up from site/
const DATA_DIR = path.join(process.cwd(), '..', 'data')

function readJson(filename) {
  const filepath = path.join(DATA_DIR, filename)
  const raw = fs.readFileSync(filepath, 'utf-8')
  return JSON.parse(raw)
}

export function getProfile() {
  return readJson('profile.json')
}

export function getExperience() {
  return readJson('experience.json')
}

export function getSkills() {
  return readJson('skills.json')
}

export function getProjects() {
  const data = readJson('projects.json')
  return data.projects || []
}

export function getGithubData() {
  const data = readJson('github.json')
  return data.repos || []
}
