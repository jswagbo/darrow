import { DocumentType } from './utils'

export interface DocumentInputs {
  [key: string]: string
}

export interface PromptConfig {
  systemPrompt: string
  template: string
  requiredFields: string[]
}

// Embedded prompts and templates for serverless compatibility
const EMBEDDED_CONTENT = {
  prompts: {
    delaware_charter: `# Delaware Charter Document Generation Prompt

## System Instructions

You are a legal document assistant specialized in Delaware Certificate of Incorporation documents. Your role is to ONLY fill in the placeholder values marked with {{PLACEHOLDER_NAME}} in the template. You must NEVER modify the legal language, structure, or format of the template.

## Critical Rules:
1. ONLY replace text inside double curly braces {{LIKE_THIS}}
2. NEVER modify any legal language outside of placeholders
3. NEVER add or remove sections
4. NEVER change the legal structure or format
5. Use appropriate legal formatting and capitalization

## Template Placeholders to Fill:

- {{COMPANY_NAME}} - Full legal name of the corporation
- {{REGISTERED_OFFICE_ADDRESS}} - Delaware registered office address
- {{REGISTERED_AGENT_NAME}} - Name of registered agent in Delaware
- {{BUSINESS_PURPOSE}} - Business purpose (usually "to engage in any lawful act or activity")
- {{TOTAL_SHARES}} - Total number of authorized shares
- {{INCORPORATOR_NAME}} - Name of incorporator
- {{INCORPORATOR_ADDRESS}} - Address of incorporator`,

    safe_post: `# YC SAFE Post-Money Document Generation Prompt

## System Instructions

You are a legal document assistant specialized in Y Combinator SAFE (Simple Agreement for Future Equity) Post-Money documents. Your role is to ONLY fill in the placeholder values marked with {{PLACEHOLDER_NAME}} in the official YC template. You must NEVER modify the legal language, structure, or format of the template.

## Critical Rules:
1. ONLY replace text inside double curly braces {{LIKE_THIS}}
2. NEVER modify any legal language outside of placeholders
3. NEVER add or remove sections from the official YC template
4. NEVER change the legal structure or format
5. Use appropriate legal formatting and capitalization

## Template Placeholders to Fill:

- {{INVESTOR_NAME}} - Full legal name of the investor
- {{COMPANY_NAME}} - Full legal name of the company
- {{PURCHASE_AMOUNT}} - Dollar amount of investment
- {{VALUATION_CAP}} - Valuation cap amount
- {{DISCOUNT_RATE}} - Discount rate percentage (usually 15-25%)
- {{DATE}} - Date of agreement execution`,

    offer_letter: `# Employment Offer Letter Generation Prompt

## System Instructions

You are a legal document assistant specialized in employment offer letters. Your role is to ONLY fill in the placeholder values marked with {{PLACEHOLDER_NAME}} in the professional EPG template. You must NEVER modify the legal language, structure, or format of the template.

## Critical Rules:
1. ONLY replace text inside double curly braces {{LIKE_THIS}}
2. NEVER modify any legal language outside of placeholders
3. NEVER add or remove sections
4. NEVER change the legal structure or format
5. Use appropriate legal formatting and capitalization
6. Maintain all arbitration clauses and legal provisions exactly as written

## Template Placeholders to Fill:

- {{COMPANY_NAME}} - Full legal name of the company
- {{COMPANY_ADDRESS}} - Company's full mailing address
- {{DATE}} - Current date for the offer letter
- {{CANDIDATE_NAME}} - Full name of job candidate
- {{JOB_TITLE}} - Official job title
- {{START_DATE}} - Employment start date
- {{ANNUAL_SALARY}} - Annual base salary amount (numbers only, no $)
- {{REPORTING_MANAGER}} - Name of direct manager/supervisor
- {{STOCK_OPTIONS}} - Number of stock option shares (if applicable)
- {{PLAN_NAME}} - Name of stock option plan (e.g., "2024 Equity Incentive Plan")
- {{VESTING_CLIFF}} - Cliff vesting percentage (usually 25)
- {{MONTHLY_VESTING}} - Monthly vesting percentage after cliff (usually 2.08)
- {{OFFER_EXPIRATION_DATE}} - Date by which offer must be accepted
- {{HIRING_MANAGER_NAME}} - Name of person making the offer
- {{HIRING_MANAGER_TITLE}} - Title of hiring manager`,

    rspa: `# RSPA (Restricted Stock Purchase Agreement) Generation Prompt

## System Instructions

You are a legal document assistant specialized in Restricted Stock Purchase Agreements. Your role is to ONLY fill in the placeholder values marked with {{PLACEHOLDER_NAME}} in the template. You must NEVER modify the legal language, structure, or format of the template.

## Critical Rules:
1. ONLY replace text inside double curly braces {{LIKE_THIS}}
2. NEVER modify any legal language outside of placeholders
3. NEVER add or remove sections
4. NEVER change the legal structure or format
5. Use appropriate legal formatting and capitalization

## Template Placeholders to Fill:

- {{COMPANY_NAME}} - Full legal name of the company
- {{PURCHASER_NAME}} - Full name of stock purchaser
- {{SHARES_PURCHASED}} - Number of shares being purchased
- {{PURCHASE_PRICE_PER_SHARE}} - Price per share
- {{TOTAL_PURCHASE_PRICE}} - Total purchase amount
- {{VESTING_SCHEDULE}} - Vesting schedule description
- {{PURCHASE_DATE}} - Date of stock purchase`,

    board_consent: `# Board/Stockholder Consent Generation Prompt

## System Instructions

You are a legal document assistant specialized in Board of Directors and Stockholder consent resolutions. Your role is to ONLY fill in the placeholder values marked with {{PLACEHOLDER_NAME}} in the template. You must NEVER modify the legal language, structure, or format of the template.

## Critical Rules:
1. ONLY replace text inside double curly braces {{LIKE_THIS}}
2. NEVER modify any legal language outside of placeholders
3. NEVER add or remove sections
4. NEVER change the legal structure or format
5. Use appropriate legal formatting and capitalization

## Template Placeholders to Fill:

- {{COMPANY_NAME}} - Full legal name of the company
- {{CONSENT_TYPE}} - "Board of Directors" or "Stockholders"
- {{RESOLUTION_TITLE_1}} - Title of first resolution
- {{RESOLUTION_TEXT_1}} - Text of first resolution
- {{RESOLUTION_TITLE_2}} - Title of second resolution (if applicable)
- {{RESOLUTION_TEXT_2}} - Text of second resolution (if applicable)
- {{DATE}} - Date of consent execution`
  },

  templates: {
    delaware_charter: `CERTIFICATE OF INCORPORATION
OF
{{COMPANY_NAME}}

FIRST: The name of this corporation is {{COMPANY_NAME}}.

SECOND: The address of the registered office of this corporation in the State of Delaware is {{REGISTERED_OFFICE_ADDRESS}}, and the name of its registered agent at such address is {{REGISTERED_AGENT_NAME}}.

THIRD: The nature of the business or purposes to be conducted or promoted is {{BUSINESS_PURPOSE}}.

FOURTH: The total number of shares of all classes of stock which the corporation shall have authority to issue is {{TOTAL_SHARES}} shares of Common Stock, each with a par value of $0.0001 per share.

FIFTH: The name and mailing address of the incorporator is:
{{INCORPORATOR_NAME}}
{{INCORPORATOR_ADDRESS}}

SIXTH: The corporation is to have perpetual existence.

IN WITNESS WHEREOF, I have executed this Certificate of Incorporation this _____ day of __________, 2024.

_____________________
{{INCORPORATOR_NAME}}, Incorporator`,

    safe_post: `[DOCX_TEMPLATE_YC_SAFE_POST_MONEY]`,

    offer_letter: `\{{COMPANY_NAME}}

\{{COMPANY_ADDRESS}}

\{{DATE}}



Dear \{{CANDIDATE_NAME}},



We are pleased to offer you employment with \{{COMPANY_NAME}} in the position of \{{JOB_TITLE}}.



**Employment Terms**

**Position:** \{{JOB_TITLE}}

**Start Date:** \{{START_DATE}}

**Annual Salary:** $\{{ANNUAL_SALARY}}

**Reporting Manager:** \{{REPORTING_MANAGER}}

**Benefits:** This position includes our standard benefits package, including health insurance, dental insurance, and 401(k) participation, subject to the terms and conditions of the applicable benefit plans.



**Stock Options:** We will recommend to the Board of Directors that you be granted the option to purchase up to \{{STOCK_OPTIONS}} shares of Common Stock under our \{{PLAN_NAME}} at fair market value. The shares will vest at \{{VESTING_CLIFF}}% after your first anniversary, then \{{MONTHLY_VESTING}}% per month thereafter, subject to Board approval.



**Employment Relationship:** This offer is contingent upon satisfactory completion of our standard background check process. Your employment with \{{COMPANY_NAME}} is at-will, meaning that either you or the company may terminate the employment relationship at any time, with or without cause or notice.



**Confidentiality:** As a condition of employment, you must sign and abide by our standard Employee Invention Assignment and Confidentiality Agreement.



Please confirm your acceptance of this offer by signing and returning this letter by \{{OFFER_EXPIRATION_DATE}}.



We look forward to having you join our team!

Sincerely,

\{{HIRING_MANAGER_NAME}}

\{{HIRING_MANAGER_TITLE}}



---

**\{{COMPANY_NAME}}**

I accept the terms of this offer:

**Signature:** _________________________________    **Date:** ___________

\{{CANDIDATE_NAME}}`,

    rspa: `RESTRICTED STOCK PURCHASE AGREEMENT

This Restricted Stock Purchase Agreement (this "Agreement") is made as of {{PURCHASE_DATE}} between {{COMPANY_NAME}}, a Delaware corporation (the "Company"), and {{PURCHASER_NAME}} (the "Purchaser").

## 1. Purchase and Sale of Stock

Subject to the terms and conditions of this Agreement, the Purchaser agrees to purchase from the Company, and the Company agrees to sell to the Purchaser, {{SHARES_PURCHASED}} shares of Common Stock of the Company (the "Shares") at a purchase price of {{PURCHASE_PRICE_PER_SHARE}} per share, for a total purchase price of {{TOTAL_PURCHASE_PRICE}} (the "Purchase Price").

## 2. Vesting Schedule

The Shares shall vest according to the following schedule: {{VESTING_SCHEDULE}}

## 3. Repurchase Right

The Company shall have the right to repurchase any unvested Shares upon termination of Purchaser's relationship with the Company.

## 4. Transfer Restrictions

The Shares may not be transferred without the Company's prior written consent.

IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first written above.

{{COMPANY_NAME}}

By: _________________________
Name:
Title:

PURCHASER:

_________________________
{{PURCHASER_NAME}}`,

    board_consent: `{{CONSENT_TYPE}} CONSENT OF
{{COMPANY_NAME}}

The undersigned, constituting all of the {{CONSENT_TYPE}} of {{COMPANY_NAME}}, a Delaware corporation (the "Company"), hereby consent to the adoption of the following resolutions:

## RESOLUTION 1: {{RESOLUTION_TITLE_1}}

RESOLVED: {{RESOLUTION_TEXT_1}}

## RESOLUTION 2: {{RESOLUTION_TITLE_2}}

RESOLVED: {{RESOLUTION_TEXT_2}}

This consent may be executed in counterparts, each of which shall be deemed an original and all of which together shall constitute one and the same instrument.

Dated: {{DATE}}

SIGNATURES:

_________________________
[Name], [Title]

_________________________
[Name], [Title]`
  }
}

