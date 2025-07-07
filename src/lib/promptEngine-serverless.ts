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

You are a legal document assistant specialized in employment offer letters. Your role is to ONLY fill in the placeholder values marked with {{PLACEHOLDER_NAME}} in the template. You must NEVER modify the legal language, structure, or format of the template.

## Critical Rules:
1. ONLY replace text inside double curly braces {{LIKE_THIS}}
2. NEVER modify any legal language outside of placeholders
3. NEVER add or remove sections
4. NEVER change the legal structure or format
5. Use appropriate legal formatting and capitalization

## Template Placeholders to Fill:

- {{DATE}} - Current date for the offer letter
- {{CANDIDATE_NAME}} - Full name of job candidate
- {{CANDIDATE_ADDRESS}} - Candidate's mailing address
- {{COMPANY_NAME}} - Full legal name of the company
- {{JOB_TITLE}} - Official job title
- {{REPORTING_MANAGER}} - Name of direct manager/supervisor
- {{EXEMPT_STATUS}} - "an exempt" or "a non-exempt" employment status
- {{WORK_LOCATION}} - Office location (city/state)
- {{START_DATE}} - Employment start date
- {{ANNUAL_SALARY}} - Annual base salary amount (numbers only, no $)
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

    offer_letter: `{{DATE}}


{{CANDIDATE_NAME}}
{{CANDIDATE_ADDRESS}}

Re:	Offer of Employment by {{COMPANY_NAME}}

Dear {{CANDIDATE_NAME}}: 

I am very pleased to confirm our offer to you of employment with {{COMPANY_NAME}} (the "Company").  The terms of our offer and the benefits currently provided by the Company are as follows:

Position and Start Date.  You are being offered the position of {{JOB_TITLE}}, reporting to {{REPORTING_MANAGER}}.  This is {{EXEMPT_STATUS}} position based in our {{WORK_LOCATION}} office.  Your anticipated start date will be {{START_DATE}}.  

Starting Salary.  Your starting salary will be ${{ANNUAL_SALARY}} per year and will be subject to annual review. 

Benefits.  In addition, you will be eligible to participate in regular health insurance, bonus and other employee benefit plans established by the Company for its employees from time to time.  

The Company reserves the right to change or otherwise modify, in its sole discretion, the preceding terms of employment.

Stock Option.  We will recommend to the Board of Directors of the Company (the "Board") that you be granted the option to purchase up to {{STOCK_OPTIONS}} shares of Common Stock of the Company under our {{PLAN_NAME}} (the "Plan") at the fair market value of the Company's Common Stock, as determined by the Board on the date the Board approves such grant.  The shares subject to the stock option will vest at the rate of {{VESTING_CLIFF}}% at the end of your first anniversary with the Company, and an additional {{MONTHLY_VESTING}}% per month thereafter, for so long as you remain employed by the Company through each vesting date.  However, the grant of such option by the Company is subject to the Board's approval.  Further details on the Plan and any specific option grant to you will be provided upon approval of such grant by the Board.

Protection of Confidential and Proprietary Information.  As an employee of the Company, you will have access to certain confidential information of the Company and you may, during the course of your employment, develop certain information or inventions that will be the property of the Company.  To protect the Company's interests, as a condition of employment, you must sign and abide by the Company's standard "Employee Invention Assignment and Confidentiality Agreement."  

No Breach of Obligations to Prior Employers.  We wish to impress upon you that we do not want you to, and we hereby direct you not to, bring with you any confidential or proprietary material of any former employer or violate any other obligations you may have to any former employer.  You represent that your signing of this offer letter, agreement(s) concerning stock options granted to you, if any, under the Plan and the Company's Employee Invention Assignment and Confidentiality Agreement and your commencement of employment with the Company will not violate any agreement currently in place between yourself and current or past employers.

No Competition During Employment.  During the period that you render services to the Company, you agree to not engage in any employment, business or activity that is in any way competitive with the business or proposed business of the Company.  You will disclose to the Company in writing any other gainful employment, business or activity that you are currently associated with or participate in that competes with the Company.  You will not assist any other person or organization in competing with the Company or in preparing to engage in competition with the business or proposed business of the Company.  

At Will Employment.  Employment with the Company is for no specific period of time.  Should you accept our offer, you will be an at-will employee of the Company, which means the employment relationship can be terminated by either of us for any reason, at any time, with or without prior notice and with or without cause.  Any statements or representations to the contrary (and, indeed, any statements contradicting any provision in this letter) are superseded by this agreement.  Further, your participation in any stock option or benefit program is not to be regarded as assuring you of continuing employment for any particular period of time.  Although your job duties, title, compensation and benefits, as well as the Company's personnel policies and practices, may change from time to time, the "at-will" nature of your employment may be changed only in an express, written employment agreement signed by you and a duly authorized officer of the Company (other than you).

Tax Matters.  All forms of compensation referred to in this agreement are subject to reduction to reflect applicable withholding and payroll taxes and other deductions required by law.  

Authorization to Work.  Please note that because of employer regulations adopted in the Immigration Reform and Control Act of 1986, within three (3) business days of starting your new position you will need to present documentation demonstrating that you have authorization to work in the United States.  If you have questions about this requirement, which applies to U.S. citizens and non-U.S. citizens alike, you may contact our personnel office.

Arbitration and Class and Collective Action Waiver.  To the fullest extent permitted by law, you and the Company agree to submit to mandatory binding arbitration, pursuant to and governed by the Federal Arbitration Act (the "FAA"), any and all claims that (a) you may have against the Company and its directors, officers, owners, employees, agents, successors and assigns, and (b) the Company may have against you, arising out of or related to your employment with the Company and the termination thereof, including, but not limited to, claims for unpaid wages, wrongful termination, torts, stock or stock options or other ownership interest in the Company, discrimination, harassment and/or retaliation based upon any federal, state or local ordinance, statute, regulation or constitutional provision, and individual claims under the California Private Attorneys General Act (California Labor Code Section 2698, et seq.) ("PAGA") (collectively, "Arbitrable Claims").  Further, to the fullest extent permitted by law, you and the Company agree that no class or collective actions can be asserted in arbitration, court or any other forum.  All claims must be brought solely in your or the Company's individual capacity, and not as a plaintiff or class member in any purported class or collective proceeding.

Notwithstanding the foregoing, nothing in this arbitration provision restricts: (w) your right under the FAA to elect to pursue claims for sexual harassment and/or sexual assault in court, on an individual, class action or collective action basis; (x) your right, if any, to file in court a non-individual, representative action under PAGA, if you have standing to pursue such an action and it is permitted under applicable law; (y) your right to file administrative claims you may bring before any government agency where, as a matter of law, the parties may not restrict the employee's ability to file such claims (including, but not limited to, the National Labor Relations Board, the Equal Employment Opportunity Commission and the Department of Labor, and before state agencies in connection with claims for workers' compensation, unemployment and/or disability insurance benefits); or (z) a party's right to seek injunctive or other provisional relief in court, where permitted by applicable law, including, but not limited to, in connection with the misappropriation of a party's private, proprietary, confidential or trade secret information.

SUBJECT TO THE ABOVE, THE PARTIES HEREBY WAIVE ANY RIGHTS THEY MAY HAVE TO TRIAL BY JURY IN REGARD TO ARBITRABLE CLAIMS.  THE PARTIES FURTHER WAIVE ANY RIGHTS THEY MAY HAVE TO PURSUE OR PARTICIPATE IN A CLASS OR COLLECTIVE ACTION PERTAINING TO ANY CLAIMS BETWEEN YOU AND THE COMPANY.

The arbitration shall be conducted through JAMS before a single neutral arbitrator, in accordance with the JAMS employment arbitration rules then in effect, provided however, that the FAA, including its procedural provisions for compelling arbitration, shall govern and apply to this arbitration provision.  The JAMS rules may be found at https://www.jamsadr.com/rules-employment.  If you are unable to access these rules, please let me know and I will provide you with a hardcopy.  Unless the parties agree otherwise, the arbitration hearing shall take place in the JAMS office nearest to your current or most recent former place of work.  The arbitrator shall issue a written decision that contains the essential findings and conclusions on which the decision is based.  This arbitration provision is governed by and will be construed in accordance with the FAA, and it shall only apply to claims that are subject to mandatory binding arbitration under applicable law.  If, for any reason, any term of this arbitration provision is held to be invalid or unenforceable, all other valid terms and conditions herein shall be severable in nature and remain fully enforceable.

Background Check.  This offer is contingent upon a satisfactory verification of criminal, education, driving and/or employment background.  This offer can be rescinded based upon data received in the verification.

Entire Agreement.  This offer, once accepted, constitutes the entire agreement between you and the Company with respect to the subject matter hereof and supersedes all prior offers, negotiations and agreements, if any, whether written or oral, relating to such subject matter.  You acknowledge that neither the Company nor its agents have made any promise, representation or warranty whatsoever, either express or implied, written or oral, which is not contained in this agreement for the purpose of inducing you to execute the agreement, and you acknowledge that you have executed this agreement in reliance only upon such promises, representations and warranties as are contained herein.  

Acceptance.  This offer will remain open until {{OFFER_EXPIRATION_DATE}}.  If you decide to accept our offer, and I hope you will, please sign the enclosed copy of this letter in the space indicated and return it to me.  Your signature will acknowledge that you have read and understood and agreed to the terms and conditions of this offer letter and the attached documents, if any.  Should you have anything else that you wish to discuss, please do not hesitate to call me.

We look forward to the opportunity to welcome you to the Company.

Very truly yours,

{{HIRING_MANAGER_NAME}}, {{HIRING_MANAGER_TITLE}}

I have read and understood this offer letter and hereby acknowledge, accept and agree to the terms as set forth above and further acknowledge that no other commitments were made to me as part of my employment offer except as specifically set forth herein.

		Date signed: _______________	

{{CANDIDATE_NAME}}`,

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