import { ref, readonly } from 'vue'
import fallbackData from '../data/projects.json'

// Configuration
const SHEET_ID = '1qiuzgl5kc7Qew5nLC3hT-aWzq7p5m8GDMNPs1rd16Ok'
const CACHE_DURATION = 60 * 60 * 1000 // 1 hour in milliseconds

// Cache keys
const CACHE_KEYS = {
  projects: 'fv_projects_cache',
  author: 'fv_author_cache',
  categories: 'fv_categories_cache'
}

/**
 * Parse CSV string into array of objects
 */
function parseCSV(csv) {
  const lines = csv.split('\n').filter(line => line.trim())
  if (lines.length < 2) return []

  const headers = parseCSVLine(lines[0])
  const data = []

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i])
    const obj = {}
    headers.forEach((header, index) => {
      obj[header.trim()] = values[index]?.trim() || ''
    })
    data.push(obj)
  }

  return data
}

/**
 * Parse a single CSV line handling quoted values
 */
function parseCSVLine(line) {
  const result = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    const nextChar = line[i + 1]

    if (char === '"' && inQuotes && nextChar === '"') {
      current += '"'
      i++ // Skip next quote
    } else if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === ',' && !inQuotes) {
      result.push(current)
      current = ''
    } else {
      current += char
    }
  }
  result.push(current)

  return result
}

/**
 * Get cached data from localStorage
 */
function getFromCache(key) {
  try {
    const cached = localStorage.getItem(key)
    if (!cached) return null

    const { data, timestamp } = JSON.parse(cached)
    const isExpired = Date.now() - timestamp > CACHE_DURATION

    return { data, isExpired }
  } catch (e) {
    console.warn('Cache read error:', e)
    return null
  }
}

/**
 * Save data to localStorage cache
 */
function saveToCache(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify({
      data,
      timestamp: Date.now()
    }))
  } catch (e) {
    console.warn('Cache write error:', e)
  }
}

/**
 * Fetch sheet data from Google Sheets
 */
