# Social Downloader

[![Netlify Status](https://api.netlify.com/api/v1/badges/1c1c5fe0-6184-4cd2-8276-55753b37f8a3/deploy-status)](https://app.netlify.com/projects/social-downloarder/deploys)

A React web app that downloads media from Instagram, TikTok, and X (Twitter) using the Cobalt public API.

## Features

- Paste a post or video link and get download links
- Handles posts with multiple media files
- Clean, mobile-friendly UI

## Getting started

```bash
npm install
npm run dev
```

The app uses a Netlify Function proxy in production. For local testing with the function, install the Netlify CLI, then set the RapidAPI key and run:

```bash
npm install -g netlify-cli
netlify env:set RAPIDAPI_KEY "your-rapidapi-key"
netlify dev
```

## Build

```bash
npm run build
```

## Deploy to Netlify

This repo includes a `netlify.toml` file. Create a new site in Netlify and point it to this repo. Add the `RAPIDAPI_KEY` environment variable in Netlify (Site settings → Environment variables). Netlify will run `npm run build` and publish the `dist` folder automatically.

## Notes

- Works best with public posts. Private or age-restricted content may fail.
- Powered by RapidAPI (social-download-all-in-one).
