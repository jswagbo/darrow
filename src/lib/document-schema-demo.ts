/**
 * Demo functions for the new structured document generation system
 * This demonstrates how to use JSON schemas to create legal documents
 */

import { 
  generateDocumentFromSchema, 
  DocumentGenerationData,
  getAvailableDocumentTypes,
  generateSampleData,
  validateDocumentData
} from './document-generator'
import { 
  OFFER_LETTER_SCHEMA, 
  DELAWARE_CHARTER_SCHEMA 
} from '@/types/document-schema'
import { DocumentType } from '@/lib/utils'

/**
 * Generate a sample offer letter using the structured schema system
 */
export async function generateSampleOfferLetter(): Promise<Uint8Array> {
  const data: DocumentGenerationData = {
    documentType: 'offer_letter' as DocumentType,
    title: 'Employment Offer Letter - Software Engineer',
    sections: {
      header: 'DARROW TECHNOLOGIES, INC.\n123 Innovation Drive\nSan Francisco, CA 94105\n(555) 123-4567',
      date: new Date(),
      recipient: 'John Smith\n456 Developer Lane\nPalo Alto, CA 94301',
      body: `Dear John,

We are pleased to offer you the position of **Senior Software Engineer** at Darrow Technologies, Inc. This offer is contingent upon your acceptance of the terms and conditions outlined below.

## Position Details

**Job Title:** Senior Software Engineer
**Department:** Engineering
**Reports To:** VP of Engineering
**Start Date:** ${new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString()}

## Compensation Package

**Base Salary:** $150,000 per year, paid bi-weekly
**Equity:** 0.25% of company stock options, vesting over 4 years
**Benefits:** Health, dental, vision insurance; 401(k) with company match; unlimited PTO

## Employment Terms

This is a full-time, at-will employment position. You will be expected to work primarily from our San Francisco office with flexible remote work options.

## Confidentiality and Non-Compete

You will be required to sign our standard confidentiality agreement and non-compete clause as a condition of employment.

We are excited about the possibility of you joining our team and contributing to our mission of revolutionizing legal technology.

Please sign and return this letter by ${new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()} to indicate your acceptance of this offer.

Sincerely,

Jane Doe
CEO, Darrow Technologies, Inc.`,
      signature: {
        name: 'Jane Doe',
        title: 'Chief Executive Officer',
        company: 'Darrow Technologies, Inc.'
      }
    },
    metadata: {
      author: 'Darrow HR Department',
      company: 'Darrow Technologies, Inc.',
      created: new Date(),
      version: '1.0'
    }
  }

  const result = await generateDocumentFromSchema(data)
  return result.buffer
}

/**
 * Generate a sample Delaware charter using the structured schema system
 */
export async function generateSampleDelawareCharter(): Promise<Uint8Array> {
  const data: DocumentGenerationData = {
    documentType: 'delaware_charter' as DocumentType,
    title: 'Certificate of Incorporation - Darrow Technologies, Inc.',
    sections: {
      title: 'CERTIFICATE OF INCORPORATION OF DARROW TECHNOLOGIES, INC.',
      article1: 'The name of the corporation is Darrow Technologies, Inc.',
      article2: '123 Corporate Blvd, Suite 100, Wilmington, Delaware 19801',
      article3: 'to engage in any lawful act or activity for which corporations may be organized under the General Corporation Law of Delaware',
      article4: `The total number of shares of stock that the corporation shall have authority to issue is 10,000,000 shares of Common Stock, each with a par value of $0.001 per share.

The corporation is authorized to issue shares of Common Stock from time to time as determined by the Board of Directors.`,
      incorporator: `The name and address of the incorporator is:

John Incorporator
789 Legal Street
Wilmington, Delaware 19801`,
      signature: {
        name: 'John Incorporator',
        title: 'Incorporator'
      }
    },
    customFormatting: {
      useHeaders: true,
      useFooters: true,
      pageNumbering: true,
      caseTitle: 'Certificate of Incorporation - Darrow Technologies, Inc.',
      courtName: 'State of Delaware'
    },
    metadata: {
      author: 'Delaware Corporate Services',
      company: 'Darrow Technologies, Inc.',
      created: new Date(),
      version: '1.0'
    }
  }

  const result = await generateDocumentFromSchema(data)
  return result.buffer
}

/**
 * Demonstrate document validation using schemas
 */
export function demonstrateDocumentValidation() {
  console.log('=== Document Schema Validation Demo ===')
  
  // Example 1: Valid offer letter data
  const validData: DocumentGenerationData = {
    documentType: 'offer_letter' as DocumentType,
    title: 'Test Offer Letter',
    sections: {
      header: 'Company Header',
      date: new Date(),
      recipient: 'John Doe',
      body: 'Offer letter body content...',
      signature: 'Signature block'
    }
  }

  const validationErrors = validateDocumentData(OFFER_LETTER_SCHEMA, validData)
  console.log('Valid data validation errors:', validationErrors)

  // Example 2: Invalid data (missing required sections)
  const invalidData: DocumentGenerationData = {
    documentType: 'offer_letter' as DocumentType,
    title: 'Test Offer Letter',
    sections: {
      header: 'Company Header'
      // Missing required sections: date, recipient, body, signature
    }
  }

  const invalidErrors = validateDocumentData(OFFER_LETTER_SCHEMA, invalidData)
  console.log('Invalid data validation errors:', invalidErrors)

  return {
    validErrors: validationErrors,
    invalidErrors: invalidErrors
  }
}

