/**
 * JSON Schema definitions for structured document content
 * This provides a type-safe way to define document formatting rules
 */

import { DocumentType } from '@/lib/utils'

export interface DocumentSchema {
  title: string
  version: string
  description?: string
  documentType: DocumentType
  sections: SectionSchema[]
  formatting: DocumentFormattingSchema
  validation?: ValidationSchema
}

export interface SectionSchema {
  id: string
  title: string
  type: SectionType
  required: boolean
  order: number
  content: ContentSchema
  formatting?: SectionFormattingSchema
  subsections?: SectionSchema[]
}

export interface ContentSchema {
  type: ContentType
  placeholder?: string
  defaultValue?: string
  validation?: FieldValidation
  options?: string[] // For dropdown/select content
  multiline?: boolean
  richText?: boolean
}

export interface DocumentFormattingSchema {
  pageSetup: PageSetupSchema
  typography: TypographySchema
  spacing: SpacingSchema
  headers?: HeaderFooterSchema
  footers?: HeaderFooterSchema
  numbering?: NumberingSchema
  tables?: TableFormattingSchema
  signatures?: SignatureFormattingSchema
}

export interface PageSetupSchema {
  paperSize: PaperSize
  orientation: 'portrait' | 'landscape'
  margins: {
    top: number
    bottom: number
    left: number
    right: number
  }
  units: 'inches' | 'cm' | 'twips'
}

export interface TypographySchema {
  defaultFont: string
  fontSize: number
  lineHeight: number
  headingStyles: HeadingStyleSchema[]
  paragraphStyles: ParagraphStyleSchema[]
  characterStyles: CharacterStyleSchema[]
}

export interface HeadingStyleSchema {
  level: 1 | 2 | 3 | 4 | 5 | 6
  fontFamily?: string
  fontSize: number
  fontWeight: 'normal' | 'bold' | number
  color?: string
  textAlign: 'left' | 'center' | 'right' | 'justify'
  spacing: {
    before: number
    after: number
  }
  numbering?: {
    format: 'decimal' | 'lowerRoman' | 'upperRoman' | 'lowerLetter' | 'upperLetter'
    prefix?: string
    suffix?: string
  }
}

export interface ParagraphStyleSchema {
  name: string
  fontFamily?: string
  fontSize: number
  lineHeight: number
  textAlign: 'left' | 'center' | 'right' | 'justify'
  indent: {
    left: number
    right: number
    firstLine: number
    hanging: number
  }
  spacing: {
    before: number
    after: number
  }
}

export interface CharacterStyleSchema {
  name: string
  fontFamily?: string
  fontSize?: number
  fontWeight?: 'normal' | 'bold' | number
  fontStyle?: 'normal' | 'italic'
  textDecoration?: 'none' | 'underline' | 'line-through'
  color?: string
  backgroundColor?: string
}

export interface SpacingSchema {
  paragraphSpacing: number
  lineSpacing: number
  sectionSpacing: number
}

export interface HeaderFooterSchema {
  enabled: boolean
  content: string
  height: number
  formatting: ParagraphStyleSchema
}

export interface NumberingSchema {
  levels: NumberingLevelSchema[]
}

export interface NumberingLevelSchema {
  level: number
  format: 'decimal' | 'lowerRoman' | 'upperRoman' | 'lowerLetter' | 'upperLetter'
  text: string
  alignment: 'left' | 'center' | 'right'
  indent: {
    left: number
    hanging: number
  }
}

export interface TableFormattingSchema {
  defaultStyle: {
    borders: boolean
    headerShading: boolean
    alternatingRows: boolean
    cellPadding: number
    borderColor: string
    borderWidth: number
    headerBackgroundColor: string
    alternatingRowColor: string
  }
  columnWidths: 'auto' | 'equal' | number[]
  alignment: 'left' | 'center' | 'right'
}

export interface SignatureFormattingSchema {
  lineLength: number
  lineSpacing: number
  includeDate: boolean
  includeName: boolean
  includeTitle: boolean
  spacing: {
    before: number
    after: number
  }
}

export interface SectionFormattingSchema {
  pageBreakBefore?: boolean
  pageBreakAfter?: boolean
  keepWithNext?: boolean
  keepTogether?: boolean
  formatting?: ParagraphStyleSchema
}

export interface ValidationSchema {
  required: string[]
  patterns: Record<string, string> // field name -> regex pattern
  customValidation?: Record<string, (value: string) => boolean>
}

