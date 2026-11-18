Quick Notes LaTeX display fix (2026-11-18)

Upload only these two files while preserving paths:
  assets/notes.js
  quick-notes.html

This update preserves TeX delimiters before converting Markdown to HTML, adds KaTeX CSS, and renders formulas dynamically. No design/theme changes.

Math input examples:
  Inline: $F(K_1)=F(K_2)$
  Display: $$F(K_1\#K_2)=F(K_1)F(K_2)$$

If Pages CMS rich-text editor has ALREADY stripped dollar signs/backslashes before saving, the renderer cannot recover missing syntax. Edit the existing note in CMS source/Markdown mode or recreate a note with literal $$ delimiters, ensuring they survive in the saved .md file.

After updating GitHub, wait for Pages deployment and hard-refresh Quick Notes (Ctrl+F5).
