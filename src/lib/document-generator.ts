/**
 * Document Generator - Uses JSON schemas to generate structured documents
 * This provides a high-level interface for creating documents from structured data
 */

import { 
  DocumentSchema, 
  SectionSchema, 
  ContentSchema,
  getSchemaByDocumentType,
  validateDocumentSchema,
  OFFER_LETTER_SCHEMA,
  DELAWARE_CHARTER_SCHEMA
} from '@/types/document-schema'
import { DocumentType } from '@/lib/utils'
import { 
  generateDocx, 
  DocxGenerationOptions, 
  DocumentFormatting,
  createLegalTable,
  TableData 
} from './docx'

export interface DocumentGenerationData {
  documentType: DocumentType
  title: string
  sections: Record<string, any> // section ID -> content data
  customFormatting?: Partial<DocumentFormatting>
  metadata?: {
    author?: string
    company?: string
    created?: Date
    version?: string
  }
}

export interface GeneratedDocument {
  buffer: Uint8Array
  filename: string
  metadata: {
    title: string
    documentType: DocumentType
    generatedAt: Date
    sections: string[]
    wordCount: number
  }
}

/**
 * Generate a document from structured data using predefined schemas
 */
export async function generateDocumentFromSchema(
  data: DocumentGenerationData
): Promise<GeneratedDocument> {
  // Get the schema for the document type
  const schema = getSchemaByDocumentType(data.documentType)
  if (!schema) {
    throw new Error(`No schema found for document type: ${data.documentType}`)
  }

  // Validate the schema
  const schemaErrors = validateDocumentSchema(schema)
  if (schemaErrors.length > 0) {
    throw new Error(`Invalid schema: ${schemaErrors.join(', ')}`)
  }

  // Validate required sections
  const requiredSections = schema.sections.filter(s => s.required)
  const missingSections = requiredSections
    .filter(s => !data.sections[s.id] || !data.sections[s.id].trim())
    .map(s => s.title)

  if (missingSections.length > 0) {
    throw new Error(`Missing required sections: ${missingSections.join(', ')}`)
  }

  // Generate content from schema and data
  const content = await generateContentFromSchema(schema, data.sections)
  
  // Convert schema formatting to DOCX formatting
  const formatting = convertSchemaFormatting(schema, data.customFormatting)

  // Generate DOCX options
  const docxOptions: DocxGenerationOptions = {
    title: data.title,
    content,
    docType: data.documentType,
    formatting,
    metadata: {
      author: data.metadata?.author || 'Darrow Document Generator',
      company: data.metadata?.company || 'Darrow',
      created: data.metadata?.created || new Date()
    }
  }

  // Generate the document
  const buffer = await generateDocx(docxOptions)

  // Create filename
  const timestamp = new Date().toISOString().split('T')[0]
  const filename = `${data.title.replace(/[^a-zA-Z0-9]/g, '_')}_${timestamp}.docx`

  // Calculate word count (approximate)
  const wordCount = content.split(/\s+/).length

  return {
    buffer,
    filename,
    metadata: {
      title: data.title,
      documentType: data.documentType,
      generatedAt: new Date(),
      sections: Object.keys(data.sections),
      wordCount
    }
  }
}

/**
 * Generate content string from schema and section data
 */
async function generateContentFromSchema(
  schema: DocumentSchema, 
  sectionData: Record<string, any>
): Promise<string> {
  const contentParts: string[] = []

  // Sort sections by order
  const sortedSections = schema.sections.sort((a, b) => a.order - b.order)

  for (const section of sortedSections) {
    const sectionContent = await generateSectionContent(section, sectionData[section.id])
    if (sectionContent) {
      contentParts.push(sectionContent)
    }
  }

  return contentParts.join('\n\n')
}

/**
 * Generate content for a single section
 */
async function generateSectionContent(
  section: SectionSchema, 
  data: any
): Promise<string> {
  if (!data && !section.content.defaultValue) {
    return ''
  }

  const value = data || section.content.defaultValue || ''
  let content = ''

  // Add section title if it's not a header type
  if (section.type !== 'header' && section.title) {
    content += `## ${section.title}\n\n`
  }

  // Generate content based on type
  switch (section.content.type) {
    case 'text':
    case 'richText':
      content += processTextContent(value, section.content)
      break
    
    case 'date':
      content += processDateContent(value)
      break
    
    case 'address':
      content += processAddressContent(value)
      break
    
    case 'table':
      content += processTableContent(value)
      break
    
    case 'signature':
      content += processSignatureContent(value, section.content)
      break
    
    default:
      content += String(value)
  }

  // Process subsections if they exist
  if (section.subsections && section.subsections.length > 0) {
    for (const subsection of section.subsections) {
      const subsectionContent = await generateSectionContent(subsection, data?.[subsection.id])
      if (subsectionContent) {
        content += '\n\n' + subsectionContent
      }
    }
  }

  return content
}

/**
 * Process text content with formatting
 */
function processTextContent(value: string, contentSchema: ContentSchema): string {
  if (!value) return ''

  // Handle rich text formatting
  if (contentSchema.richText) {
    return value // Rich text is already formatted
  }

  // Handle multiline text
  if (contentSchema.multiline) {
    return value.replace(/\n/g, '\n\n') // Add paragraph breaks
  }

  return value
}

/**
 * Process date content
 */