export interface FieldValidation {
  required?: boolean
  pattern?: string
  minLength?: number
  maxLength?: number
  customValidation?: (value: string) => boolean
}

// Enums and Types

export type SectionType = 
  | 'header'
  | 'body'
  | 'footer'
  | 'signature'
  | 'table'
  | 'list'
  | 'paragraph'
  | 'custom'

export type ContentType = 
  | 'text'
  | 'richText'
  | 'date'
  | 'number'
  | 'email'
  | 'phone'
  | 'address'
  | 'currency'
  | 'percentage'
  | 'select'
  | 'multiselect'
  | 'table'
  | 'signature'
  | 'checkbox'
  | 'custom'

export type PaperSize = 
  | 'letter'      // 8.5" x 11"
  | 'legal'       // 8.5" x 14"
  | 'a4'          // 210mm x 297mm
  | 'executive'   // 7.25" x 10.5"
  | 'custom'

// Predefined Document Schemas
export const OFFER_LETTER_SCHEMA: DocumentSchema = {
  title: "Employment Offer Letter",
  version: "1.0",
  description: "Standard employment offer letter template",
  documentType: "offer_letter" as DocumentType,
  sections: [
    {
      id: "header",
      title: "Company Header",
      type: "header",
      required: true,
      order: 1,
      content: {
        type: "richText",
        placeholder: "Company letterhead or header information"
      }
    },
    {
      id: "date",
      title: "Date",
      type: "paragraph",
      required: true,
      order: 2,
      content: {
        type: "date",
        placeholder: "Date of offer"
      }
    },
    {
      id: "recipient",
      title: "Recipient Information",
      type: "paragraph",
      required: true,
      order: 3,
      content: {
        type: "richText",
        placeholder: "Candidate name and address"
      }
    },
    {
      id: "body",
      title: "Offer Details",
      type: "body",
      required: true,
      order: 4,
      content: {
        type: "richText",
        placeholder: "Job offer details, compensation, benefits, etc."
      }
    },
    {
      id: "signature",
      title: "Signature Block",
      type: "signature",
      required: true,
      order: 5,
      content: {
        type: "signature",
        placeholder: "Signature lines for hiring manager"
      }
    }
  ],
  formatting: {
    pageSetup: {
      paperSize: "letter",
      orientation: "portrait",
      margins: {
        top: 1.0,
        bottom: 1.0,
        left: 1.25,
        right: 1.0
      },
      units: "inches"
    },
    typography: {
      defaultFont: "Times New Roman",
      fontSize: 12,
      lineHeight: 24,
      headingStyles: [
        {
          level: 1,
          fontSize: 16,
          fontWeight: "bold",
          textAlign: "center",
          spacing: { before: 0, after: 24 }
        }
      ],
      paragraphStyles: [
        {
          name: "Body",
          fontSize: 12,
          lineHeight: 24,
          textAlign: "justify",
          indent: { left: 0, right: 0, firstLine: 0, hanging: 0 },
          spacing: { before: 0, after: 12 }
        }
      ],
      characterStyles: []
    },
    spacing: {
      paragraphSpacing: 12,
      lineSpacing: 24,
      sectionSpacing: 24
    },
    signatures: {
      lineLength: 3,
      lineSpacing: 48,
      includeDate: true,
      includeName: true,
      includeTitle: true,
      spacing: { before: 48, after: 24 }
    }
  }
}

