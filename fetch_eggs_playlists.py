#!/usr/bin/env python3
"""
Fetch EGGS • prefixed playlists from Spotify and generate data for EGGS Radio website
"""

import os
import json
import re
from datetime import datetime
from typing import List, Dict, Any
import spotipy
from spotipy.oauth2 import SpotifyOAuth

# Spotify credentials
SPOTIPY_CLIENT_ID = '30b6fca390d84f0b9f9e2a2921bdfc32'
SPOTIPY_CLIENT_SECRET = 'bfce333ba34f4efbae6af355f82516b4'
SPOTIPY_REDIRECT_URI = 'http://localhost:8888/callback'
SPOTIFY_SCOPE = 'playlist-read-private playlist-read-collaborative'

def initialize_spotify():
    """Initialize Spotify client with OAuth"""
    try:
        sp = spotipy.Spotify(auth_manager=SpotifyOAuth(
            client_id=SPOTIPY_CLIENT_ID,
            client_secret=SPOTIPY_CLIENT_SECRET,
            redirect_uri=SPOTIPY_REDIRECT_URI,
            scope=SPOTIFY_SCOPE
        ))
        return sp
    except Exception as e:
        print(f"Error initializing Spotify client: {e}")
        return None

def get_user_playlists(sp, user_id: str) -> List[Dict]:
    """Get all playlists for a user"""
    playlists = []
    offset = 0
    limit = 50
    
    while True:
        try:
            results = sp.user_playlists(user_id, limit=limit, offset=offset)
            playlists.extend(results['items'])
            
            if len(results['items']) < limit:
                break
            offset += limit
        except Exception as e:
            print(f"Error fetching playlists: {e}")
            break
    
    return playlists

def filter_eggs_playlists(playlists: List[Dict]) -> List[Dict]:
    """Filter playlists that start with 'EGGS •'"""
    eggs_playlists = []
    for playlist in playlists:
        if playlist['name'].startswith('EGGS •'):
            eggs_playlists.append(playlist)
    return eggs_playlists

def extract_theme(title: str) -> str:
    """Extract theme from title (everything after 'EGGS • ')"""
    if 'EGGS •' in title:
        return title.split('EGGS •', 1)[1].strip()
    return title

def get_playlist_tracks(sp, playlist_id: str) -> List[Dict]:
    """Get all tracks for a playlist"""
    tracks = []
    offset = 0
    limit = 100
    
    while True:
        try:
            results = sp.playlist_tracks(playlist_id, limit=limit, offset=offset)
            tracks.extend(results['items'])
            
            if len(results['items']) < limit:
                break
            offset += limit
        except Exception as e:
            print(f"Error fetching tracks for playlist {playlist_id}: {e}")
            break
    
    return tracks

def format_track(track_item: Dict) -> Dict:
    """Format track data for our structure"""
    track = track_item.get('track', {})
    if not track or not track.get('id'):  # Skip if no track or no ID
        return None
    
    return {
        'name': track.get('name', 'Unknown'),
        'artist': ', '.join([artist['name'] for artist in track.get('artists', [])]),
        'album': track.get('album', {}).get('name', 'Unknown'),
        'duration': track.get('duration_ms', 0) // 1000,  # Convert to seconds
        'spotifyId': track.get('id', ''),
        'previewUrl': track.get('preview_url', '')
    }

def calculate_total_duration(tracks: List[Dict]) -> int:
    """Calculate total duration in minutes"""
    total_seconds = sum(track.get('duration', 0) for track in tracks if track)
    return total_seconds // 60

def format_playlist_data(playlist: Dict, tracks: List[Dict]) -> Dict:
    """Format playlist data for EGGS Radio"""
    # Create URL-friendly ID from title
    playlist_id = re.sub(r'[^a-zA-Z0-9\s-]', '', playlist['name'])
    playlist_id = re.sub(r'\s+', '-', playlist_id).lower()
    playlist_id = playlist_id.replace('eggs-', 'eggs-')
    
    # Format tracks properly
    formatted_tracks = []
    for track_item in tracks:
        formatted_track = format_track(track_item)
        if formatted_track:
            formatted_tracks.append(formatted_track)
    
    return {
        'id': playlist_id,
        'title': playlist['name'],
        'description': playlist.get('description', ''),
        'theme': extract_theme(playlist['name']),
        'songCount': len(formatted_tracks),
        'duration': calculate_total_duration(formatted_tracks),
        'spotifyId': playlist['id'],
        'spotifyUrl': playlist['external_urls']['spotify'],
        'coverImage': playlist['images'][0]['url'] if playlist.get('images') else '',
        'lastUpdated': playlist['snapshot_id'],  # Using snapshot_id as last updated indicator
        'tracks': formatted_tracks
    }

def main():
    """Main function to fetch and process EGGS playlists"""
    print("🎵 Fetching EGGS • playlists from Spotify...")
    
    # Initialize Spotify client
    sp = initialize_spotify()
    if not sp:
        print("❌ Failed to initialize Spotify client")
        return
    
    try:
        # Get current user
        user = sp.current_user()
        user_id = user['id']
        print(f"👤 Connected as: {user['display_name']}")
        
        # Get all playlists
        print("📋 Fetching all playlists...")
        all_playlists = get_user_playlists(sp, user_id)
        print(f"Found {len(all_playlists)} total playlists")
        
        # Filter EGGS playlists
        eggs_playlists = filter_eggs_playlists(all_playlists)
        print(f"🎯 Found {len(eggs_playlists)} EGGS • playlists")
        
        if not eggs_playlists:
            print("❌ No EGGS • playlists found")
            return
        
        # Process each EGGS playlist
        processed_playlists = []
        
        for i, playlist in enumerate(eggs_playlists, 1):
            print(f"\n📀 Processing {i}/{len(eggs_playlists)}: {playlist['name']}")
            
            # Get tracks
            print("  🎵 Fetching tracks...")
            tracks = get_playlist_tracks(sp, playlist['id'])
            print(f"  Found {len(tracks)} tracks")
            
            # Format data
            playlist_data = format_playlist_data(playlist, tracks)
            processed_playlists.append(playlist_data)
            
            print(f"  ✅ Processed: {playlist_data['songCount']} songs, {playlist_data['duration']} minutes")
        
        # Generate JavaScript data structure
        js_content = generate_javascript_data(processed_playlists)
        
        # Save to file
        output_file = 'eggs_playlists_data.js'
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(js_content)
        
        print(f"\n🎉 Success! Generated {output_file}")
        print(f"📊 Processed {len(processed_playlists)} playlists")
        
        # Print summary
        total_songs = sum(p['songCount'] for p in processed_playlists)
        total_duration = sum(p['duration'] for p in processed_playlists)
        print(f"📈 Total: {total_songs} songs, {total_duration} minutes")
        
    except Exception as e:
        print(f"❌ Error: {e}")

def generate_javascript_data(playlists: List[Dict]) -> str:
    """Generate JavaScript data structure for EGGS Radio"""
    js_content = "// EGGS Radio playlist data - Auto-generated\n"
    js_content += "const playlists = " + json.dumps(playlists, indent=4, ensure_ascii=False) + ";\n\n"
    js_content += "// Export for use in other scripts\n"
    js_content += "if (typeof module !== 'undefined' && module.exports) {\n"
    js_content += "    module.exports = playlists;\n"
    js_content += "}\n"
    
    return js_content

if __name__ == "__main__":
    main()