function processDateContent(value: string | Date): string {
  if (!value) return ''

  if (value instanceof Date) {
    return value.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Try to parse as date
  const date = new Date(value)
  if (!isNaN(date.getTime())) {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return String(value)
}

/**
 * Process address content
 */
function processAddressContent(value: string | object): string {
  if (!value) return ''

  if (typeof value === 'string') {
    return value
  }

  // Handle structured address
  if (typeof value === 'object') {
    const addr = value as any
    const parts = [
      addr.street,
      addr.city && addr.state ? `${addr.city}, ${addr.state}` : addr.city || addr.state,
      addr.zipCode,
      addr.country
    ].filter(Boolean)

    return parts.join('\n')
  }

  return String(value)
}

/**
 * Process table content
 */
function processTableContent(value: any): string {
  if (!value) return ''

  if (Array.isArray(value) && value.length > 0) {
    // Convert array to table format
    const headers = Object.keys(value[0])
    const rows = value.map(row => headers.map(header => String(row[header] || '')))
    
    return `{{TABLE:${JSON.stringify({ headers, rows })}}}`
  }

  return String(value)
}

/**
 * Process signature content
 */
function processSignatureContent(value: any, contentSchema: ContentSchema): string {
  if (!value) {
    // Generate default signature block
    return `
_____________________________          Date: _______________
Signature

_____________________________
Print Name
    `.trim()
  }

  if (typeof value === 'string') {
    return value
  }

  // Handle structured signature
  if (typeof value === 'object') {
    const sig = value as any
    let content = ''

    if (sig.name) {
      content += `\n\n_____________________________          Date: _______________\n${sig.name}`
    }

    if (sig.title) {
      content += `\n${sig.title}`
    }

    if (sig.company) {
      content += `\n${sig.company}`
    }

    return content
  }

  return String(value)
}

/**
 * Convert schema formatting to DOCX formatting
 */
function convertSchemaFormatting(
  schema: DocumentSchema, 
  customFormatting?: Partial<DocumentFormatting>
): DocumentFormatting {
  const schemaFormatting = schema.formatting
  
  const formatting: DocumentFormatting = {
    useHeaders: schemaFormatting.headers?.enabled || false,
    useFooters: schemaFormatting.footers?.enabled || false,
    pageNumbering: schemaFormatting.footers?.enabled || false,
    caseTitle: schema.title,
    courtName: schema.description,
    ...customFormatting
  }

  return formatting
}

/**
 * Create a document template from schema
 */
export function createDocumentTemplate(schema: DocumentSchema): string {
  const sections = schema.sections
    .sort((a, b) => a.order - b.order)
    .map(section => {
      let template = `<!-- ${section.title} -->\n`
      
      if (section.content.placeholder) {
        template += `{{${section.id.toUpperCase()}}}`
      } else if (section.content.defaultValue) {
        template += section.content.defaultValue
      } else {
        template += `{{${section.id.toUpperCase()}}}`
      }
      
      return template
    })

  return sections.join('\n\n')
}

/**
 * Validate document data against schema
 */
export function validateDocumentData(
  schema: DocumentSchema, 
  data: DocumentGenerationData
): string[] {
  const errors: string[] = []

  // Check required sections
  const requiredSections = schema.sections.filter(s => s.required)
  for (const section of requiredSections) {
    if (!data.sections[section.id] || !String(data.sections[section.id]).trim()) {
      errors.push(`Missing required section: ${section.title}`)
    }
  }

  // Validate content based on type
  for (const section of schema.sections) {
    const sectionData = data.sections[section.id]
    if (sectionData && section.content.validation) {
      const validation = section.content.validation
      const value = String(sectionData)

      if (validation.required && !value.trim()) {
        errors.push(`${section.title} is required`)
      }

      if (validation.minLength && value.length < validation.minLength) {
        errors.push(`${section.title} must be at least ${validation.minLength} characters`)
      }

      if (validation.maxLength && value.length > validation.maxLength) {
        errors.push(`${section.title} must be no more than ${validation.maxLength} characters`)
      }

      if (validation.pattern && !new RegExp(validation.pattern).test(value)) {
        errors.push(`${section.title} format is invalid`)
      }

      if (validation.customValidation && !validation.customValidation(value)) {
        errors.push(`${section.title} validation failed`)
      }
    }
  }

  return errors
}

/**
 * Get available document types with their schemas
 */
export function getAvailableDocumentTypes(): Array<{
  type: DocumentType
  title: string
  description: string
  schema: DocumentSchema
}> {
  return [
    {
      type: 'offer_letter' as DocumentType,
      title: 'Employment Offer Letter',
      description: 'Professional employment offer letter with standard terms',
      schema: OFFER_LETTER_SCHEMA
    },
    {
      type: 'delaware_charter' as DocumentType,
      title: 'Delaware Certificate of Incorporation',
      description: 'Legal incorporation document for Delaware corporations',
      schema: DELAWARE_CHARTER_SCHEMA
    }
  ]
}

/**
 * Generate sample data for testing a document schema
 */
export function generateSampleData(schema: DocumentSchema): DocumentGenerationData {
  const sections: Record<string, any> = {}

  for (const section of schema.sections) {
    if (section.content.defaultValue) {
      sections[section.id] = section.content.defaultValue
    } else if (section.content.placeholder) {
      sections[section.id] = `[${section.content.placeholder}]`
    } else {
      sections[section.id] = `Sample ${section.title}`
    }
  }

  return {
    documentType: schema.documentType,
    title: `Sample ${schema.title}`,
    sections,
    metadata: {
      author: 'Darrow Document Generator',
      company: 'Darrow',
      created: new Date(),
      version: schema.version
    }
  }
}