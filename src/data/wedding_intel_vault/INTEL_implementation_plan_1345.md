# Implementation Plan - Intelligent Data Enrichment Strategy

## Goal Description
Enrich UNIO's database with high-value data from Bodas.net's 50,000+ providers using an intelligent, incremental approach that prioritizes quality over quantity.

## Current State Analysis
- **Scraped Data**: 14,388 HTML files in `html-scraped/`
- **Current DB**: ~2,408 providers imported (basic data)
- **Missing Critical Data**: Pricing, detailed reviews, full image galleries
- **Opportunity**: 50,000+ providers available on Bodas.net

## Strategic Approach: "Smart Enrichment Pipeline"

### Phase 1: Enhanced Parser (The Brain)
**Objective**: Extract ALL valuable data from existing HTML files.

#### [MODIFY] `parser-config-complete.js`
- **Pricing Extraction**: Parse price ranges from HTML (currently missing)
- **Review Mining**: Extract full review text, ratings, dates
- **Image Gallery**: Capture all images, not just the first one
- **Service Tags**: Extract specialties and service offerings
- **Availability Calendar**: Parse booking availability if present

### Phase 2: Incremental Re-Processing
**Objective**: Re-process existing 14K HTML files with enhanced parser.

#### [NEW] `smart-reprocess.js`
- Read existing Firestore data
- For each provider:
  - Check if HTML file exists
  - Parse with enhanced parser
  - **Merge** new data with existing (don't overwrite good data)
  - Update `completeness_score`
- Batch updates to Firestore (500 per batch)

### Phase 3: Targeted Expansion (The Growth Engine)
**Objective**: Strategically scrape NEW high-value providers.

#### [NEW] `intelligent-scraper.js`
- **Priority Algorithm**:
  1. Premium tier providers (verified badges on Bodas.net)
  2. High review count (>20 reviews)
  3. Complete profiles (pricing + images + contact)
  4. Geographic diversity (fill gaps in our coverage)
- **Rate Limiting**: Respect Bodas.net (1 request/2 seconds)
- **Incremental**: Add 1,000 providers/week to avoid detection

### Phase 4: AI-Powered Quality Score
**Objective**: Rank providers by "UNIO Value Score"

#### [NEW] `quality-scorer.js`
Calculate composite score:
- **Data Completeness**: 30% (has pricing, images, reviews)
- **Engagement Potential**: 25% (review count, response rate)
- **Visual Appeal**: 20% (image quality, gallery size)
- **SEO Value**: 15% (unique description, keywords)
- **Recency**: 10% (last updated date)

Use this to prioritize which providers to display first.

## Verification Plan
1. **Data Integrity**: Compare before/after enrichment stats
2. **Performance**: Ensure Firestore queries remain fast (<500ms)
3. **UI Impact**: Verify pricing displays correctly on all cards

## Estimated Impact
- **Week 1**: Re-process 14K providers → 95% have pricing
- **Week 4**: Add 4K premium providers → 18K total
- **Week 12**: Reach 50K providers with intelligent filtering
