<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1Iq5AVN0WcnmhS87OXGcXNvXTywTOvTbB

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Deploy to GitHub Pages

This app is configured to automatically deploy to GitHub Pages when you push to the main branch.

**Setup:**

1. Go to your repository settings on GitHub
2. Navigate to "Pages" in the sidebar
3. Under "Source", select "GitHub Actions"
4. Add your `API_KEY` as a repository secret:
   - Go to Settings > Secrets and variables > Actions
   - Click "New repository secret"
   - Name: `API_KEY`
   - Value: Your Gemini API key

Once configured, every push to main will automatically build and deploy your app to:
`https://drgmb.github.io/Palacio-da-Memoria/`
