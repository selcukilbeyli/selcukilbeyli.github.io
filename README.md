# Selçuk İlbeyli — Independent Researcher (v2)

This is an updated GitHub Pages website, retaining the existing design with a new hero motto, pencil portrait, research focus, preprint list, and public Quick Notes.

## Replace old files

1. In your repo `selcukilbeyli/selcukilbeyli.github.io`, use **Add file → Upload files**.
2. Upload the **contents** of this ZIP to repository root. GitHub web interface may not preserve directory hierarchy when selecting individual files: drag the extracted folders or use GitHub Desktop. Important files: `index.html`, `quick-notes.html`, `.pages.yml`, `.nojekyll`, `assets/` folder, `admin/` folder, `notes/` folder.
3. Commit changes. Ensure GitHub Pages still deploys `main` `/(root)`.

## To enable note publishing without coding

1. Open https://app.pagescms.org/ and sign in using GitHub.
2. Install/authorize Pages CMS GitHub App for **only** your `selcukilbeyli.github.io` repo.
3. Select the repo and find the **Quick Notes** collection, supplied by `.pages.yml`.
4. Use Create to write a note and upload files through the Media Library or file field.
5. Set `Show publicly on the website` to **true** and save. The note will appear in the chronological Quick Notes page (the viewer reads the public GitHub repository).
6. You may open `/admin/` on your own website as a shortcut to the hosted CMS, but actual sign-in and editing occur on Pages CMS's domain.

## Important: draft confidentiality

This repo is public. ANY note or uploaded file committed to it is visible in GitHub, even with `published: false`. Therefore, there is no safe private draft system in this deployment. Unpublished entries can be hidden from the website, but NOT from GitHub. Do not save unpublished PRIVATE drafts here. A separate `/admin/drafts.html` screen saves private drafts **only in browser localStorage** and offers Markdown backups. It is not cloud-synced, password-protected, or durable across browser-data resets; access is limited by the device/browser profile. Private cloud drafts require a separate secure storage service, not included in v2.

## Implementation notes

- The public notes page reads Markdown documents from the GitHub public Contents API. There can be read limits and delays due to CDN / caching.
- Markdown is sanitized with DOMPurify, and KaTeX renders inline and display math.
- A PDF attachment is embedded where supported by the visitor's browser; other documents download via link.
- Publication records from the screenshot have no verified ResearchGate individual URL; ResearchGate buttons point to the profile. Only arXiv 2610.07187 has a verified direct link.
- User's meeting photo is shown without asserting co-authorship or collaboration.
- For many notes, switch to a static build and index rather than the GitHub Contents API.
- Site is a static prototype plus functional remote CMS integration after your GitHub authorization; we cannot authorize the GitHub App for you.
