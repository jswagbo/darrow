import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'

export interface PdfGenerationOptions {
  title: string
  content: string
  metadata?: {
    author?: string
    creator?: string
    producer?: string
    creationDate?: Date
  }
}

/**
 * Convert HTML content to PDF
 */
export async function generatePdf(options: PdfGenerationOptions): Promise<Uint8Array> {
  const { title, content, metadata } = options
  
  // Create a new PDF document
  const pdfDoc = await PDFDocument.create()
  
  // Set document metadata
  pdfDoc.setTitle(title)
  pdfDoc.setAuthor(metadata?.author || 'AI Law Agent')
  pdfDoc.setCreator(metadata?.creator || 'AI Law Agent MVP')
  pdfDoc.setProducer(metadata?.producer || 'AI Law Agent')
  pdfDoc.setCreationDate(metadata?.creationDate || new Date())
  
  // Load fonts
  const font = await pdfDoc.embedFont(StandardFonts.TimesRoman)
  const boldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold)
  
  // Add a page
  let page = pdfDoc.addPage()
  const { width, height } = page.getSize()
  
  // Professional legal document margins (1 inch = 72 points)
  const margin = 72
  const contentWidth = width - (margin * 2)
  const lineHeight = 16 // Increased for better readability
  let currentY = height - margin
  
  // Helper function to add new page if needed
  const addNewPageIfNeeded = (requiredSpace: number) => {
    if (currentY - requiredSpace < margin) {
      page = pdfDoc.addPage()
      currentY = height - margin
    }
  }
  
  // Draw title (centered and properly formatted)
  const titleFontSize = 16
  const titleText = title.toUpperCase()
  const titleWidth = boldFont.widthOfTextAtSize(titleText, titleFontSize)
  const titleX = (width - titleWidth) / 2 // Center the title
  
  addNewPageIfNeeded(titleFontSize + 30)
  
  page.drawText(titleText, {
    x: titleX,
    y: currentY,
    size: titleFontSize,
    font: boldFont,
    color: rgb(0, 0, 0),
  })
  
  currentY -= titleFontSize + 40 // More space after title
  
  // Process content with better paragraph handling
  const cleanContent = content
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .trim()
  
  // Split into paragraphs and handle each separately
  const paragraphs = cleanContent
    .split(/\n\s*\n/)
    .map(p => p.trim())
    .filter(p => p.length > 0)
  
  const fontSize = 11 // Standard legal document font size
  const paragraphSpacing = 6 // Space between paragraphs
  
  for (const paragraph of paragraphs) {
    // Check if this is a heading (all caps, short, contains legal keywords)
    const isHeading = (
      paragraph.length < 100 && 
      (paragraph === paragraph.toUpperCase() || 
       paragraph.includes('CERTIFICATE') || 
       paragraph.includes('AGREEMENT') ||
       paragraph.includes('RESOLVED') ||
       paragraph.includes('WHEREAS') ||
       paragraph.includes('ARTICLE'))
    )
    
    if (isHeading) {
      // Format as heading
      const headingFontSize = 12
      const headingText = paragraph.toUpperCase()
      addNewPageIfNeeded(headingFontSize + paragraphSpacing)
      
      // Center headings for main titles
      const isCentered = paragraph.includes('CERTIFICATE') || paragraph.includes('AGREEMENT')
      const textWidth = boldFont.widthOfTextAtSize(headingText, headingFontSize)
      const x = isCentered ? (width - textWidth) / 2 : margin
      
      page.drawText(headingText, {
        x: x,
        y: currentY,
        size: headingFontSize,
        font: boldFont,
        color: rgb(0, 0, 0),
      })
      
      currentY -= headingFontSize + paragraphSpacing * 2
    } else {
      // Handle as regular paragraph with word wrapping
      const words = paragraph.split(/\s+/)
      let currentLine = ''
      
      for (const word of words) {
        const testLine = currentLine ? `${currentLine} ${word}` : word
        const textWidth = font.widthOfTextAtSize(testLine, fontSize)
        
        if (textWidth <= contentWidth) {
          currentLine = testLine
        } else {
          // Draw current line and start new one
          if (currentLine) {
            addNewPageIfNeeded(lineHeight)
            
            page.drawText(currentLine, {
              x: margin,
              y: currentY,
              size: fontSize,
              font: font,
              color: rgb(0, 0, 0),
            })
            
            currentY -= lineHeight
          }
          
          currentLine = word
        }
      }
      
      // Draw the last line of the paragraph
      if (currentLine) {
        addNewPageIfNeeded(lineHeight)
        
        page.drawText(currentLine, {
          x: margin,
          y: currentY,
          size: fontSize,
          font: font,
          color: rgb(0, 0, 0),
        })
        
        currentY -= lineHeight
      }
      
      // Add space between paragraphs
      currentY -= paragraphSpacing
    }
  }
  
  // Add footer with page numbers
  const pages = pdfDoc.getPages()
  pages.forEach((page, index) => {
    const { width } = page.getSize()
    const footerText = `Page ${index + 1} of ${pages.length}`
    const footerWidth = font.widthOfTextAtSize(footerText, 10)
    
    page.drawText(footerText, {
      x: (width - footerWidth) / 2,
      y: 30,
      size: 10,
      font: font,
      color: rgb(0.5, 0.5, 0.5),
    })
  })
  
  // Serialize the PDF
  const pdfBytes = await pdfDoc.save()
  return new Uint8Array(pdfBytes)
}

