const express = require('express');
const fetch = require('node-fetch');

const app = express();

// Define routes
app.get('/', async (req, res) => {
    try {
        const response = await fetch('https://firestore.googleapis.com/v1/projects/ng-asmco/databases/(default)/documents/media/');
        const data = await response.json();
        
        // Render HTML with fetched data
        let html = '<!DOCTYPE html>';
        html += '<html lang="en">';
        html += '<head>';
        html += '<meta charset="UTF-8">';
        html += '<meta name="viewport" content="width=device-width, initial-scale=1.0">';
        html += '<title>Firebase Firestore Example</title>';
        html += '</head>';
        html += '<body>';
        html += '<div id="data">';
        data.documents.forEach(doc => {
            html += '<div>';
            html += '<p>Card Name: ' + doc.fields.card_name.stringValue + '</p>';
            html += '<a href="/product/' + doc.name.split('/').pop() + '" class="card-link" data-id="' + doc.name.split('/').pop() + '">View Details</a>';
            html += '<img width="100" src="' + doc.fields.media_one_url.stringValue + '" alt="' + doc.fields.media_one_alt.stringValue + '">';
            html += '<img width="100" src="' + doc.fields.media_two_url.stringValue + '" alt="' + doc.fields.media_two_alt.stringValue + '">';
            html += '<img width="100" src="' + doc.fields.media_three_url.stringValue + '" alt="' + doc.fields.media_three_alt.stringValue + '">';
            html += '<img width="100" src="' + doc.fields.media_four_url.stringValue + '" alt="' + doc.fields.media_four_alt.stringValue + '">';
            html += '</div>';
        });
        html += '</div>';
        html += '</body>';
        html += '</html>';

        res.send(html);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Handle product detail pages
app.get('/product/:id', async (req, res) => {
    const productId = req.params.id;
    try {
        // Fetch product details using productId
        const response = await fetch(`https://firestore.googleapis.com/v1/projects/ng-asmco/databases/(default)/documents/media/${productId}`);
        const productData = await response.json();
        
        // Extract relevant product details
        const productName = productData.fields.card_name.stringValue;
        const mediaUrls = [
            productData.fields.media_one_url.stringValue,
            productData.fields.media_two_url.stringValue,
            productData.fields.media_three_url.stringValue,
            productData.fields.media_four_url.stringValue
        ];

        // Render the product detail page with fetched data
        let html = `<!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>${productName}</title>
                    </head>
                    <body>
                        <div>
                            <h1>${productName}</h1>`; // Adding the product description dynamically
        mediaUrls.forEach(url => {
            html += `<img width="150" src="${url}" alt="Product Image">`;
        });
        html += `       </div>
                    </body>
                    </html>`;

        res.send(html);
    } catch (error) {
        console.error('Error fetching product data:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Ensure the server is listening on the correct port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