/**
 * Show available document types and their schemas
 */
export function showAvailableDocumentTypes() {
  console.log('=== Available Document Types ===')
  
  const types = getAvailableDocumentTypes()
  
  types.forEach((type, index) => {
    console.log(`${index + 1}. ${type.title}`)
    console.log(`   Type: ${type.type}`)
    console.log(`   Description: ${type.description}`)
    console.log(`   Sections: ${type.schema.sections.length}`)
    console.log(`   Required sections: ${type.schema.sections.filter(s => s.required).length}`)
    console.log('')
  })

  return types
}

/**
 * Generate sample data for all available document types
 */
export async function generateAllSampleDocuments(): Promise<Record<string, Uint8Array>> {
  const types = getAvailableDocumentTypes()
  const documents: Record<string, Uint8Array> = {}

  for (const type of types) {
    const sampleData = generateSampleData(type.schema)
    const result = await generateDocumentFromSchema(sampleData)
    documents[type.type] = result.buffer
  }

  return documents
}

/**
 * Compare old vs new document generation approaches
 */
export function compareDocumentGenerationApproaches() {
  return {
    oldApproach: {
      method: 'Template-based with placeholders',
      pros: [
        'Simple to implement',
        'Direct template editing',
        'Fast for basic documents'
      ],
      cons: [
        'Limited structure validation',
        'No type safety',
        'Hard to maintain complex formatting',
        'Manual placeholder management',
        'No schema reusability'
      ]
    },
    newApproach: {
      method: 'JSON Schema-based structured generation',
      pros: [
        'Full type safety',
        'Structured validation',
        'Reusable document schemas',
        'Complex formatting support',
        'Automated content generation',
        'Easy to extend and maintain',
        'Professional Microsoft Word quality'
      ],
      cons: [
        'More complex initial setup',
        'Requires schema design',
        'Steeper learning curve'
      ]
    },
    recommendation: 'Use the new schema-based approach for all new documents. It provides much better quality, maintainability, and professional formatting.'
  }
}

/**
 * Generate a comprehensive formatting showcase document
 */
export async function generateFormattingShowcaseDocument(): Promise<Uint8Array> {
  const data: DocumentGenerationData = {
    documentType: 'offer_letter' as DocumentType,
    title: 'Document Formatting Showcase',
    sections: {
      header: 'DARROW LEGAL DOCUMENT FORMATTING SHOWCASE',
      date: new Date(),
      recipient: 'Document Formatting Demonstration',
      body: `# Enhanced Microsoft Word Legal Formatting

This document demonstrates the comprehensive formatting capabilities of the new structured document generation system.

## Typography and Text Formatting

Our system supports **professional legal typography** with:
- **Times New Roman** font family (legal standard)
- **12-point font size** for body text  
- **24-point line spacing** (double-spaced, legal standard)
- **Professional margins** (1.25" left for binding)
- **Legal paper size** (8.5" × 14")

### Enhanced Formatting Options
- **Bold text** using double asterisks
- *Italic text* using single asterisks
- __Underlined text__ using double underscores
- ~~Strikethrough text~~ using double tildes

## Professional Document Structure

### Headers and Footers
- **Automatic page numbering**
- **Case titles and court names**
- **Confidentiality notices**
- **Professional legal formatting**

### Multi-level Numbering
1. **Primary level** (decimal numbering)
   a. **Secondary level** (letter numbering)
      i. **Tertiary level** (roman numeral numbering)
      ii. **Proper hanging indentation**
   b. **Consistent formatting**
2. **Legal document hierarchy**

## Table Support

The system now supports professional tables with:
- **Bordered tables** with header shading
- **Alternating row colors**
- **Configurable column widths**
- **Professional cell padding**
- **Legal styling standards**

## Signature Blocks

Professional signature formatting includes:
- **Proper signature line length**
- **Date fields**
- **Name and title blocks**
- **Company information**
- **Legal spacing standards**

## Advanced Features

### Document Validation
- **Required field validation**
- **Format validation**
- **Custom validation rules**
- **Type-safe content**

### Schema-based Generation
- **Reusable document templates**
- **Structured content definition**
- **Professional formatting rules**
- **Microsoft Word compatibility**

This represents a significant upgrade from basic text generation to **professional legal document creation** that matches law firm standards.`,
      signature: {
        name: 'Darrow Document Generation System',
        title: 'Legal Technology Platform',
        company: 'Darrow Technologies, Inc.'
      }
    },
    customFormatting: {
      useHeaders: true,
      useFooters: true,
      pageNumbering: true,
      caseTitle: 'Document Formatting Showcase',
      courtName: 'Professional Legal Documents'
    },
    metadata: {
      author: 'Darrow Development Team',
      company: 'Darrow Technologies, Inc.',
      created: new Date(),
      version: '2.0'
    }
  }

  const result = await generateDocumentFromSchema(data)
  return result.buffer
}