/**
 * Load prompt configuration for a specific document type (serverless compatible)
 */
export function getPromptConfig(docType: DocumentType): PromptConfig {
  const configs: Record<DocumentType, PromptConfig> = {
    delaware_charter: {
      systemPrompt: EMBEDDED_CONTENT.prompts.delaware_charter,
      template: EMBEDDED_CONTENT.templates.delaware_charter,
      requiredFields: ['COMPANY_NAME', 'INCORPORATOR_NAME', 'INCORPORATOR_ADDRESS']
    },
    safe_post: {
      systemPrompt: EMBEDDED_CONTENT.prompts.safe_post,
      template: EMBEDDED_CONTENT.templates.safe_post,
      requiredFields: ['INVESTOR_NAME', 'COMPANY_NAME', 'PURCHASE_AMOUNT', 'VALUATION_CAP']
    },
    offer_letter: {
      systemPrompt: EMBEDDED_CONTENT.prompts.offer_letter,
      template: EMBEDDED_CONTENT.templates.offer_letter,
      requiredFields: ['COMPANY_NAME', 'CANDIDATE_NAME', 'JOB_TITLE', 'ANNUAL_SALARY']
    },
    rspa: {
      systemPrompt: EMBEDDED_CONTENT.prompts.rspa,
      template: EMBEDDED_CONTENT.templates.rspa,
      requiredFields: ['COMPANY_NAME', 'PURCHASER_NAME', 'SHARES_PURCHASED', 'PURCHASE_PRICE_PER_SHARE']
    },
    board_consent: {
      systemPrompt: EMBEDDED_CONTENT.prompts.board_consent,
      template: EMBEDDED_CONTENT.templates.board_consent,
      requiredFields: ['COMPANY_NAME', 'RESOLUTION_TITLE_1', 'RESOLUTION_TEXT_1']
    }
  }

  return configs[docType]
}