/**
 * Convert DOCX buffer to PDF (simplified approach)
 */
export async function docxToPdf(
  docxBuffer: Uint8Array,
  title: string
): Promise<Uint8Array> {
  // For MVP, we'll create a simple PDF with a note that this was converted from DOCX
  // In production, you might want to use a service like LibreOffice or a dedicated converter
  
  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage()
  const { width, height } = page.getSize()
  const font = await pdfDoc.embedFont(StandardFonts.TimesRoman)
  
  // Add conversion notice
  const notice = `This PDF was generated from a DOCX document.\n\nOriginal document: ${title}\n\nFor the best experience, please download the DOCX version.`
  
  page.drawText(notice, {
    x: 50,
    y: height - 100,
    size: 12,
    font: font,
    color: rgb(0, 0, 0),
    maxWidth: width - 100,
  })
  
  const pdfBytes = await pdfDoc.save()
  return new Uint8Array(pdfBytes)
}

/**
 * Download PDF file in browser
 */
export function downloadPdf(buffer: Uint8Array, filename: string) {
  const blob = new Blob([buffer], { type: 'application/pdf' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename.endsWith('.pdf') ? filename : `${filename}.pdf`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Generate PDF from HTML with better formatting (future enhancement)
 */
export async function generatePdfFromHtml(
  html: string,
  title: string,
  options?: {
    pageSize?: 'A4' | 'Letter'
    margins?: { top: number; right: number; bottom: number; left: number }
    fontSize?: number
    fontFamily?: string
  }
): Promise<Uint8Array> {
  // This would use a more sophisticated HTML to PDF converter
  // For now, we'll use the simple text conversion
  
  return await generatePdf({
    title,
    content: html,
    metadata: {
      author: 'AI Law Agent',
      creator: 'AI Law Agent MVP'
    }
  })
}

/**
 * Validate PDF generation options
 */
export function validatePdfOptions(options: PdfGenerationOptions): string[] {
  const errors: string[] = []
  
  if (!options.title?.trim()) {
    errors.push('Document title is required')
  }
  
  if (!options.content?.trim()) {
    errors.push('Document content is required')
  }
  
  return errors
}

/**
 * Get PDF info/metadata
 */
export async function getPdfInfo(pdfBuffer: Uint8Array) {
  try {
    const pdfDoc = await PDFDocument.load(pdfBuffer)
    
    return {
      pageCount: pdfDoc.getPageCount(),
      title: pdfDoc.getTitle(),
      author: pdfDoc.getAuthor(),
      creator: pdfDoc.getCreator(),
      producer: pdfDoc.getProducer(),
      creationDate: pdfDoc.getCreationDate(),
      modificationDate: pdfDoc.getModificationDate(),
    }
  } catch (error) {
    console.error('Error reading PDF info:', error)
    throw new Error('Failed to read PDF information')
  }
}