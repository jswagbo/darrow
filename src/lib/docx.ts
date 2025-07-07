import { 
  Document, 
  Packer, 
  Paragraph, 
  TextRun, 
  HeadingLevel,
  AlignmentType,
  UnderlineType,
  PageBreak
} from 'docx'
import { DocumentType } from './utils'

export interface DocxGenerationOptions {
  title: string
  content: string
  docType: DocumentType
  metadata?: {
    author?: string
    company?: string
    created?: Date
  }
}

/**
 * Convert text content to properly formatted DOCX paragraphs for legal documents
 */
function textToDocxParagraphs(content: string, docType?: DocumentType): Paragraph[] {
  const paragraphs: Paragraph[] = []
  
  // Split content into sections by double line breaks
  const sections = content
    .replace(/\r\n/g, '\n') // Normalize line endings
    .split(/\n\s*\n/) // Split on double line breaks
    .map(section => section.trim())
    .filter(section => section.length > 0)

  for (let sectionIndex = 0; sectionIndex < sections.length; sectionIndex++) {
    const section = sections[sectionIndex]
    const lines = section.split('\n').map(line => line.trim()).filter(line => line.length > 0)
    
    if (lines.length === 0) continue

    // Special handling for offer letters
    if (docType === 'offer_letter') {
      // Check if this is the signature section (contains "I have read and understood")
      if (section.includes('I have read and understood')) {
        // Add page break before signature section for offer letters
        paragraphs.push(
          new Paragraph({
            children: [new PageBreak()],
            spacing: { after: 240 }
          })
        )
      }
    }

    // Check if this is a title/heading (all caps, short, or contains specific keywords)
    const firstLine = lines[0]
    const isTitle = (
      firstLine.length < 100 && 
      (firstLine === firstLine.toUpperCase() || 
       firstLine.includes('CERTIFICATE') || 
       firstLine.includes('AGREEMENT') ||
       firstLine.includes('RESOLVED') ||
       firstLine.includes('WHEREAS') ||
       firstLine.includes('ARTICLE') ||
       firstLine.includes('SECTION') ||
       firstLine.includes('Re:'))
    )

    if (isTitle) {
      // Format as heading
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: firstLine,
              bold: true,
              size: 24, // 12pt
              allCaps: firstLine === firstLine.toUpperCase(),
              font: "Times New Roman"
            })
          ],
          alignment: firstLine.includes('CERTIFICATE') || firstLine.includes('AGREEMENT') ? 
            AlignmentType.CENTER : AlignmentType.LEFT,
          spacing: { 
            before: firstLine.includes('CERTIFICATE') || firstLine.includes('AGREEMENT') ? 0 : 240,
            after: 240 
          }
        })
      )
      
      // Add remaining lines as regular paragraphs
      for (let i = 1; i < lines.length; i++) {
        paragraphs.push(createLegalParagraph(lines[i]))
      }
    } else {
      // Special formatting for offer letter signature lines
      if (docType === 'offer_letter' && section.includes('Date signed:')) {
        // Format signature section specially
        paragraphs.push(createSignatureParagraph(section))
      } else {
        // Join all lines and create a single paragraph
        const fullText = lines.join(' ')
        paragraphs.push(createLegalParagraph(fullText))
      }
    }
  }

  // If no paragraphs were created, create a default one
  if (paragraphs.length === 0) {
    paragraphs.push(createLegalParagraph(content.trim() || 'Empty document'))
  }

  return paragraphs
}

/**
 * Create a specially formatted signature paragraph for offer letters
 */
function createSignatureParagraph(text: string): Paragraph {
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0)
  const children: (TextRun)[] = []
  
  for (const line of lines) {
    if (line.includes('Date signed:')) {
      // Format the signature line with proper spacing
      children.push(
        new TextRun({
          text: '\t\tDate signed: _______________\t',
          size: 22,
          font: "Times New Roman"
        })
      )
    } else {
      children.push(
        new TextRun({
          text: line,
          size: 22,
          font: "Times New Roman"
        })
      )
    }
    children.push(new TextRun({ text: '\n' }))
  }

  return new Paragraph({
    children,
    spacing: { after: 240 },
    alignment: AlignmentType.LEFT
  })
}

/**
 * Create a properly formatted legal document paragraph
 */