export const DELAWARE_CHARTER_SCHEMA: DocumentSchema = {
  title: "Delaware Certificate of Incorporation",
  version: "1.0",
  description: "Standard Delaware Certificate of Incorporation template",
  documentType: "delaware_charter" as DocumentType,
  sections: [
    {
      id: "title",
      title: "Document Title",
      type: "header",
      required: true,
      order: 1,
      content: {
        type: "text",
        defaultValue: "CERTIFICATE OF INCORPORATION"
      }
    },
    {
      id: "article1",
      title: "Article I - Name",
      type: "paragraph",
      required: true,
      order: 2,
      content: {
        type: "text",
        placeholder: "Corporation name"
      }
    },
    {
      id: "article2",
      title: "Article II - Registered Office",
      type: "paragraph",
      required: true,
      order: 3,
      content: {
        type: "address",
        placeholder: "Delaware registered office address"
      }
    },
    {
      id: "article3",
      title: "Article III - Purpose",
      type: "paragraph",
      required: true,
      order: 4,
      content: {
        type: "text",
        defaultValue: "to engage in any lawful act or activity for which corporations may be organized under the General Corporation Law of Delaware"
      }
    },
    {
      id: "article4",
      title: "Article IV - Capital Stock",
      type: "paragraph",
      required: true,
      order: 5,
      content: {
        type: "richText",
        placeholder: "Authorized shares and par value"
      }
    },
    {
      id: "incorporator",
      title: "Incorporator",
      type: "paragraph",
      required: true,
      order: 6,
      content: {
        type: "richText",
        placeholder: "Incorporator name and address"
      }
    },
    {
      id: "signature",
      title: "Signature",
      type: "signature",
      required: true,
      order: 7,
      content: {
        type: "signature",
        placeholder: "Incorporator signature"
      }
    }
  ],
  formatting: {
    pageSetup: {
      paperSize: "legal",
      orientation: "portrait",
      margins: {
        top: 1.5,
        bottom: 1.5,
        left: 1.25,
        right: 1.0
      },
      units: "inches"
    },
    typography: {
      defaultFont: "Times New Roman",
      fontSize: 12,
      lineHeight: 24,
      headingStyles: [
        {
          level: 1,
          fontSize: 14,
          fontWeight: "bold",
          textAlign: "center",
          spacing: { before: 0, after: 24 }
        }
      ],
      paragraphStyles: [
        {
          name: "Article",
          fontSize: 12,
          lineHeight: 24,
          textAlign: "justify",
          indent: { left: 36, right: 0, firstLine: 0, hanging: 0 },
          spacing: { before: 12, after: 12 }
        }
      ],
      characterStyles: []
    },
    spacing: {
      paragraphSpacing: 12,
      lineSpacing: 24,
      sectionSpacing: 24
    },
    headers: {
      enabled: true,
      content: "Certificate of Incorporation",
      height: 72,
      formatting: {
        name: "Header",
        fontSize: 12,
        lineHeight: 12,
        textAlign: "center",
        indent: { left: 0, right: 0, firstLine: 0, hanging: 0 },
        spacing: { before: 0, after: 12 }
      }
    },
    footers: {
      enabled: true,
      content: "Page {PAGE_NUMBER}",
      height: 72,
      formatting: {
        name: "Footer",
        fontSize: 11,
        lineHeight: 11,
        textAlign: "center",
        indent: { left: 0, right: 0, firstLine: 0, hanging: 0 },
        spacing: { before: 12, after: 0 }
      }
    },
    numbering: {
      levels: [
        {
          level: 0,
          format: "upperRoman",
          text: "ARTICLE %1",
          alignment: "left",
          indent: { left: 0, hanging: 0 }
        }
      ]
    },
    signatures: {
      lineLength: 4,
      lineSpacing: 48,
      includeDate: true,
      includeName: true,
      includeTitle: false,
      spacing: { before: 72, after: 24 }
    }
  }
}

// Validation functions
export function validateDocumentSchema(schema: DocumentSchema): string[] {
  const errors: string[] = []
  
  if (!schema.title?.trim()) {
    errors.push("Document schema must have a title")
  }
  
  if (!schema.version?.trim()) {
    errors.push("Document schema must have a version")
  }
  
  if (!schema.sections || schema.sections.length === 0) {
    errors.push("Document schema must have at least one section")
  }
  
  // Validate sections
  const sectionIds = new Set<string>()
  for (const section of schema.sections) {
    if (!section.id?.trim()) {
      errors.push("All sections must have an ID")
    } else if (sectionIds.has(section.id)) {
      errors.push(`Duplicate section ID: ${section.id}`)
    } else {
      sectionIds.add(section.id)
    }
    
    if (!section.title?.trim()) {
      errors.push(`Section ${section.id} must have a title`)
    }
    
    if (section.order < 1) {
      errors.push(`Section ${section.id} must have a positive order number`)
    }
  }
  
  // Validate page setup
  if (schema.formatting.pageSetup.margins.top < 0.5) {
    errors.push("Top margin must be at least 0.5 inches")
  }
  
  if (schema.formatting.pageSetup.margins.bottom < 0.5) {
    errors.push("Bottom margin must be at least 0.5 inches")
  }
  
  return errors
}

export function getSchemaByDocumentType(docType: DocumentType): DocumentSchema | null {
  switch (docType) {
    case 'offer_letter':
      return OFFER_LETTER_SCHEMA
    case 'delaware_charter':
      return DELAWARE_CHARTER_SCHEMA
    default:
      return null
  }
}