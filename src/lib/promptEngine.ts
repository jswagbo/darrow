import { DocumentType } from './utils'
import { readFileSync } from 'fs'
import { join } from 'path'

export interface DocumentInputs {
  [key: string]: string
}

export interface PromptConfig {
  systemPrompt: string
  templatePath: string
  requiredFields: string[]
}

/**
 * Load prompt configuration for a specific document type
 */
export function getPromptConfig(docType: DocumentType): PromptConfig {
  const promptsDir = join(process.cwd(), 'src', 'prompts')
  const templatesDir = join(process.cwd(), 'templates')
  
  const configs: Record<DocumentType, PromptConfig> = {
    delaware_charter: {
      systemPrompt: readFileSync(join(promptsDir, 'delaware_charter.md'), 'utf-8'),
      templatePath: join(templatesDir, 'delaware_charter.md'),
      requiredFields: ['COMPANY_NAME', 'INCORPORATOR_NAME', 'INCORPORATOR_ADDRESS']
    },
    safe_post: {
      systemPrompt: readFileSync(join(promptsDir, 'safe_post.md'), 'utf-8'),
      templatePath: join(templatesDir, 'safe_post_money.docx'),
      requiredFields: ['INVESTOR_NAME', 'COMPANY_NAME', 'PURCHASE_AMOUNT', 'VALUATION_CAP']
    },
    offer_letter: {
      systemPrompt: readFileSync(join(promptsDir, 'offer_letter.md'), 'utf-8'),
      templatePath: join(templatesDir, 'offer_letter.md'),
      requiredFields: ['COMPANY_NAME', 'CANDIDATE_NAME', 'JOB_TITLE', 'ANNUAL_SALARY']
    },
    rspa: {
      systemPrompt: readFileSync(join(promptsDir, 'rspa.md'), 'utf-8'),
      templatePath: join(templatesDir, 'rspa.md'),
      requiredFields: ['COMPANY_NAME', 'PURCHASER_NAME', 'SHARES_PURCHASED', 'PURCHASE_PRICE_PER_SHARE']
    },
    board_consent: {
      systemPrompt: readFileSync(join(promptsDir, 'board_consent.md'), 'utf-8'),
      templatePath: join(templatesDir, 'board_consent.md'),
      requiredFields: ['COMPANY_NAME', 'RESOLUTION_TITLE_1', 'RESOLUTION_TEXT_1']
    }
  }

  return configs[docType]
}

/**
 * Load document template content
 */
export function getTemplate(docType: DocumentType): string {
  const config = getPromptConfig(docType)
  
  // For DOCX files, we'll handle them differently in the document generation
  if (config.templatePath.endsWith('.docx')) {
    return '[DOCX_TEMPLATE]' // Placeholder for DOCX processing
  }
  
  return readFileSync(config.templatePath, 'utf-8')
}

/**
 * Build the complete prompt for OpenAI
 */
export function buildPrompt(
  docType: DocumentType, 
  userInput: string, 
  additionalContext?: string
): string {
  const config = getPromptConfig(docType)
  const template = getTemplate(docType)
  
  const prompt = `${config.systemPrompt}

## Document Template:
${template}

## User Requirements:
${userInput}

${additionalContext ? `## Additional Context:\n${additionalContext}` : ''}

## Instructions:
Based on the user requirements above, fill in ALL the placeholder values in the template. Return ONLY the completed document with all placeholders replaced with appropriate values. Do not include any explanations or additional text outside the document.`

  return prompt
}

/**
 * Validate that required fields can be extracted from user input
 */
export function validateRequiredFields(
  docType: DocumentType, 
  extractedData: DocumentInputs
): { isValid: boolean; missingFields: string[] } {
  const config = getPromptConfig(docType)
  const missingFields = config.requiredFields.filter(
    field => !extractedData[field] || extractedData[field].trim() === ''
  )
  
  return {
    isValid: missingFields.length === 0,
    missingFields
  }
}

/**
 * Extract structured data from user input using AI
 */
export function buildExtractionPrompt(docType: DocumentType, userInput: string): string {
  const config = getPromptConfig(docType)
  
  return `Extract the following information from the user input for a ${docType} document:

Required fields: ${config.requiredFields.join(', ')}

User input: "${userInput}"

Return a JSON object with the extracted values. Use "MISSING" for any values you cannot determine from the input.

Example format:
{
  "COMPANY_NAME": "Acme Corp",
  "FIELD_2": "MISSING",
  ...
}

JSON:`
}

/**
 * Clean and validate generated document content
 */
export function validateGeneratedDocument(
  docType: DocumentType, 
  generatedContent: string
): { isValid: boolean; errors: string[] } {
  const errors: string[] = []
  
  // Check for remaining placeholders
  const placeholderRegex = /\{\{[^}]+\}\}/g
  const remainingPlaceholders = generatedContent.match(placeholderRegex)
  
  if (remainingPlaceholders) {
    errors.push(`Unfilled placeholders found: ${remainingPlaceholders.join(', ')}`)
  }
  
  // Check for empty sections (multiple consecutive newlines)
  if (generatedContent.includes('\n\n\n\n')) {
    errors.push('Document contains empty sections')
  }
  
  // Ensure minimum document length
  if (generatedContent.trim().length < 500) {
    errors.push('Generated document appears to be too short')
  }
  
  // Document type specific validations
  switch (docType) {
    case 'safe_post':
      if (!generatedContent.includes('SAFE') && !generatedContent.includes('Simple Agreement')) {
        errors.push('SAFE document must contain SAFE terminology')
      }
      break
    case 'delaware_charter':
      if (!generatedContent.includes('Delaware') || !generatedContent.includes('Certificate of Incorporation')) {
        errors.push('Delaware charter must contain proper legal language')
      }
      break
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}