/**
 * Load document template content (serverless compatible)
 */
export function getTemplate(docType: DocumentType): string {
  const config = getPromptConfig(docType)
  return config.template
}

/**
 * Build the complete prompt for OpenAI (serverless compatible)
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
 * Fill unfilled placeholders with sensible fallback values
 */
function fillUnfilledPlaceholders(content: string): string {
  const fallbackValues: { [key: string]: string } = {
    // Common date placeholders
    'DATE': new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    'CURRENT_DATE': new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    'TODAY_DATE': new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    'SIGNING_DATE': new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    
    // Financial placeholders
    'DISCOUNT_RATE': '20%',
    'VALUATION_CAP': '$[VALUATION_CAP]',
    'INVESTMENT_AMOUNT': '$[INVESTMENT_AMOUNT]',
    'PURCHASE_PRICE': '$[PURCHASE_PRICE]',
    
    // Company placeholders
    'COMPANY_NAME': '[COMPANY_NAME]',
    'COMPANY_ADDRESS': '[COMPANY_ADDRESS]',
    'STATE_OF_INCORPORATION': 'Delaware',
    
    // People placeholders
    'INVESTOR_NAME': '[INVESTOR_NAME]',
    'FOUNDER_NAME': '[FOUNDER_NAME]',
    'EMPLOYEE_NAME': '[EMPLOYEE_NAME]',
    'DIRECTOR_NAME': '[DIRECTOR_NAME]',
    'CANDIDATE_NAME': '[CANDIDATE_NAME]',
    'CANDIDATE_ADDRESS': '[CANDIDATE_ADDRESS]',
    'REPORTING_MANAGER': '[REPORTING_MANAGER]',
    'HIRING_MANAGER_NAME': '[HIRING_MANAGER_NAME]',
    'HIRING_MANAGER_TITLE': '[HIRING_MANAGER_TITLE]',
    
    // Employment specific placeholders
    'JOB_TITLE': '[JOB_TITLE]',
    'EXEMPT_STATUS': 'an exempt',
    'WORK_LOCATION': '[WORK_LOCATION]',
    'START_DATE': new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }), // 2 weeks from now
    'ANNUAL_SALARY': '[ANNUAL_SALARY]',
    'STOCK_OPTIONS': '[STOCK_OPTIONS]',
    'PLAN_NAME': '2024 Equity Incentive Plan',
    'VESTING_CLIFF': '25',
    'MONTHLY_VESTING': '2.08',
    'OFFER_EXPIRATION_DATE': new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }), // 1 week from now
    
    // Legal placeholders
    'JURISDICTION': 'Delaware',
    'GOVERNING_LAW': 'Delaware',
    
    // Default fallback
    'DEFAULT': '[TO BE COMPLETED]'
  }

  // Replace unfilled placeholders with fallback values
  return content.replace(/\{\{([^}]+)\}\}/g, (match, placeholder) => {
    const cleanPlaceholder = placeholder.trim().toUpperCase()
    
    // Try exact match first
    if (fallbackValues[cleanPlaceholder]) {
      return fallbackValues[cleanPlaceholder]
    }
    
    // Try partial matches for common patterns
    if (cleanPlaceholder.includes('DATE')) {
      return fallbackValues['DATE']
    }
    if (cleanPlaceholder.includes('NAME')) {
      return `[${cleanPlaceholder}]`
    }
    if (cleanPlaceholder.includes('AMOUNT') || cleanPlaceholder.includes('PRICE')) {
      return `$[${cleanPlaceholder}]`
    }
    if (cleanPlaceholder.includes('RATE') || cleanPlaceholder.includes('PERCENT')) {
      return `[${cleanPlaceholder}]%`
    }
    
    // Default fallback
    return `[${cleanPlaceholder}]`
  })
}

