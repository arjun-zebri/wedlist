# Objective

Generate a structured JSON file containing a comprehensive list of Sydney-based wedding MCs.

The output must be a clean JSON array where each object represents one wedding MC.

This task requires:

1. Crawling specified wedding directories and google search result pages
2. Extracting structured vendor data
3. Normalizing inconsistent formats
4. Removing duplicates
5. Outputting valid JSON only

---

# Geographic Scope

Include only vendors that:

- Explicitly operate in Sydney, NSW
- Or state "Sydney wedding MC"
- Or list Sydney as primary service area

Exclude:

- DJs unless they explicitly market themselves as wedding MCs
- Corporate-only MCs
- Interstate-only vendors

---

# Required JSON Schema

Each vendor must follow this exact schema:

{
"id": "",
"business_name": "",
"contact_name": "",
"website_url": "",
"email": "",
"phone": "",
"instagram_url": "",
"facebook_url": "",
"service_areas": [],
"pricing": {
"starting_price": "",
"currency": "AUD",
"pricing_notes": ""
},
"packages": [],
"years_in_business": "",
"google_rating": "",
"google_reviews_count": "",
"description": "",
"source_url": ""
}

If a field cannot be found, use null.

---

# Data Sources to Crawl

Start with:

1. Google search queries:
   - "Sydney wedding MC"
   - "Wedding MC Sydney NSW"
   - "Professional wedding MC Sydney"

---

# Extraction Rules

- Extract visible contact info only
- Do NOT hallucinate emails or phone numbers
- Do NOT guess pricing
- Do NOT infer ratings without visible source
- Preserve formatting consistency
- Remove duplicate vendors by matching website or business name

---

# Output Requirements

- Output must be valid JSON
- No commentary
- No markdown
- No explanation
- No trailing commas
- Save as: sydney_wedding_mcs.json

---

# Data Cleaning

- Remove tracking parameters from URLs
- Ensure Instagram links are full URLs
- Ensure websites include https://

---

# Validation

Before final output:

- Confirm JSON is valid
- Confirm no duplicate business_name values
- Confirm all vendors are Sydney-based
- Confirm schema matches exactly
