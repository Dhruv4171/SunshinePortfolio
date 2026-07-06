const https = require('https');
const fs = require('fs');
const path = require('path');

const API_KEY = process.env.OUTSCRAPER_API_KEY || 'YOUR_API_KEY_HERE';
const OUTPUT_FILE = path.join(__dirname, 'reviews.json');
const BUSINESS_URL = 'https://www.google.com/maps/place/Sunshine+Motor+Driving+School/@26.8461048,75.8057636,17z';

function fetchReviews() {
  const url = `https://api.app.outscraper.com/maps/reviews-v3?url=${encodeURIComponent(BUSINESS_URL)}&async=false&language=en`;

  const options = {
    headers: { 'X-API-KEY': API_KEY }
  };

  https.get(url, options, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
      try {
        const json = JSON.parse(data);
        if (json.status !== 'SUCCESS' || !json.data) {
          console.error(`API Error: ${json.status || json.message || 'Unknown error'}`);
          process.exit(1);
        }

        const reviews = json.data[0]?.reviews || [];
        const output = {
          lastUpdated: new Date().toISOString(),
          overall: {
            rating: json.data[0]?.rating || 4.7,
            totalReviews: json.data[0]?.total_reviews || json.data[0]?.reviews_number || 350,
            name: 'Sunshine Motor Driving School'
          },
          reviews: reviews.slice(0, 10).map(r => ({
            author: r.author || r.user_name || 'Anonymous',
            rating: r.rating || 5,
            text: r.review_text || r.text || '',
            time: r.review_datetime || r.time || '',
            relativeTime: r.review_datetime ? new Date(r.review_datetime).toLocaleDateString('en-IN', { year: 'numeric', month: 'short' }) : 'Google Review',
            profilePhoto: r.author_image || r.profile_photo || ''
          }))
        };

        fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));
        console.log(`Reviews updated: ${output.overall.totalReviews} total reviews, ${output.reviews.length} fetched`);
      } catch (e) {
        console.error('Parse error:', e.message);
        process.exit(1);
      }
    });
  }).on('error', (e) => {
    console.error('Network error:', e.message);
    process.exit(1);
  });
}

fetchReviews();
