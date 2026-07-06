const https = require('https');
const fs = require('fs');
const path = require('path');

const PLACE_ID = 'ChIJrQD5yz8aDzkRQ5_yKxotQHQ';
const API_KEY = process.env.GOOGLE_PLACES_API_KEY || 'YOUR_API_KEY_HERE';
const OUTPUT_FILE = path.join(__dirname, 'reviews.json');

function fetchReviews() {
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${PLACE_ID}&fields=name,rating,user_ratings_total,reviews&key=${API_KEY}`;

  https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
      try {
        const json = JSON.parse(data);
        if (json.status !== 'OK') {
          console.error(`API Error: ${json.status} - ${json.error_message || 'Unknown error'}`);
          process.exit(1);
        }

        const result = json.result;
        const output = {
          lastUpdated: new Date().toISOString(),
          overall: {
            rating: result.rating,
            totalReviews: result.user_ratings_total,
            name: result.name
          },
          reviews: (result.reviews || [])
            .sort((a, b) => b.time - a.time)
            .slice(0, 10)
            .map(r => ({
              author: r.author_name,
              rating: r.rating,
              text: r.text,
              time: r.time,
              relativeTime: r.relative_time_description,
              profilePhoto: r.profile_photo_url
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
