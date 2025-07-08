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

    // Check if this is a title/heading (all caps, bold markdown, or contains specific keywords)
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
       firstLine.includes('Re:') ||
       (firstLine.startsWith('**') && firstLine.includes('**'))) // Markdown bold headers
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
      if (docType === 'offer_letter' && (section.includes('Date:') || section.includes('_____') || section.includes('By:') || section.includes('ACCEPTANCE'))) {
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
    if (line.includes('Date:')) {
      // Format signature lines with proper legal spacing
      children.push(
        new TextRun({
          text: line.replace('Date:', 'Date: _______________'),
          size: 24,
          font: "Times New Roman"
        })
      )
    } else if (line.includes('_____')) {
      // Format signature lines with proper spacing
      children.push(
        new TextRun({
          text: line,
          size: 24,
          font: "Times New Roman"
        })
      )
    } else {
      children.push(
        new TextRun({
          text: line,
          size: 24,
          font: "Times New Roman"
        })
      )
    }
    children.push(new TextRun({ text: '\n' }))
  }

  return new Paragraph({
    children,
    spacing: { 
      before: 480, // 24pt before signature blocks
      after: 240   // 12pt after
    },
    alignment: AlignmentType.LEFT
  })
}

/**
 * Parse text with markdown-style formatting and create TextRuns
 */
function parseFormattedText(text: string): TextRun[] {
  const textRuns: TextRun[] = []
  const parts = text.split(/(\*\*[^*]+\*\*)/)
  
  for (const part of parts) {
    if (part.startsWith('**') && part.endsWith('**')) {
      // Bold text
      const boldText = part.slice(2, -2) // Remove ** markers
      textRuns.push(new TextRun({
        text: boldText,
        bold: true,
        size: 24,
        font: "Times New Roman"
      }))
    } else if (part.trim()) {
      // Regular text
      textRuns.push(new TextRun({
        text: part,
        size: 24,
        font: "Times New Roman"
      }))
    }
  }
  
  return textRuns.length > 0 ? textRuns : [new TextRun({
    text: text,
    size: 22,
    font: "Times New Roman"
  })]
}

/**
 * Create a properly formatted legal document paragraph
 */
function createLegalParagraph(text: string): Paragraph {
  // Check for numbered sections and formatting
  const isNumberedSection = /^\d+\./.test(text.trim())
  const isLetterSection = /^\([a-z]\)/.test(text.trim())
  const isIndentedSection = text.startsWith('    ') || text.startsWith('\t')
  const isHeading = text.startsWith('**') && text.includes('**')
  
  // Parse text for formatting
  const textRuns = parseFormattedText(text)

  return new Paragraph({
    children: textRuns,
    spacing: { 
      after: isHeading ? 200 : 120, // More space after headings
      before: isHeading ? 200 : 0, // Space before headings
      line: 480 // 24pt exact line spacing (legal standard)
    },
    indent: {
      left: isIndentedSection ? 720 : isLetterSection ? 360 : 0,
      hanging: isNumberedSection ? 360 : 0
    },
    alignment: isHeading ? AlignmentType.LEFT : AlignmentType.BOTH
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
    creator: metadata?.author || 'Darrow',
    title: title,
    description: `${docType} generated by Darrow`,
    subject: docType === 'offer_letter' ? 'Employment Offer Letter' : `Legal Document - ${docType}`,
    keywords: docType === 'offer_letter' ? 'employment, offer, legal, contract' : `legal, document, ${docType}`,
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440,    // 1 inch (1440 twips)
              right: 1440,  // 1 inch
              bottom: 1440, // 1 inch
              left: 1800    // 1.25 inches (1800 twips) - Legal standard for binding
            },
            size: {
              width: 12240,  // 8.5 inches (12240 twips)
              height: 20160  // 14 inches (20160 twips) - US Legal paper
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
            size: 24 // 12pt default
          },
          paragraph: {
            spacing: {
              line: 480, // 24pt exact line spacing (legal standard)
              after: 240 // 12pt after paragraphs
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