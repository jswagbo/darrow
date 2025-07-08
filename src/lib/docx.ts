import { 
  Document, 
  Packer, 
  Paragraph, 
  TextRun, 
  HeadingLevel,
  AlignmentType,
  UnderlineType,
  PageBreak,
  Table,
  TableRow,
  TableCell,
  BorderStyle,
  Header,
  Footer,
  PageNumber,
  NumberFormat,
  SectionType,
  WidthType,
  TableLayoutType,
  VerticalAlign,
  Shading,
  ShadingType,
  Tab,
  TabStopPosition,
  TabStopType,
  LevelFormat,
  convertInchesToTwip,
  ExternalHyperlink,
  InternalHyperlink,
  BookmarkStart,
  BookmarkEnd
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
  formatting?: DocumentFormatting
}

export interface DocumentFormatting {
  useHeaders?: boolean
  useFooters?: boolean
  pageNumbering?: boolean
  caseTitle?: string
  courtName?: string
  useTableOfContents?: boolean
  styles?: CustomStyles
}

export interface CustomStyles {
  headingStyles?: HeadingStyle[]
  paragraphStyles?: ParagraphStyle[]
  characterStyles?: CharacterStyle[]
}

export interface HeadingStyle {
  level: number
  fontSize: number
  fontFamily?: string
  bold?: boolean
  color?: string
  spacing?: { before?: number; after?: number }
  numbering?: NumberingStyle
}

export interface ParagraphStyle {
  name: string
  fontSize: number
  fontFamily?: string
  alignment?: typeof AlignmentType[keyof typeof AlignmentType]
  indent?: { left?: number; right?: number; firstLine?: number }
  spacing?: { before?: number; after?: number; line?: number }
}

export interface CharacterStyle {
  name: string
  fontSize?: number
  fontFamily?: string
  bold?: boolean
  italic?: boolean
  underline?: boolean
  color?: string
}

export interface NumberingStyle {
  format: typeof LevelFormat[keyof typeof LevelFormat]
  prefix?: string
  suffix?: string
  start?: number
}

export interface TableData {
  headers: string[]
  rows: string[][]
  style?: TableStyle
}

