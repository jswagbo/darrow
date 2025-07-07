exports.id=91,exports.ids=[91],exports.modules={2052:()=>{},5600:()=>{},622:(e,t,a)=>{"use strict";a.d(t,{Wn:()=>i,S1:()=>l});var o=a(6609);let r={prompts:{delaware_charter:`# Delaware Charter Document Generation Prompt

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
- {{INCORPORATOR_ADDRESS}} - Address of incorporator`,safe_post:`# YC SAFE Post-Money Document Generation Prompt

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
- {{DATE}} - Date of agreement execution`,offer_letter:`# Employment Offer Letter Generation Prompt

## System Instructions

You are a legal document assistant specialized in employment offer letters. Your role is to ONLY fill in the placeholder values marked with {{PLACEHOLDER_NAME}} in the template. You must NEVER modify the legal language, structure, or format of the template.

## Critical Rules:
1. ONLY replace text inside double curly braces {{LIKE_THIS}}
2. NEVER modify any legal language outside of placeholders
3. NEVER add or remove sections
4. NEVER change the legal structure or format
5. Use appropriate legal formatting and capitalization

## Template Placeholders to Fill:

- {{COMPANY_NAME}} - Full legal name of the company
- {{CANDIDATE_NAME}} - Full name of job candidate
- {{JOB_TITLE}} - Official job title
- {{ANNUAL_SALARY}} - Annual base salary amount
- {{START_DATE}} - Employment start date
- {{REPORTING_MANAGER}} - Name of direct manager
- {{COMPANY_ADDRESS}} - Company's business address`,rspa:`# RSPA (Restricted Stock Purchase Agreement) Generation Prompt

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
- {{PURCHASE_DATE}} - Date of stock purchase`,board_consent:`# Board/Stockholder Consent Generation Prompt

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
- {{DATE}} - Date of consent execution`},templates:{delaware_charter:`CERTIFICATE OF INCORPORATION
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
{{INCORPORATOR_NAME}}, Incorporator`,safe_post:"[DOCX_TEMPLATE_YC_SAFE_POST_MONEY]",offer_letter:`{{COMPANY_NAME}}
{{COMPANY_ADDRESS}}

{{DATE}}

{{CANDIDATE_NAME}}

Dear {{CANDIDATE_NAME}},

We are pleased to offer you employment with {{COMPANY_NAME}} in the position of {{JOB_TITLE}}.

## Employment Terms

**Position:** {{JOB_TITLE}}
**Start Date:** {{START_DATE}}
**Annual Salary:** {{ANNUAL_SALARY}}
**Reporting Manager:** {{REPORTING_MANAGER}}

## Benefits

This position includes our standard benefits package, including health insurance, dental insurance, and 401(k) participation, subject to the terms and conditions of the applicable benefit plans.

## Employment Relationship

This offer is contingent upon satisfactory completion of our standard background check process. Your employment with {{COMPANY_NAME}} is at-will, meaning that either you or the company may terminate the employment relationship at any time, with or without cause or notice.

Please confirm your acceptance of this offer by signing and returning this letter by [DATE].

We look forward to having you join our team!

Sincerely,

[Hiring Manager Name]
{{COMPANY_NAME}}

---

I accept the terms of this offer:

Signature: _________________________ Date: _________

{{CANDIDATE_NAME}}`,rspa:`RESTRICTED STOCK PURCHASE AGREEMENT

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
{{PURCHASER_NAME}}`,board_consent:`{{CONSENT_TYPE}} CONSENT OF
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
[Name], [Title]`}};function s(e){return({delaware_charter:{systemPrompt:r.prompts.delaware_charter,template:r.templates.delaware_charter,requiredFields:["COMPANY_NAME","INCORPORATOR_NAME","INCORPORATOR_ADDRESS"]},safe_post:{systemPrompt:r.prompts.safe_post,template:r.templates.safe_post,requiredFields:["INVESTOR_NAME","COMPANY_NAME","PURCHASE_AMOUNT","VALUATION_CAP"]},offer_letter:{systemPrompt:r.prompts.offer_letter,template:r.templates.offer_letter,requiredFields:["COMPANY_NAME","CANDIDATE_NAME","JOB_TITLE","ANNUAL_SALARY"]},rspa:{systemPrompt:r.prompts.rspa,template:r.templates.rspa,requiredFields:["COMPANY_NAME","PURCHASER_NAME","SHARES_PURCHASED","PURCHASE_PRICE_PER_SHARE"]},board_consent:{systemPrompt:r.prompts.board_consent,template:r.templates.board_consent,requiredFields:["COMPANY_NAME","RESOLUTION_TITLE_1","RESOLUTION_TEXT_1"]}})[e]}let n=new o.ZP({apiKey:process.env.OPENAI_API_KEY});async function i(e,t,a){try{let o=function(e,t,a){let o=s(e),r=s(e).template;return`${o.systemPrompt}

## Document Template:
${r}

## User Requirements:
${t}

${a?`## Additional Context:
${a}`:""}

## Instructions:
Based on the user requirements above, fill in ALL the placeholder values in the template. Return ONLY the completed document with all placeholders replaced with appropriate values. Do not include any explanations or additional text outside the document.`}(e,t,a),r=await n.chat.completions.create({model:process.env.OPENAI_MODEL||"gpt-4-turbo",messages:[{role:"system",content:"You are a precise legal document assistant. Follow instructions exactly and only fill in designated placeholders. Never modify legal language outside of placeholders."},{role:"user",content:o}],temperature:.1,max_tokens:4e3,top_p:.9}),i=r.choices[0]?.message?.content;if(!i)return{success:!1,error:"No content generated from OpenAI"};let l=function(e,t){let a=[],o=t.match(/\{\{[^}]+\}\}/g);switch(o&&a.push(`Unfilled placeholders found: ${o.join(", ")}`),t.includes("\n\n\n\n")&&a.push("Document contains empty sections"),t.trim().length<500&&a.push("Generated document appears to be too short"),e){case"safe_post":t.includes("SAFE")||t.includes("Simple Agreement")||a.push("SAFE document must contain SAFE terminology");break;case"delaware_charter":t.includes("Delaware")&&t.includes("Certificate of Incorporation")||a.push("Delaware charter must contain proper legal language")}return{isValid:0===a.length,errors:a}}(e,i);if(!l.isValid)return{success:!1,error:`Document validation failed: ${l.errors.join(", ")}`};return{success:!0,content:i,usage:r.usage?{prompt_tokens:r.usage.prompt_tokens,completion_tokens:r.usage.completion_tokens,total_tokens:r.usage.total_tokens}:void 0}}catch(e){return console.error("Error generating document:",e),{success:!1,error:e instanceof Error?e.message:"Unknown error occurred"}}}async function l(){try{let e=await n.chat.completions.create({model:process.env.OPENAI_MODEL||"gpt-4-turbo",messages:[{role:"user",content:'Test connection. Respond with "OK".'}],max_tokens:10}),t=e.choices[0]?.message?.content;return{success:t?.includes("OK")||!1}}catch(e){return{success:!1,error:e instanceof Error?e.message:"Unknown error"}}}},2133:(e,t,a)=>{"use strict";a.d(t,{O:()=>s,p:()=>i});var o=a(8775);let r="https://ycfwvgsumatjhycpyrqk.supabase.co",s=(0,o.eI)(r,"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InljZnd2Z3N1bWF0amh5Y3B5cnFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyNTYxMzIsImV4cCI6MjA2NjgzMjEzMn0.jo33Y2UiF7CPr3lHte-KaHxcf12MXT3kd9QF2auZhzk",{auth:{autoRefreshToken:!0,persistSession:!0,detectSessionInUrl:!0}}),n=process.env.SUPABASE_SERVICE_ROLE_KEY||"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InljZnd2Z3N1bWF0amh5Y3B5cnFrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTI1NjEzMiwiZXhwIjoyMDY2ODMyMTMyfQ.W8aHuhzztJJsrMWWBh5hhl6eT44tEawNue08n06qoLU",i=(0,o.eI)(r,n,{auth:{autoRefreshToken:!1,persistSession:!1}})}};