function createLegalParagraph(text: string): Paragraph {
  // Check for numbered sections
  const isNumberedSection = /^\d+\./.test(text.trim())
  const isLetterSection = /^\([a-z]\)/.test(text.trim())
  const isIndentedSection = text.startsWith('    ') || text.startsWith('\t')

  return new Paragraph({
    children: [
      new TextRun({
        text: text,
        size: 22, // 11pt font - standard for legal docs
        font: "Times New Roman" // Professional legal font
      })
    ],
    spacing: { 
      after: 120, // 6pt after
      line: 276 // 1.15 line spacing (276 = 115% of 240)
    },
    indent: {
      left: isIndentedSection ? 720 : isLetterSection ? 360 : 0, // Indent subsections
      hanging: isNumberedSection ? 360 : 0 // Hanging indent for numbered items
    },
    alignment: AlignmentType.BOTH // Justify text for legal docs
  })
}

/**
 * Generate DOCX document from content
 */
export async function generateDocx(options: DocxGenerationOptions): Promise<Uint8Array> {
  const { title, content, docType, metadata } = options
  
  // Clean content and convert to paragraphs
  const cleanContent = content.replace(/<[^>]*>/g, '') // Remove any HTML tags
  const paragraphs = textToDocxParagraphs(cleanContent, docType)
  
  // Add title at the beginning with professional legal formatting
  const documentParagraphs = [
    new Paragraph({
      children: [
        new TextRun({
          text: title.toUpperCase(),
          bold: true,
          size: 28, // 14pt font
          font: "Times New Roman",
          allCaps: true
        })
      ],
      alignment: AlignmentType.CENTER,
      spacing: { 
        before: 0,
        after: 480 // 24pt after title
      }
    }),
    ...paragraphs
  ]
  
  // Create document with professional legal document settings
  const doc = new Document({
    creator: metadata?.author || 'AI Law Agent',
    title: title,
    description: `${docType} generated by AI Law Agent`,
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440,    // 1 inch (1440 twips)
              right: 1440,  // 1 inch
              bottom: 1440, // 1 inch
              left: 1440    // 1 inch
            },
            size: {
              width: 12240,  // 8.5 inches (12240 twips)
              height: 15840  // 11 inches (15840 twips) - US Letter
            }
          }
        },
        children: documentParagraphs
      }
    ],
    styles: {
      default: {
        document: {
          run: {
            font: "Times New Roman",
            size: 22 // 11pt default
          },
          paragraph: {
            spacing: {
              line: 276, // 1.15 line spacing
              after: 120 // 6pt after paragraphs
            }
          }
        }
      }
    }
  })

  // Generate buffer
  const buffer = await Packer.toBuffer(doc)
  return new Uint8Array(buffer)
}

/**
 * Generate DOCX from template with placeholder replacement
 * Note: This function is intended for server-side use only
 */
export async function generateDocxFromTemplate(
  templateContent: string,
  placeholders: Record<string, string>,
  title: string,
  docType: DocumentType = 'delaware_charter'
): Promise<Uint8Array> {
  try {
    // Replace placeholders
    let processedContent = templateContent
    for (const [key, value] of Object.entries(placeholders)) {
      const placeholder = `{{${key}}}`
      processedContent = processedContent.replace(new RegExp(placeholder, 'g'), value)
    }
    
    // Convert to DOCX
    return await generateDocx({
      title,
      content: processedContent,
      docType
    })
    
  } catch (error) {
    console.error('Error generating DOCX from template:', error)
    throw new Error('Failed to generate document from template')
  }
}

/**
 * Download DOCX file in browser
 */
export function downloadDocx(buffer: Uint8Array, filename: string) {
  const blob = new Blob([buffer], { 
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
  })
  
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename.endsWith('.docx') ? filename : `${filename}.docx`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Convert HTML table to DOCX table (for future use)
 */
export function htmlTableToDocx(htmlTable: string) {
  // Placeholder for table conversion
  // This would parse HTML tables and convert to DOCX format
  return []
}

/**
 * Validate DOCX generation options
 */
export function validateDocxOptions(options: DocxGenerationOptions): string[] {
  const errors: string[] = []
  
  if (!options.title?.trim()) {
    errors.push('Document title is required')
  }
  
  if (!options.content?.trim()) {
    errors.push('Document content is required')
  }
  
  if (options.title && options.title.length > 255) {
    errors.push('Document title is too long (max 255 characters)')
  }
  
  return errors
}