export interface TableStyle {
  borders?: boolean
  headerShading?: boolean
  alternatingRows?: boolean
  width?: number
  alignment?: typeof AlignmentType[keyof typeof AlignmentType]
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
 * Generate DOCX document from content with enhanced formatting
 */
export async function generateDocx(options: DocxGenerationOptions): Promise<Uint8Array> {
  const { title, content, docType, metadata, formatting } = options
  
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

  // Create headers and footers if specified
  const headers = formatting?.useHeaders ? {
    default: createLegalHeader(formatting)
  } : undefined

  const footers = formatting?.useFooters || formatting?.pageNumbering ? {
    default: createLegalFooter(formatting)
  } : undefined
  
  // Create document with enhanced legal document settings
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
              top: formatting?.useHeaders ? 2160 : 1440,    // 1.5" if header, 1" otherwise
              right: 1440,  // 1 inch
              bottom: formatting?.useFooters ? 2160 : 1440, // 1.5" if footer, 1" otherwise
              left: 1800    // 1.25 inches (1800 twips) - Legal standard for binding
            },
            size: {
              width: 12240,  // 8.5 inches (12240 twips)
              height: 20160  // 14 inches (20160 twips) - US Legal paper
            },
            pageNumbers: formatting?.pageNumbering ? {
              start: 1,
              formatType: NumberFormat.DECIMAL
            } : undefined
          },
          type: SectionType.CONTINUOUS
        },
        headers,
        footers,
        children: documentParagraphs
      }
    ],
    styles: createLegalStyles(),
    numbering: {
      config: [
        {
          reference: "legal-numbering",
          levels: [
            {
              level: 0,
              format: LevelFormat.DECIMAL,
              text: "%1.",
              alignment: AlignmentType.LEFT,
              style: {
                paragraph: {
                  indent: { left: convertInchesToTwip(0.5), hanging: convertInchesToTwip(0.25) }
                }
              }
            },
            {
              level: 1, 
              format: LevelFormat.LOWER_LETTER,
              text: "(%2)",
              alignment: AlignmentType.LEFT,
              style: {
                paragraph: {
                  indent: { left: convertInchesToTwip(1.0), hanging: convertInchesToTwip(0.25) }
                }
              }
            },
            {
              level: 2,
              format: LevelFormat.LOWER_ROMAN,
              text: "%3.",
              alignment: AlignmentType.LEFT,
              style: {
                paragraph: {
                  indent: { left: convertInchesToTwip(1.5), hanging: convertInchesToTwip(0.25) }
                }
              }
            }
          ]
        }
      ]
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
 * Create a professional table for legal documents
 */
export function createLegalTable(tableData: TableData): Table {
  const { headers, rows, style = {} } = tableData
  
  // Default legal table style
  const defaultStyle: TableStyle = {
    borders: true,
    headerShading: true,
    alternatingRows: false,
    width: 100,
    alignment: AlignmentType.LEFT,
    ...style
  }

  // Create header row
  const headerCells = headers.map(header => 
    new TableCell({
      children: [
        new Paragraph({
          children: [
            new TextRun({
              text: header,
              bold: true,
              size: 24, // 12pt
              font: "Times New Roman"
            })
          ],
          alignment: AlignmentType.CENTER
        })
      ],
      shading: defaultStyle.headerShading ? {
        type: ShadingType.SOLID,
        color: "E7E7E7", // Light gray
        fill: "E7E7E7"
      } : undefined,
      margins: {
        top: convertInchesToTwip(0.08),
        bottom: convertInchesToTwip(0.08),
        left: convertInchesToTwip(0.08),
        right: convertInchesToTwip(0.08)
      },
      verticalAlign: VerticalAlign.CENTER
    })
  )

  // Create data rows
  const dataRows = rows.map((row, rowIndex) => 
    new TableRow({
      children: row.map(cellText => 
        new TableCell({
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: cellText,
                  size: 22, // 11pt
                  font: "Times New Roman"
                })
              ],
              alignment: AlignmentType.LEFT
            })
          ],
          shading: (defaultStyle.alternatingRows && rowIndex % 2 === 1) ? {
            type: ShadingType.SOLID,
            color: "F8F8F8", // Very light gray
            fill: "F8F8F8"
          } : undefined,
          margins: {
            top: convertInchesToTwip(0.08),
            bottom: convertInchesToTwip(0.08),
            left: convertInchesToTwip(0.08),
            right: convertInchesToTwip(0.08)
          },
          verticalAlign: VerticalAlign.TOP
        })
      )
    })
  )

  // Create table with professional legal styling
  return new Table({
    rows: [
      new TableRow({
        children: headerCells,
        tableHeader: true
      }),
      ...dataRows
    ],
    width: {
      size: defaultStyle.width || 100,
      type: WidthType.PERCENTAGE
    },
    layout: TableLayoutType.AUTOFIT,
    borders: defaultStyle.borders ? {
      top: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
      bottom: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
      left: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
      right: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
      insideVertical: { style: BorderStyle.SINGLE, size: 1, color: "000000" }
    } : undefined,
    alignment: defaultStyle.alignment,
    margins: {
      top: 240, // 12pt
      bottom: 240 // 12pt
    }
  })
}

/**
 * Convert HTML table to DOCX table
 */
export function htmlTableToDocx(htmlTable: string): Table[] {
  // Basic HTML table parsing - can be enhanced for more complex tables
  const tableRegex = /<table[^>]*>(.*?)<\/table>/gi
  const rowRegex = /<tr[^>]*>(.*?)<\/tr>/gi
  const cellRegex = /<t[hd][^>]*>(.*?)<\/t[hd]>/gi
  
  const tables: Table[] = []
  const tableMatches = htmlTable.match(tableRegex)
  
  if (tableMatches) {
    for (const tableMatch of tableMatches) {
      const rows: string[][] = []
      let isFirstRow = true
      
      const rowMatches = tableMatch.match(rowRegex)
      if (rowMatches) {
        for (const rowMatch of rowMatches) {
          const cells: string[] = []
          const cellMatches = rowMatch.match(cellRegex)
          
          if (cellMatches) {
            for (const cellMatch of cellMatches) {
              // Extract text content and clean HTML tags
              const cellText = cellMatch.replace(/<[^>]*>/g, '').trim()
              cells.push(cellText)
            }
          }
          
          if (cells.length > 0) {
            rows.push(cells)
          }
        }
      }
      
      if (rows.length > 0) {
        const headers = rows[0]
        const dataRows = rows.slice(1)
        
        const tableData: TableData = {
          headers,
          rows: dataRows,
          style: {
            borders: true,
            headerShading: true,
            alternatingRows: true
          }
        }
        
        tables.push(createLegalTable(tableData))
      }
    }
  }
  
  return tables
}

