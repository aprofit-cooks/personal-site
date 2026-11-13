#!/usr/bin/env node
/**
 * Fetches movie poster URLs from TMDB and adds them to index.html.
 *
 * Usage:
 *   1. Sign up free at https://www.themoviedb.org/settings/api
 *   2. Copy your "API Read Access Token" (the long one, starts with "ey...")
 *   3. Run:  node fetch-posters.js YOUR_TOKEN_HERE
 *
 * This script:
 *   - Reads movie titles from index.html
 *   - Searches TMDB for each one
 *   - Writes poster URLs back into the movie objects in index.html
 *   - The token is only used locally — never deployed to your site
 */

const fs = require("fs");
const path = require("path");

const token = process.argv[2];
if (!token) {
  console.error("Usage: node fetch-posters.js <TMDB_READ_ACCESS_TOKEN>");
  console.error("Get one free at https://www.themoviedb.org/settings/api");
  process.exit(1);
}

const INDEX = path.join(__dirname, "index.html");
const IMG_BASE = "https://image.tmdb.org/t/p/w342";

async function searchMovie(title) {
  const url = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(title)}&language=en-US&page=1`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
  });
  if (!res.ok) {
    console.error(`  TMDB error for "${title}": ${res.status}`);
    return null;
  }
  const data = await res.json();
  const match = data.results?.[0];
  if (!match?.poster_path) {
    console.warn(`  No poster found for "${title}"`);
    return null;
  }
  return IMG_BASE + match.poster_path;
}

async function main() {
  let html = fs.readFileSync(INDEX, "utf-8");

  // Extract movie titles (lines with title: "..." in the Movies array)
  const movieRegex = /\{\s*title:\s*"([^"]+)"[^}]*?(?:poster:\s*"[^"]*")?[^}]*?\}/g;
  const moviesSection = html.slice(html.indexOf("Movies:"));
  const movies = [];
  let m;
  while ((m = movieRegex.exec(moviesSection)) !== null) {
    movies.push(m[1]);
    if (moviesSection.indexOf("]", m.index) < moviesSection.indexOf("{", m.index + 1) || !moviesSection.includes("{", m.index + 1)) {
      // Check if we've gone past the Movies array
    }
  }

  // Stop at the closing bracket of the Movies array
  const filtered = [];
  const moviesStart = moviesSection.indexOf("[");
  const moviesEnd = moviesSection.indexOf("]");
  const moviesBlock = moviesSection.slice(moviesStart, moviesEnd);
  const titleRe = /title:\s*"([^"]+)"/g;
  while ((m = titleRe.exec(moviesBlock)) !== null) {
    filtered.push(m[1]);
  }

  console.log(`Found ${filtered.length} movies. Fetching posters...\n`);

  for (const title of filtered) {
    if (title === "Letterboxd") {
      console.log(`  Skipping "${title}" (not a movie)`);
      continue;
    }
    const posterUrl = await searchMovie(title);
    if (posterUrl) {
      // Add or update poster field for this movie entry
      // Find the exact object in html and add poster
      const entryRe = new RegExp(
        `(\\{\\s*title:\\s*"${title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"[^}]*?)(\\s*\\})`,
        "s"
      );
      const match = html.match(entryRe);
      if (match) {
        let entry = match[1];
        // Remove existing poster field if any
        entry = entry.replace(/,?\s*poster:\s*"[^"]*"/, "");
        html = html.replace(entryRe, `${entry}, poster: "${posterUrl}"${match[2]}`);
        console.log(`  ✓ ${title}`);
      }
    }
  }

  fs.writeFileSync(INDEX, html, "utf-8");
  console.log(`\nDone! Poster URLs written to index.html.`);
  console.log("Preview with: open index.html");
}

main().catch(console.error);