async function fetchSheet(sheetName) {
  if (!SHEET_ID) {
    console.warn('Google Sheet ID not configured')
    return null
  }

  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`

  try {
    const response = await fetch(url)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const csv = await response.text()
    return parseCSV(csv)
  } catch (e) {
    console.error(`Failed to fetch sheet "${sheetName}":`, e)
    return null
  }
}

/**
 * Transform raw projects data from sheet to app format
 */
function transformProjects(rawData) {
  return rawData.map((row, index) => ({
    id: parseInt(row.id) || index + 1,
    title: row.title || '',
    year: parseInt(row.year) || new Date().getFullYear(),
    category: row.category || 'film',
    image: row.image || '/images/projects/placeholder.jpg',
    imdb: row.imdb || '',
    role: {
      en: row.role_en || row.role || '',
      es: row.role_es || row.role || ''
    },
    description: {
      en: row.description_en || '',
      es: row.description_es || ''
    },
    awards: row.awards ? row.awards.split('|').map(a => a.trim()).filter(Boolean) : [],
    director: row.director || ''
  }))
}

/**
 * Transform raw author data from sheet to app format
 */
function transformAuthor(rawData) {
  const author = {}
  rawData.forEach(row => {
    const key = row.key
    if (key) {
      author[key] = {
        en: row.value_en || row.value || '',
        es: row.value_es || row.value || ''
      }
    }
  })
  return author
}

/**
 * Transform raw categories data from sheet to app format
 */
function transformCategories(rawData) {
  const categories = rawData.map(row => ({
    value: row.value || '',
    label: {
      en: row.label_en || row.label || '',
      es: row.label_es || row.label || ''
    }
  }))

  // Ensure "all" is always first in the list for the filter UI
  const allIndex = categories.findIndex(c => c.value === 'all')
  if (allIndex > 0) {
    const [allCategory] = categories.splice(allIndex, 1)
    categories.unshift(allCategory)
  }

  return categories
}

/**
 * Composable for projects data
 */
export function useProjects() {
  const projects = ref([])
  const loading = ref(true)
  const error = ref(null)

  async function load() {
    const cacheKey = CACHE_KEYS.projects

    // Try cache first
    const cached = getFromCache(cacheKey)
    if (cached?.data) {
      projects.value = cached.data
      loading.value = false

      // If cache is fresh, we're done
      if (!cached.isExpired) return

      // Cache is stale, fetch in background
      fetchAndUpdate()
    } else {
      // No cache, fetch immediately
      await fetchAndUpdate()
    }
  }

  async function fetchAndUpdate() {
    try {
      const rawData = await fetchSheet('projects')

      if (rawData && rawData.length > 0) {
        const transformed = transformProjects(rawData)
        projects.value = transformed
        saveToCache(CACHE_KEYS.projects, transformed)
      } else if (projects.value.length === 0) {
        // Use fallback if no data and no cache
        console.info('Using fallback projects data')
        projects.value = fallbackData.projects
      }
    } catch (e) {
      console.error('Projects fetch error:', e)
      error.value = e

      // Use fallback if fetch fails and no cached data
      if (projects.value.length === 0) {
        projects.value = fallbackData.projects
      }
    } finally {
      loading.value = false
    }
  }

  // Start loading immediately
  load()

  return {
    projects: readonly(projects),
    loading: readonly(loading),
    error: readonly(error),
    refresh: fetchAndUpdate
  }
}

/**
 * Composable for author data
 */
export function useAuthor() {
  const author = ref({})
  const loading = ref(true)
  const error = ref(null)

  // Default author data as fallback
  const defaultAuthor = {
    name: { en: 'Felo Valencia', es: 'Felo Valencia' },
    title: { en: 'Sound Designer & Editor', es: 'Diseñador y Editor de Sonido' },
    bio: { en: '', es: '' },
    email: { en: 'info@felovalencia.com', es: 'info@felovalencia.com' },
    linkedin: { en: 'https://www.linkedin.com/in/felipe-v-129a0596/', es: 'https://www.linkedin.com/in/felipe-v-129a0596/' },
    instagram: { en: 'https://www.instagram.com/felovalencip', es: 'https://www.instagram.com/felovalencip' }
  }

  async function load() {
    const cacheKey = CACHE_KEYS.author

    // Try cache first
    const cached = getFromCache(cacheKey)
    if (cached?.data) {
      author.value = cached.data
      loading.value = false

      if (!cached.isExpired) return
      fetchAndUpdate()
    } else {
      await fetchAndUpdate()
    }
  }

  async function fetchAndUpdate() {
    try {
      const rawData = await fetchSheet('author')

      if (rawData && rawData.length > 0) {
        const transformed = transformAuthor(rawData)
        author.value = transformed
        saveToCache(CACHE_KEYS.author, transformed)
      } else if (Object.keys(author.value).length === 0) {
        author.value = defaultAuthor
      }
    } catch (e) {
      console.error('Author fetch error:', e)
      error.value = e

      if (Object.keys(author.value).length === 0) {
        author.value = defaultAuthor
      }
    } finally {
      loading.value = false
    }
  }

  load()

  return {
    author: readonly(author),
    loading: readonly(loading),
    error: readonly(error),
    refresh: fetchAndUpdate
  }
}

/**
 * Composable for categories data
 */
export function useCategories() {
  const categories = ref([])
  const loading = ref(true)
  const error = ref(null)

  // Default categories as fallback
  const defaultCategories = [
    { value: 'all', label: { en: 'All Projects', es: 'Todos los Proyectos' } },
    { value: 'film', label: { en: 'Films', es: 'Películas' } },
    { value: 'series', label: { en: 'Series', es: 'Series' } },
    { value: 'documentary', label: { en: 'Documentaries', es: 'Documentales' } }
  ]

  async function load() {
    const cacheKey = CACHE_KEYS.categories

    const cached = getFromCache(cacheKey)
    if (cached?.data) {
      categories.value = cached.data
      loading.value = false

      if (!cached.isExpired) return
      fetchAndUpdate()
    } else {
      await fetchAndUpdate()
    }
  }

  async function fetchAndUpdate() {
    try {
      const rawData = await fetchSheet('categories')

      if (rawData && rawData.length > 0) {
        const transformed = transformCategories(rawData)
        categories.value = transformed
        saveToCache(CACHE_KEYS.categories, transformed)
      } else if (categories.value.length === 0) {
        categories.value = defaultCategories
      }
    } catch (e) {
      console.error('Categories fetch error:', e)
      error.value = e

      if (categories.value.length === 0) {
        categories.value = defaultCategories
      }
    } finally {
      loading.value = false
    }
  }

  load()

  return {
    categories: readonly(categories),
    loading: readonly(loading),
    error: readonly(error),
    refresh: fetchAndUpdate
  }
}

/**
 * Utility to clear all caches
 */
export function clearSheetCache() {
  Object.values(CACHE_KEYS).forEach(key => {
    localStorage.removeItem(key)
  })
}

/**
 * Check if Google Sheets is configured
 */
export function isSheetConfigured() {
  return Boolean(SHEET_ID)
}
