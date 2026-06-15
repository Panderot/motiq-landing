---
name: Kinetic Cyber
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#3a3939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  on-surface: '#e5e2e1'
  on-surface-variant: '#e0c0af'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#a78b7c'
  outline-variant: '#584235'
  surface-tint: '#ffb68b'
  primary: '#ffb68b'
  on-primary: '#522300'
  primary-container: '#ff7a00'
  on-primary-container: '#5c2800'
  inverse-primary: '#994700'
  secondary: '#c6c6c7'
  on-secondary: '#2f3131'
  secondary-container: '#454747'
  on-secondary-container: '#b4b5b5'
  tertiary: '#c8c6c5'
  on-tertiary: '#313030'
  tertiary-container: '#a2a0a0'
  on-tertiary-container: '#373737'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdbc8'
  primary-fixed-dim: '#ffb68b'
  on-primary-fixed: '#321200'
  on-primary-fixed-variant: '#753400'
  secondary-fixed: '#e2e2e2'
  secondary-fixed-dim: '#c6c6c7'
  on-secondary-fixed: '#1a1c1c'
  on-secondary-fixed-variant: '#454747'
  tertiary-fixed: '#e5e2e1'
  tertiary-fixed-dim: '#c8c6c5'
  on-tertiary-fixed: '#1c1b1b'
  on-tertiary-fixed-variant: '#474746'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
typography:
  display:
    fontFamily: Manrope
    fontSize: 64px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.03em
  headline-lg:
    fontFamily: Manrope
    fontSize: 48px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Manrope
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.3'
  headline-sm:
    fontFamily: Manrope
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0.05em
  headline-lg-mobile:
    fontFamily: Manrope
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 64px
  stack-sm: 12px
  stack-md: 24px
  stack-lg: 48px
---

## Brand & Style

The design system is engineered for a high-performance, AI-driven automation brand. The personality is "Sophisticated Technicality"—a blend of cutting-edge innovation and rigorous professional reliability. It targets an audience of enterprise leaders and technical founders who value efficiency and futuristic vision.

The visual style is a hybrid of **Modern Minimalism** and **Glassmorphism**, characterized by:
- **Deep Immersion:** A dark-first aesthetic that minimizes eye strain and emphasizes content.
- **High-Tech Precision:** Use of subtle grid patterns and glowing border treatments to evoke a sense of digital "circuitry" and architectural structure.
- **Vibrant Functional Accents:** Strategic use of high-chroma orange to guide the eye toward primary actions and key data points.
- **Cinematic Depth:** Layered surfaces with translucent properties and background blurs to create a multi-dimensional workspace.

## Colors

This design system utilizes a high-contrast dark palette to create a premium, "dashboard-like" atmosphere.

- **Background & Surface:** The foundation is an absolute black (`#050505`), providing maximum contrast for the white and orange elements. Surfaces use a slightly lighter elevation (`#121212`) to separate content modules.
- **Accent (Energy):** The primary orange (`#FF7A00`) is reserved for calls to action, brand highlights, and active states. It should be used sparingly to maintain its visual impact.
- **Gradients & Glows:** Subtle radial gradients of the primary color at low opacities are used behind cards or as "glow" effects on borders to signify high-value interactive areas.
- **Neutral Scale:** Typography uses pure white for headlines and a muted 60% opacity white for body text to establish a clear information hierarchy.

## Typography

The typography system relies on **Manrope** for its clean, geometric, yet approachable character. It provides the professional modernism required for the brand.

- **Hierarchy:** Use tight line-heights for large display text to create a compact, impactful look. 
- **Technical Detail:** **JetBrains Mono** is introduced for labels, tags, and small metadata to reinforce the high-tech, "developer-grade" nature of the product.
- **Scalability:** Large displays should transition to `headline-lg-mobile` on devices smaller than 768px to ensure readability and prevent excessive text wrapping.
- **Styling:** Headlines frequently utilize "span" styling for the primary color to highlight the most critical words in a sentence.

## Layout & Spacing

This design system uses a **Fluid Grid** model with generous outer margins to focus attention on the central content.

- **Rhythm:** An 8px linear scale governs all padding and margins, ensuring mathematical harmony across the UI.
- **Grid Pattern:** A subtle dot-grid or line-grid background should be used within container backgrounds (opacity 0.05) to provide a sense of alignment and technical precision.
- **Breakpoints:**
  - **Mobile (<768px):** 4 columns, 16px margins, 16px gutters.
  - **Tablet (768px - 1024px):** 8 columns, 32px margins, 20px gutters.
  - **Desktop (>1024px):** 12 columns, fixed container width of 1200px, 24px gutters.
- **Vertical Spacing:** Section blocks should be separated by `stack-lg` to create a sense of breathability and luxury.

## Elevation & Depth

Visual hierarchy is achieved through **Tonal Layering** and **Glassmorphism** rather than traditional heavy shadows.

- **Base Layer:** Pure background color (`#050505`).
- **Surface Layer:** Dark grey (`#121212`) with a subtle 1px border (`rgba(255, 255, 255, 0.08)`).
- **Glass Effect:** High-level components (like navigation bars or modal overlays) use a background blur of 12px and a semi-transparent fill (`rgba(18, 18, 18, 0.7)`).
- **The "Glow" Elevation:** To denote focus or high priority, a 1px border using the primary orange color with a 2px-4px outer spread (low opacity) is used to make the element appear "energized."

## Shapes

The shape language is "Calculated Softness." Elements are rounded enough to feel modern and accessible, but not so much that they lose their technical edge.

- **Standard Radius:** 8px (`0.5rem`) for cards, input fields, and standard buttons.
- **Large Radius:** 16px (`1rem`) for primary containers and parent sections.
- **Interactive Indicators:** Small icons or status pips (like the "Available now" badge) should be fully pill-shaped to stand out against the geometric grid.

## Components

- **Buttons:**
  - **Primary:** Solid `#FF7A00` background with black text. Sharp 8px corners. Include a subtle "sparkle" or "arrow" icon for directional flow.
  - **Secondary:** Transparent background with a 1px `white/0.2` border. White text.
- **Cards:** Use the `#121212` surface color. Top-down lighting effect achieved with a very subtle white-to-transparent linear gradient on the border.
- **Input Fields:** Darker than the surface color, 1px border that glows orange on focus. Labels use the `label-md` typography style.
- **Chips/Tags:** Small, semi-transparent backgrounds with a 1px border. Use `JetBrains Mono` for the text.
- **Navigation Bar:** A floating glassmorphic pill-shaped container or a full-width blur at the top. The "Let's Talk" CTA should be distinguished by a unique border treatment or the primary color.
- **Feature Icons:** Encased in a soft-glow container with the primary color at 10% opacity, utilizing thin-stroke monoline icons.