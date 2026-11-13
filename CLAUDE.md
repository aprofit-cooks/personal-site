# Personal website

Static personal site. One page, no backend, no build step (yet).

## Origin
Skeleton was designed in a claude.ai chat. Decisions below came from that chat; treat them as settled unless I say otherwise.

## Structure
- `index.html` — the whole site. HTML + CSS + JS in one file.
- All content lives in the `SITE` object at the top of the `<script>`. To add/change content, edit only `SITE`. Rendering code below it should rarely change.
- `assets/` — photo, resume PDF, trip/adventure photos. Reference as `assets/filename.jpg` in `SITE`.

## Sections
1. About — photo, short bio, email, social links (X, Instagram, LinkedIn, GitHub, Resume)
2. Writing — links out to my Substack posts
3. Projects — mostly coding projects; each has GitHub + live link
4. Adventures — trips, photo galleries, new things I try. Each entry can have a "Why:" line.
   - e.g. picked up club water polo, competing in tournaments. Why: hardest sport for a beginner to pick up, and it's really fun.
5. Consume ("Consume, consume, consume") — "Right now" strip + tabs: Books, Blogs, Podcasts, Channels, Movies

## Design (keep consistent)
- White background, dark text, NYT-inspired. Simple.
- Fonts: Source Serif 4 (headlines + body), Libre Franklin (nav, dates, small UI text). Google Fonts.
- Colors: ink #000, body #333, muted #6b6b6b, rules #dcdcdc, links #326891. Dark-mode tokens exist in `:root`.
- Single reading column (~42rem). Sentence case everywhere. No all-caps labels, no numbered section markers, no cards/shadows.
- Mobile-first: must look right on a phone.

## Rules for changes
- No new dependencies or frameworks without asking me first.
- Keep it a static site. No server, no database.
- Images: resize to ~1600px wide, prefer WebP/JPEG under ~300KB each.
- Don't put my phone number or home address anywhere public (including the resume PDF).
- After any change, tell me how to preview it (open `index.html` in a browser, or `npx serve .`).

## Roadmap
- [ ] Fill in real content (name, bio, links, projects, writing, adventures, favorites)
- [ ] Add photo + resume to `assets/`
- [ ] Put this folder in a GitHub repo
- [ ] Deploy on Vercel (free), connect custom domain (buy at Cloudflare Registrar or Porkbun)
- [ ] Later, only if content outgrows one file: migrate to Astro with Markdown content; give each adventure its own page; pull Substack RSS at build time

## About me (working style)
I'm new to this. Explain each step briefly, ask before doing anything irreversible (deleting files, pushing, buying things), and keep changes small so I can check them.