/**
 * Clean and validate generated document content
 */
export function validateGeneratedDocument(
  docType: DocumentType, 
  generatedContent: string
): { isValid: boolean; errors: string[]; content?: string } {
  const errors: string[] = []
  
  // First, auto-fill any remaining placeholders
  const filledContent = fillUnfilledPlaceholders(generatedContent)
  
  // Check if there are still any unfilled placeholders (should be none now)
  const placeholderRegex = /\{\{[^}]+\}\}/g
  const remainingPlaceholders = filledContent.match(placeholderRegex)
  
  if (remainingPlaceholders) {
    // This should rarely happen now, but keep as a safety check
    console.warn('Some placeholders could not be auto-filled:', remainingPlaceholders)
  }
  
  // Check for empty sections (multiple consecutive newlines) in filled content
  if (filledContent.includes('\n\n\n\n')) {
    errors.push('Document contains empty sections')
  }
  
  // Ensure minimum document length
  if (filledContent.trim().length < 500) {
    errors.push('Generated document appears to be too short')
  }
  
  // Document type specific validations using filled content
  switch (docType) {
    case 'safe_post':
      if (!filledContent.includes('SAFE') && !filledContent.includes('Simple Agreement')) {
        errors.push('SAFE document must contain SAFE terminology')
      }
      break
    case 'delaware_charter':
      if (!filledContent.includes('Delaware') || !filledContent.includes('Certificate of Incorporation')) {
        errors.push('Delaware charter must contain proper legal language')
      }
      break
  }
  
  // Return the filled content along with validation results
  return {
    isValid: errors.length === 0,
    errors,
    content: filledContent
  }
}