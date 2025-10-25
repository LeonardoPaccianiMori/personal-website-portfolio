# Personal Data Science Portfolio

**A customized fork of [al-folio](https://github.com/alshedivat/al-folio) adapted for industry data science professionals.**

This repository is a heavily modified version of the al-folio Jekyll theme, transformed from an academic portfolio into a professional data science portfolio. This README documents all intentional deviations from the upstream repository to guide merge decisions when pulling updates.

---

## Purpose of This Document

**For LLM Agents and Future Maintainers:**

This README serves as a **merge decision guide** when applying commits from the upstream al-folio repository. When reviewing upstream changes:

1. **Skip changes** to deleted files/features (documented below)
2. **Apply changes** to core infrastructure (Jekyll, dependencies, bug fixes)
3. **Evaluate changes** to modified files against the customizations documented here

---

## Repository Transformation Summary

**Original:** Academic portfolio theme (publications, CV, teaching, etc.)
**Modified:** Professional data science portfolio (projects, blog, bookshelf)

**Target Audience:** Senior-level data scientists in industry
**Content Strategy:** Portfolio projects + technical blog (3-4 posts/year) + book recommendations

---

## Deleted Features & Files

### Academic Features (Completely Removed)

The following academic-focused features have been **intentionally deleted**. Skip all upstream commits that only modify these components:

#### 1. Publications System
- **Files Deleted:**
  - `_layouts/bib.liquid` - Bibliography layout
  - `_includes/bib_search.liquid` - Publication search
  - `_includes/selected_papers.liquid` - Featured papers component
  - `_bibliography/` - Directory for .bib files
  - `_pages/publications.md` - Publications page

- **Config Removed from `_config.yml`:**
  ```yaml
  # Lines 250-318 deleted:
  scholar:
    # Jekyll Scholar configuration (entire section)
  enable_publication_badges:
    # Publication metrics badges
  filtered_bibtex_keywords:
    # Bibtex filtering
  max_author_limit:
  enable_publication_thumbnails:
  ```

- **Plugins Removed:**
  - `jekyll/scholar` (line ~203 in plugins list)

- **Rationale:** No publications to showcase; industry focus rather than academic research

---

#### 2. CV/Resume Pages
- **Files Deleted:**
  - `_layouts/cv.liquid` - CV page layout
  - `_sass/_cv.scss` - CV styling
  - `_includes/cv/` - Entire directory (5 component files)
  - `_includes/resume/` - Entire directory (13 component files)
  - `_pages/cv.md` - CV page
  - `assets/json/resume.json` - Resume data
  - `assets/pdf/CV_*.pdf` - CV PDF files

- **Config Removed from `_config.yml`:**
  ```yaml
  # Lines 540-560 deleted:
  jekyll_get_json:
    - data: resume
  jsonresume:
    # Resume sections list
  ```

- **Import Removed from `assets/css/main.scss`:**
  - Line 15: `"cv"` import removed

- **Plugins Removed:**
  - `jekyll-get-json` (was on line ~192)

- **Rationale:** CV available upon request only; portfolio + LinkedIn serve this purpose

---

#### 3. News/Announcements System
- **Files Deleted:**
  - `_includes/news.liquid` - News display component
  - `_pages/news.md` - News archive page
  - `_news/` - News collection directory

- **Config Removed from `_config.yml`:**
  ```yaml
  # Lines 141-144 deleted from collections:
  news:
    defaults:
      layout: post
    output: true
  ```

- **Removed from `_layouts/about.liquid`:**
  - Lines 43-49: News/announcements section
  - Conditional check: `{% if page.announcements and page.announcements.enabled %}`

- **Removed from `_pages/about.md` front matter:**
  ```yaml
  announcements:
    enabled: false
    scrollable: true
    limit: 5
  ```

- **Rationale:** Not maintaining an announcements feed; blog serves this purpose

---

#### 4. Teaching & Repositories Pages
- **Files Deleted:**
  - `_pages/teaching.md` - Teaching page
  - `_pages/repositories.md` - GitHub repositories showcase
  - `_includes/repository/` - Repository display components

- **Rationale:** Not applicable to industry role

---

#### 5. Profiles Page
- **Files Deleted:**
  - `_layouts/profiles.liquid` - Profiles layout
  - `_pages/profiles.md` - Profiles page (team/lab members)

- **Rationale:** Individual portfolio, not a lab/team page

---

#### 6. Distill Layout (Interactive Papers)
- **Files Deleted:**
  - `_layouts/distill.liquid` - Distill.pub-style blog layout
  - `_includes/distill_scripts.liquid` - Interactive components loader
  - `_sass/_distill.scss` - **KEPT** (core styles still used)

- **What Distill Is:**
  - [Distill.pub](https://distill.pub/) is a research journal for machine learning with interactive visualizations
  - The layout supports D3.js visualizations, hoverable citations, sidenotes, and other interactive elements
  - Designed for long-form technical blog posts with rich interactivity

- **Rationale:** Not writing interactive research papers; standard blog post layout is sufficient

---

#### 7. Related Posts Feature
- **Files Deleted:**
  - `_includes/related_posts.liquid` - "Enjoy Reading This Article?" section

- **Config in `_config.yml` (kept but disabled):**
  ```yaml
  related_blog_posts:
    enabled: false  # Line 96-98
  ```

- **Rationale:** Only 5 blog posts planned; related posts adds unnecessary clutter

---

### Sample/Template Content (Removed)

All example content from the al-folio theme has been removed:

#### Blog Posts
- Deleted: All `_posts/2015-*.md` through `_posts/2024-*.md` (31 sample posts)
- Kept: User-created posts in `_posts/2025-*.md`

#### Projects
- Deleted: `_projects/1_project.md` through `_projects/9_project.md`
- Kept: `italian-real-estate.md`, `image-generation.md`

#### Images
- Deleted sample images: `assets/img/1.jpg` through `12.jpg`
- Deleted: `assets/img/book_covers/`, `assets/img/publication_preview/`
- Deleted sample assets: `assets/audio/`, `assets/video/`, `assets/plotly/`, `assets/jupyter/`, `assets/html/`

#### Other Pages
- Deleted: `_pages/dropdown.md`, `_pages/about_einstein.md`

---

## Modified Features & Configuration

### 1. Blog Configuration

**Blog Identity:**
```yaml
# _config.yml lines 89-90
blog_name: inference
blog_description: learning from evidence
```

**Display Configuration:**
```yaml
# _config.yml lines 246-247
display_tags: ["machine-learning", "deep-learning", "data-engineering", "algorithms", "databases", "LLM"]
display_categories: []  # Hidden to avoid awkward display
```

**Disabled Features:**
```yaml
# _config.yml
external_sources:  # Empty - no external blog aggregation
related_blog_posts:
  enabled: false  # No related posts section
imagemagick:
  enabled: false  # Disabled to fix broken link checker errors
```

---

### 2. Projects Configuration

**Categories:**
```yaml
# _pages/projects.md
display_categories: [portfolio]  # Changed from [work, fun]
```

**Rationale:** Work projects belong in About/Blog; Projects page = personal portfolio only

**All project files use:**
```yaml
category: portfolio
```

---

### 3. About Page (`_pages/about.md`)

**Removed from front matter:**
- `selected_papers: true` - No publications
- `announcements:` section - Deleted feature

**Content Structure:**
- ~230 words (down from 630)
- Lead with current role (Senior Data Scientist)
- Condensed project descriptions (removed tech stack details)
- Removed CV download link

**Kept Features:**
```yaml
latest_posts:
  enabled: true
  limit: 3
social: true
```

---

### 4. Typography/Fonts

**Changed from Roboto to IBM Plex:**

**In `_config.yml` (line 436):**
```yaml
google_fonts:
  url:
    fonts: "https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600;700&family=IBM+Plex+Serif:wght@300;400;500;600;700&family=Material+Icons&display=swap"
```

**In `_sass/_layout.scss` (lines 9 & 18):**
```scss
body {
  font-family: 'IBM Plex Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;

  h1, h2, h3, h4, h5, h6 {
    font-family: 'IBM Plex Serif', Georgia, 'Times New Roman', Times, serif;
  }
}
```

**Rationale:** IBM Plex provides technical sophistication appropriate for data science context

---

### 5. About Page Layout (`_layouts/about.liquid`)

**Removed sections:**
- Lines 43-49: News/announcements section (entire conditional block)
- Lines 51-57: Selected papers section (entire conditional block)

**Kept sections:**
- Profile image
- Latest posts
- Social icons
- Newsletter form (disabled via config)

---

### 6. Bookshelf Page

**Enabled in `_pages/books.md`:**
```yaml
nav: true        # Changed from false
nav_order: 4
```

**Book Status Values:**
Valid values for `status:` field in book files:
- `abandoned` - Started but gave up
- `finished` - Completed reading
- `interested` - Want to read
- `paused` - Currently paused
- `queued` - In reading queue
- `reading` - Currently reading
- `reread` - Read again

**Book Review Layout Fix (`_layouts/book-review.liquid`):**
- Added subtitle display support (lines 11-13)
- Fixed calendar icon to only show when `started:` date exists (line 84)

---

### 7. Collections

**Active Collections in `_config.yml`:**
```yaml
collections:
  books:
    output: true
  projects:
    output: true
```

**Removed:** `news` collection

---

## Files Modified (Not Deleted)

When applying upstream commits, **carefully review** changes to these files as they contain intentional customizations:

### Configuration
- `_config.yml` - Extensive modifications (see sections above)

### Content Pages
- `_pages/about.md` - Shortened content, removed academic elements
- `_pages/projects.md` - Changed categories
- `_pages/books.md` - Enabled in navigation

### Layouts
- `_layouts/about.liquid` - Removed news and publications sections
- `_layouts/book-review.liquid` - Fixed subtitle and calendar icon logic

### Styles
- `_sass/_layout.scss` - Custom font family declarations
- `assets/css/main.scss` - Removed `"cv"` import (line 15)

---

## Files Safe to Update (Unchanged)

The following files/directories are **unmodified from upstream** and safe to update via merge:

### Core Jekyll Infrastructure
- `Gemfile`, `Gemfile.lock`
- `_config.yml` (except for sections documented above)
- `.github/workflows/` - CI/CD workflows

### Layouts (Unmodified)
- `_layouts/default.liquid`
- `_layouts/page.liquid`
- `_layouts/post.liquid`
- `_layouts/archive.liquid`

### Includes (Unmodified)
- `_includes/header.liquid`
- `_includes/footer.liquid`
- `_includes/head.liquid`
- `_includes/scripts.liquid`
- `_includes/metadata.liquid`
- `_includes/social.liquid`
- `_includes/latest_posts.liquid`
- `_includes/pagination.liquid`
- `_includes/figure.liquid`
- Most other includes not listed in "Deleted" section

### Styles (Mostly Unmodified)
- `_sass/_base.scss`
- `_sass/_themes.scss`
- `_sass/_variables.scss`
- All other SCSS files except `_layout.scss`

### Assets
- JavaScript in `assets/js/`
- Fonts in `assets/fonts/`
- CSS framework files

---

## Merge Strategy Guide for LLMs

When reviewing upstream al-folio commits for merge:

### ✅ **ALWAYS APPLY** these types of commits:
1. **Security updates** - Dependencies, vulnerability fixes
2. **Bug fixes** - Core functionality improvements
3. **Jekyll/Ruby updates** - Version bumps, compatibility fixes
4. **Performance improvements** - Build optimizations, caching
5. **Accessibility improvements** - ARIA labels, screen reader support
6. **Mobile responsiveness** - Layout fixes, touch interactions
7. **Core layout improvements** - To unmodified layouts (default, page, post, archive)
8. **Plugin updates** - For plugins still in use
9. **Documentation** - If relevant to kept features

### ⚠️ **EVALUATE CAREFULLY** these types of commits:
1. **Changes to modified files** - Compare against documented customizations
2. **New optional features** - Assess fit with industry portfolio focus
3. **Style/theming changes** - May conflict with custom fonts
4. **Configuration additions** - Check if relevant to simplified setup

### ❌ **SKIP/REJECT** these types of commits:
1. **Changes to deleted files** - Any file listed in "Deleted Features" section
2. **New academic features** - Publications, teaching, repositories, CV templates
3. **Deleted plugin updates** - jekyll/scholar, jekyll-get-json
4. **Sample content additions** - New example posts, projects, images
5. **Configuration for deleted features** - Scholar, publications, news, resume config

### 🔍 **Special Cases:**

**If commit touches `_config.yml`:**
- Extract only changes to kept sections
- Skip changes to deleted sections (scholar, publications, news, resume)
- Preserve custom values (blog_name, display_tags, fonts)

**If commit touches `_layouts/about.liquid`:**
- Do NOT reintroduce news or publications sections
- Apply other layout improvements

**If commit touches `_sass/_layout.scss`:**
- Preserve custom font-family declarations (lines 9, 18)
- Apply other style improvements

**If commit touches deleted layouts:**
- Skip entirely (bib.liquid, cv.liquid, distill.liquid, profiles.liquid)

---

## Active Features (Keep Updated)

These features are **actively used** and should receive upstream updates:

### Content Types
- ✅ **Blog posts** - Standard post layout
- ✅ **Portfolio projects** - Project showcase
- ✅ **Bookshelf** - Book reviews and recommendations
- ✅ **About page** - Professional bio

### Features
- ✅ **RSS feed** - Blog subscribers
- ✅ **Social media links** - Contact icons
- ✅ **Dark mode** - Theme switcher
- ✅ **Pagination** - Blog archive
- ✅ **Tags/categories** - Blog filtering
- ✅ **Code highlighting** - Syntax highlighting for technical posts
- ✅ **Image handling** - Figure includes, lazy loading
- ✅ **MathJax** - Mathematical notation support
- ✅ **Responsive design** - Mobile/tablet layouts

### Disabled But Kept (Infrastructure Exists)
- 📭 **Newsletter subscription** - Disabled (`newsletter.enabled: false`)
- 📭 **Related posts** - Disabled (`related_blog_posts.enabled: false`)
- 📭 **ImageMagick** - Disabled (`imagemagick.enabled: false`)

---

## Upstream Repository

**Original Theme:** [alshedivat/al-folio](https://github.com/alshedivat/al-folio)
**License:** MIT (preserved)

When fetching upstream updates:
```bash
git remote add upstream https://github.com/alshedivat/al-folio.git
git fetch upstream
git cherry-pick <commit-hash>  # Selectively apply commits using guide above
```

---

## Development Notes

### Build System
- **Generator:** Jekyll 4.x
- **CSS Framework:** Bootstrap 5 + Material Design (MDB)
- **Deployment:** GitHub Pages compatible

### Active Plugins
See `_config.yml` lines 188-204 for current plugin list. Note that `jekyll/scholar` and `jekyll-get-json` have been removed.

### Performance
- ImageMagick disabled (was causing broken link checker errors)
- Reduced collections (no news, publications, CV)
- Faster build times due to removed features

---

## Content Strategy

### Blog Posts
- **Frequency:** 3-4 posts per year
- **Topics:** Technical deep dives, problem-solving stories, lessons learned
- **Style:** Focus on "why" not just "what"

### Projects
- **Scope:** Personal portfolio projects only
- **Detail Level:** Full end-to-end explanations
- **Work Projects:** Mentioned in About, detailed in blog posts (not project pages)

### Bookshelf
- **Mix:** ~60-70% technical, 30-40% personal reads
- **Purpose:** Humanize portfolio, show continuous learning
- **Review Style:** Brief reviews, not comprehensive

---

## Contact & Maintenance

This is a personal portfolio repository. For questions about the upstream al-folio theme, see the [original repository](https://github.com/alshedivat/al-folio).

For questions about these specific customizations, see the commit history or contact the repository owner.

---

**Last Updated:** 2025-10-25
**Based on al-folio:** v0.14.6
