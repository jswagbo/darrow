import OpenAI from 'openai'
import { DocumentType } from './utils'
import { buildPrompt, buildExtractionPrompt, validateGeneratedDocument } from './promptEngine'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export interface GenerationResult {
  success: boolean
  content?: string
  error?: string
  usage?: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

export interface ExtractionResult {
  success: boolean
  data?: Record<string, string>
  error?: string
}

/**
 * Generate document content using OpenAI
 */
export async function generateDocument(
  docType: DocumentType,
  userInput: string,
  additionalContext?: string
): Promise<GenerationResult> {
  try {
    const prompt = buildPrompt(docType, userInput, additionalContext)
    
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a precise legal document assistant. Follow instructions exactly and only fill in designated placeholders. Never modify legal language outside of placeholders.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.1, // Low temperature for consistency
      max_tokens: 4000,
      top_p: 0.9,
    })

    const generatedContent = completion.choices[0]?.message?.content

    if (!generatedContent) {
      return {
        success: false,
        error: 'No content generated from OpenAI'
      }
    }

    // Validate the generated document
    const validation = validateGeneratedDocument(docType, generatedContent)
    
    if (!validation.isValid) {
      return {
        success: false,
        error: `Document validation failed: ${validation.errors.join(', ')}`
      }
    }

    return {
      success: true,
      content: generatedContent,
      usage: completion.usage ? {
        prompt_tokens: completion.usage.prompt_tokens,
        completion_tokens: completion.usage.completion_tokens,
        total_tokens: completion.usage.total_tokens
      } : undefined
    }

  } catch (error) {
    console.error('Error generating document:', error)
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
}

/**
 * Extract structured data from user input
 */
export async function extractDocumentData(
  docType: DocumentType,
  userInput: string
): Promise<ExtractionResult> {
  try {
    const prompt = buildExtractionPrompt(docType, userInput)
    
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a data extraction assistant. Extract only the requested information and return valid JSON.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0,
      max_tokens: 1000,
    })

    const response = completion.choices[0]?.message?.content

    if (!response) {
      return {
        success: false,
        error: 'No response from OpenAI'
      }
    }

    // Parse JSON response
    try {
      const data = JSON.parse(response)
      return {
        success: true,
        data
      }
    } catch (parseError) {
      return {
        success: false,
        error: 'Failed to parse extracted data as JSON'
      }
    }

  } catch (error) {
    console.error('Error extracting document data:', error)
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
}

/**
 * Generate document with streaming for real-time updates
 */
export async function generateDocumentStream(
  docType: DocumentType,
  userInput: string,
  onChunk: (chunk: string) => void,
  additionalContext?: string
): Promise<GenerationResult> {
  try {
    const prompt = buildPrompt(docType, userInput, additionalContext)
    
    const stream = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a precise legal document assistant. Follow instructions exactly and only fill in designated placeholders. Never modify legal language outside of placeholders.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.1,
      max_tokens: 4000,
      top_p: 0.9,
      stream: true,
    })

    let fullContent = ''

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || ''
      if (content) {
        fullContent += content
        onChunk(content)
      }
    }

    // Validate the final document
    const validation = validateGeneratedDocument(docType, fullContent)
    
    if (!validation.isValid) {
      return {
        success: false,
        error: `Document validation failed: ${validation.errors.join(', ')}`
      }
    }

    return {
      success: true,
      content: fullContent
    }

  } catch (error) {
    console.error('Error generating document stream:', error)
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
}

/**
 * Test OpenAI connection and model availability
 */
export async function testOpenAIConnection(): Promise<{ success: boolean; error?: string }> {
  try {
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4-turbo',
      messages: [
        {
          role: 'user',
          content: 'Test connection. Respond with "OK".'
        }
      ],
      max_tokens: 10,
    })

    const response = completion.choices[0]?.message?.content

    return {
      success: response?.includes('OK') || false
    }

  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}