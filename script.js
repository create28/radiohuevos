// EGGS Radio playlist data
const playlists = [
    {
        id: 'eggs-60s-70s',
        title: 'EGGS • Songs from the 60s and 70s',
        description: 'Auto-generated playlist for theme: Songs from the 60s and 70s',
        songCount: 54,
        duration: 282, // 4 hours and 42 minutes
        spotifyId: '143907TltAKd9PESmnV8h9',
        coverImage: 'REPLACE_WITH_REAL_COVER_URL_1' // Replace with actual cover URL from Spotify
    },
    {
        id: 'eggs-old-gold',
        title: 'EGGS • Old Gold',
        description: 'A curated collection of classic tracks spanning multiple decades',
        songCount: 54,
        duration: 117, // 1 hour 57 minutes
        spotifyId: '4Mqcnk5dcq1LLG7pjhDWhw',
        coverImage: 'REPLACE_WITH_REAL_COVER_URL_2' // Replace with actual cover URL from Spotify
    },
    {
        id: 'eggs-under-1-million',
        title: 'EGGS • Songs with under 1 million spotify plays',
        description: 'Hidden gems and lesser-known tracks with under 1 million plays',
        songCount: 10, // Based on visible tracks
        duration: 33, // 32 min 58 sec
        spotifyId: '7Chyi44kSJE3UIUbAhtj2J',
        coverImage: 'REPLACE_WITH_REAL_COVER_URL_3' // Replace with actual cover URL from Spotify
    },
    {
        id: 'eggs-songs-about-places',
        title: 'EGGS • Songs about places',
        description: 'Musical journey through different locations and destinations',
        songCount: 20, // Based on visible tracks
        duration: 84, // 1 hr 24 min
        spotifyId: '4UnUBr1ZLR7qj8RvX6YClv',
        coverImage: 'REPLACE_WITH_REAL_COVER_URL_4' // Replace with actual cover URL from Spotify
    },
    {
        id: 'eggs-confidence-boost',
        title: 'EGGS • Confidence boost songs',
        description: 'Empowering tracks to boost your confidence and motivation',
        songCount: 20, // Based on visible tracks
        duration: 58, // 58 min 1 sec
        spotifyId: '2a8FS36lFEeoFSpyTv9OXD',
        coverImage: 'REPLACE_WITH_REAL_COVER_URL_5' // Replace with actual cover URL from Spotify
    }
];

// Utility function to format duration in minutes to hours and minutes
function formatDuration(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
        return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
}

// Function to get themed fallback image based on playlist title
function getThemedFallbackImage(playlistTitle) {
    // Remove "EGGS • " prefix and get the theme
    const theme = playlistTitle.replace('EGGS • ', '').toLowerCase();
    
    // Map themes to specific Unsplash image IDs for consistent themed images
    const themeImages = {
        'songs from the 60s and 70s': 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=640&h=640&fit=crop&crop=center&auto=format&q=80', // Vintage vinyl
        'old gold': 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=640&h=640&fit=crop&crop=center&auto=format&q=80', // Golden vinyl
        'songs with under 1 million spotify plays': 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=640&h=640&fit=crop&crop=center&auto=format&q=80', // Hidden gems
        'songs about places': 'https://images.unsplash.com/photo-1506905925346-14b1e526d924?w=640&h=640&fit=crop&crop=center&auto=format&q=80', // Travel/places
        'confidence boost songs': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=640&h=640&fit=crop&crop=center&auto=format&q=80' // Energy/confidence
    };
    
    // Return the themed image or a default music image
    return themeImages[theme] || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=640&h=640&fit=crop&crop=center&auto=format&q=80';
}

// Create playlist card HTML
function createPlaylistCard(playlist) {
    // Always use themed fallback for now since we have placeholder URLs
    const coverImage = getThemedFallbackImage(playlist.title);
    
    return `
        <a href="playlist-detail.html?id=${playlist.id}" class="group bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden border border-gray-200">
            <div class="aspect-square overflow-hidden">
                <img src="${coverImage}" alt="${playlist.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200">
            </div>
            <div class="p-4">
                <h3 class="font-semibold text-gray-900 text-lg mb-2 line-clamp-2">${playlist.title}</h3>
                <p class="text-gray-600 text-sm mb-4 line-clamp-2">${playlist.description}</p>
                <div class="flex justify-between items-center text-sm text-gray-500 mb-4">
                    <span>${playlist.songCount} songs</span>
                    <span>${formatDuration(playlist.duration)}</span>
                </div>
                <div class="w-full bg-gray-900 text-white text-center py-2 px-4 rounded-md hover:bg-gray-800 transition-colors duration-200">
                    View Playlist
                </div>
            </div>
        </a>
    `;
}

// Render all playlist cards
function renderPlaylists() {
    const grid = document.getElementById('playlistsGrid');
    if (!grid) {
        console.error('Could not find playlistsGrid element');
        return;
    }
    
    console.log('Rendering playlists:', playlists.length);
    grid.innerHTML = playlists.map(playlist => createPlaylistCard(playlist)).join('');
}

// Get playlist by ID
function getPlaylistById(id) {
    return playlists.find(playlist => playlist.id === id);
}

// Get URL parameters
function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing Radio Huevos');
    
    // Check if we're on the detail page
    const playlistId = getUrlParameter('id');
    
    if (playlistId && window.location.pathname.includes('playlist-detail.html')) {
        console.log('On detail page, skipping main page rendering');
        // This is a detail page - the detail page will handle its own rendering
        return;
    }
    
    // This is the main page - render playlists
    console.log('On main page, rendering playlists');
    renderPlaylists();
});

// Export functions for use in detail page
window.EGGSRadio = {
    playlists,
    getPlaylistById,
    formatDuration
};