/**
 * Create professional legal document header
 */
export function createLegalHeader(formatting?: DocumentFormatting): Header {
  const children: Paragraph[] = []
  
  if (formatting?.caseTitle) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: formatting.caseTitle,
            bold: true,
            size: 24, // 12pt
            font: "Times New Roman"
          })
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 120 }
      })
    )
  }
  
  if (formatting?.courtName) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: formatting.courtName,
            size: 22, // 11pt
            font: "Times New Roman"
          })
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 240 }
      })
    )
  }
  
  return new Header({
    children: children.length > 0 ? children : [
      new Paragraph({
        children: [
          new TextRun({
            text: "LEGAL DOCUMENT",
            bold: true,
            size: 24,
            font: "Times New Roman"
          })
        ],
        alignment: AlignmentType.CENTER
      })
    ]
  })
}

/**
 * Create professional legal document footer with page numbering
 */
export function createLegalFooter(formatting?: DocumentFormatting): Footer {
  const children: Paragraph[] = []
  
  // Page numbering paragraph
  if (formatting?.pageNumbering !== false) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "Page 1",
            size: 22,
            font: "Times New Roman"
          })
        ],
        alignment: AlignmentType.CENTER,
        spacing: { before: 120 }
      })
    )
  }
  
  // Footer text if provided
  if (formatting?.caseTitle) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `${formatting.caseTitle} - Confidential`,
            size: 20, // 10pt
            font: "Times New Roman",
            italics: true
          })
        ],
        alignment: AlignmentType.CENTER,
        spacing: { before: 120 }
      })
    )
  }
  
  return new Footer({
    children: children.length > 0 ? children : [
      new Paragraph({
        children: [
          new TextRun({
            text: "Page 1",
            size: 22,
            font: "Times New Roman"
          })
        ],
        alignment: AlignmentType.CENTER
      })
    ]
  })
}

/**
 * Create legal document styles
 */
export function createLegalStyles(): any {
  return {
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
    },
    paragraphStyles: [
      {
        id: "Heading1",
        name: "Legal Heading 1",
        basedOn: "Normal",
        next: "Normal",
        run: {
          size: 32, // 16pt
          bold: true,
          font: "Times New Roman",
          color: "000000"
        },
        paragraph: {
          spacing: {
            before: 480, // 24pt before
            after: 240,  // 12pt after
            line: 480    // 24pt line spacing
          },
          alignment: AlignmentType.CENTER
        }
      },
      {
        id: "Heading2",
        name: "Legal Heading 2", 
        basedOn: "Normal",
        next: "Normal",
        run: {
          size: 28, // 14pt
          bold: true,
          font: "Times New Roman",
          color: "000000"
        },
        paragraph: {
          spacing: {
            before: 360, // 18pt before
            after: 240,  // 12pt after
            line: 480    // 24pt line spacing
          },
          alignment: AlignmentType.LEFT
        }
      },
      {
        id: "Heading3",
        name: "Legal Heading 3",
        basedOn: "Normal", 
        next: "Normal",
        run: {
          size: 26, // 13pt
          bold: true,
          font: "Times New Roman",
          color: "000000"
        },
        paragraph: {
          spacing: {
            before: 240, // 12pt before
            after: 120,  // 6pt after
            line: 480    // 24pt line spacing
          },
          alignment: AlignmentType.LEFT
        }
      },
      {
        id: "LegalClause",
        name: "Legal Clause",
        basedOn: "Normal",
        next: "Normal", 
        run: {
          size: 24, // 12pt
          font: "Times New Roman"
        },
        paragraph: {
          indent: {
            left: convertInchesToTwip(0.5), // 0.5" left indent
            hanging: convertInchesToTwip(0.25) // 0.25" hanging indent
          },
          spacing: {
            before: 120, // 6pt before
            after: 120,  // 6pt after
            line: 480    // 24pt line spacing
          }
        }
      },
      {
        id: "SignatureBlock",
        name: "Signature Block",
        basedOn: "Normal",
        next: "Normal",
        run: {
          size: 24, // 12pt
          font: "Times New Roman"
        },
        paragraph: {
          spacing: {
            before: 480, // 24pt before
            after: 240,  // 12pt after
            line: 480    // 24pt line spacing
          },
          alignment: AlignmentType.LEFT
        }
      }
    ]
  }
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