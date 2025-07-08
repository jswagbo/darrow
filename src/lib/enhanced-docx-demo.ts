/**
 * Demo functions to showcase enhanced DOCX formatting capabilities
 */

import { 
  generateDocx, 
  createLegalTable, 
  DocxGenerationOptions,
  DocumentFormatting,
  TableData,
  TableStyle
} from './docx'
import { AlignmentType } from 'docx'

/**
 * Generate a sample legal document with enhanced formatting
 */
export async function generateEnhancedSampleDocument(): Promise<Uint8Array> {
  const sampleContent = `
# LEGAL SERVICES AGREEMENT

**PARTIES:** This Legal Services Agreement ("Agreement") is entered into between {{CLIENT_NAME}} ("Client") and {{LAW_FIRM_NAME}} ("Firm").

## 1. SCOPE OF SERVICES

The Firm agrees to provide legal services in connection with the following matter:

**1.1 General Legal Consultation**
- Legal advice and counsel on corporate matters
- Contract review and negotiation
- Regulatory compliance guidance

**1.2 Specific Services**
- Document preparation and review
- Legal research and analysis
- Representation in negotiations

## 2. COMPENSATION AND BILLING

**2.1 Fee Structure**
The Client agrees to pay the Firm according to the following fee structure:

**2.2 Billing Terms**
- Monthly invoicing
- Payment due within 30 days of invoice date
- Late payment interest at 1.5% per month

## 3. TERMS AND CONDITIONS

**3.1 Confidentiality**
All information shared between the parties shall remain confidential.

**3.2 Termination**
Either party may terminate this agreement with thirty (30) days written notice.

---

**SIGNATURE BLOCK**

_____________________________          Date: _______________
Client Signature

_____________________________          Date: _______________
Attorney Signature
  `.trim()

  // Enhanced formatting options
  const formatting: DocumentFormatting = {
    useHeaders: true,
    useFooters: true,
    pageNumbering: true,
    caseTitle: "Sample Legal Services Agreement",
    courtName: "Professional Legal Documents"
  }

  const options: DocxGenerationOptions = {
    title: "Legal Services Agreement",
    content: sampleContent,
    docType: "delaware_charter", // Using existing type
    formatting,
    metadata: {
      author: "Darrow Legal Document Generation",
      company: "Darrow",
      created: new Date()
    }
  }

  return await generateDocx(options)
}

/**
 * Generate a sample document with tables
 */
export async function generateSampleDocumentWithTable(): Promise<Uint8Array> {
  // Sample table data
  const tableData: TableData = {
    headers: ["Service Type", "Hourly Rate", "Estimated Hours", "Total Cost"],
    rows: [
      ["Legal Consultation", "$450", "10", "$4,500"],
      ["Document Review", "$350", "15", "$5,250"],
      ["Contract Negotiation", "$500", "8", "$4,000"],
      ["Regulatory Compliance", "$400", "12", "$4,800"],
      ["", "", "TOTAL:", "$18,550"]
    ],
    style: {
      borders: true,
      headerShading: true,
      alternatingRows: true,
      width: 100,
      alignment: AlignmentType.CENTER
    }
  }

  // Create the table
  const table = createLegalTable(tableData)

  const sampleContent = `
# FEE SCHEDULE AND SERVICES

This document outlines the fee structure for legal services to be provided.

## SERVICE BREAKDOWN

The following table details the services and associated costs:

{{TABLE_PLACEHOLDER}}

## PAYMENT TERMS

**Payment Schedule:** Net 30 days from invoice date
**Late Fees:** 1.5% per month on overdue amounts
**Retainer:** $5,000 deposit required before commencement of work

## ADDITIONAL TERMS

All fees are subject to change with 30 days written notice. Travel expenses and court costs are billed separately at cost.

---

**CLIENT ACKNOWLEDGMENT**

By signing below, Client acknowledges receipt and acceptance of this fee schedule.

_____________________________          Date: _______________
Client Signature

_____________________________          Date: _______________
Attorney Signature
  `.trim()

  const formatting: DocumentFormatting = {
    useHeaders: true,
    useFooters: true,
    pageNumbering: true,
    caseTitle: "Legal Fee Schedule",
    courtName: "Professional Legal Services"
  }

  const options: DocxGenerationOptions = {
    title: "Legal Services Fee Schedule",
    content: sampleContent,
    docType: "offer_letter", // Using existing type
    formatting,
    metadata: {
      author: "Darrow Legal Document Generation",
      company: "Darrow",
      created: new Date()
    }
  }

  return await generateDocx(options)
}

/**
 * Generate a comparison of old vs new formatting capabilities
 */
export function getFormattingComparisonSummary(): string {
  return `
# Enhanced DOCX Formatting Capabilities

## ✅ NEW FEATURES IMPLEMENTED:

### **Professional Table Support**
- Bordered tables with header shading
- Alternating row colors
- Configurable column widths
- Professional legal styling
- Cell padding and alignment

### **Headers and Footers**
- Case title and court name in headers
- Page numbering in footers
- Confidentiality notices
- Professional legal document formatting

### **Advanced Typography**
- Legal paper size (8.5" x 14")
- Professional margins (1.25" left for binding)
- 12pt Times New Roman with 24pt line spacing
- Multiple heading styles (Legal Heading 1, 2, 3)
- Legal clause formatting with proper indentation

### **Multi-level Numbering**
- Decimal numbering (1., 2., 3.)
- Letter sub-numbering ((a), (b), (c))
- Roman numeral sub-sub-numbering (i., ii., iii.)
- Proper hanging indentation
- Legal document hierarchy

### **Document Styles**
- Predefined legal document styles
- Signature block formatting
- Clause indentation
- Professional spacing and alignment

### **Enhanced Metadata**
- Document properties
- Subject and keyword tagging
- Author and creation tracking
- Legal document classification

## 🔄 BEFORE vs AFTER:

**BEFORE:** Basic text with minimal formatting
**AFTER:** Professional Microsoft Word-quality legal documents

**BEFORE:** No table support
**AFTER:** Full table creation with borders, shading, and styling

**BEFORE:** No headers/footers
**AFTER:** Professional headers with case titles and page numbering

**BEFORE:** Basic paragraph formatting
**AFTER:** Legal document styles with proper numbering and indentation

## 📈 IMPACT:

- **Professional Quality:** Documents now match law firm standards
- **Time Savings:** Automated formatting eliminates manual styling
- **Consistency:** All documents follow the same professional standards
- **Flexibility:** Customizable formatting options for different document types
- **Microsoft Word Compatible:** Perfect rendering in Word applications
  `
}
`