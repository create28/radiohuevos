# Data Accuracy Guide for Radio Huevos

## ⚠️ IMPORTANT: Always Use Automated Data Fetching

### The Problem
Manual playlist data entry leads to **incorrect song counts and durations** because:
- Human estimation is unreliable
- Spotify API provides exact data
- Manual entry is error-prone and time-consuming

### The Solution
**ALWAYS use the automated script** instead of manual data entry:

```bash
cd "/Users/chrismilne/Documents/2025/04 Spotify Listener/EGGS Radio"
python3 fetch_eggs_playlists.py
cp eggs_playlists_data.js script.js
```

### Workflow for Adding/Updating Playlists

1. **Add playlist to Spotify** (if new)
2. **Run the automated script**:
   ```bash
   python3 fetch_eggs_playlists.py
   ```
3. **Copy accurate data**:
   ```bash
   cp eggs_playlists_data.js script.js
   ```
4. **Commit changes**:
   ```bash
   git add script.js
   git commit -m "Update playlist data with accurate Spotify API data"
   git push
   ```

### What the Script Does
- ✅ Fetches **real track counts** from Spotify API
- ✅ Calculates **exact durations** from track data
- ✅ Gets **actual cover images** from Spotify
- ✅ Includes **real Spotify IDs** for embedding
- ✅ Updates **all 18 EGGS playlists** automatically
- ✅ Handles **special characters** and **encoding** properly

### Recent Fix Example
- **Before**: "Great workout songs" showed 30 songs, 2h 0m
- **After**: "Great workout songs" shows 34 songs, 2h 13m
- **Accuracy**: 100% correct data from Spotify API

### Never Do This
❌ **Don't manually estimate** song counts or durations
❌ **Don't copy/paste** track lists manually
❌ **Don't guess** cover image URLs
❌ **Don't create** placeholder Spotify IDs

### Always Do This
✅ **Use the automated script** for all playlist updates
✅ **Verify data accuracy** before committing
✅ **Test the website** after updates
✅ **Document changes** in commit messages

## Current Playlist Count
- **Total Playlists**: 18 EGGS • playlists
- **Total Songs**: 482 tracks
- **Total Duration**: 1,961 minutes (32.7 hours)
- **Last Updated**: Automated via Spotify API

---
*This guide prevents the recurring data accuracy issues that have occurred in the past.*





