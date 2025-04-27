// url-scanner.js

const apiKey = 'AIzaSyBdlafbfhQJf1NAC9F3BXpsHqjTrIMY8lA'; // Your WebRisk API key

async function scanWithWebRisk(userURL) {
  const baseURL = 'https://webrisk.googleapis.com/v1/uris:search';

  const threatTypes = [
    'MALWARE',
    'SOCIAL_ENGINEERING',
    'UNWANTED_SOFTWARE'
  ].map(type => `threatTypes=${type}`).join('&');

  const fullWebRiskURL = `${baseURL}?${threatTypes}&uri=${encodeURIComponent(userURL)}&key=${apiKey}`;
  const requestURL = `https://corsproxy.io/?${fullWebRiskURL}`;

  const resultDiv = document.getElementById('scanResult');
  resultDiv.style.display = 'block';

  // Show loading spinner
  resultDiv.innerHTML = `
    <div class="spinner-border text-info" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
    <p>Scanning... Please wait ⏳</p>
  `;

  try {
    const response = await fetch(requestURL);
    const data = await response.json();

    const detectedThreats = data.threat?.threatTypes || [];

    let resultHtml = '';

    if (data.threat) {
      resultHtml = `
        <h3 style="color: red;">🚨 Dangerous URL Detected</h3>
        <p><strong>Threat Type(s):</strong> ${detectedThreats.join(', ')}</p>
      `;
    } else {
      resultHtml = `
        <h3 style="color: green;">✅ This URL is Safe!</h3>
        <p><strong>No threats found.</strong></p>
      `;
      fetchMoreWebsiteInfo(userURL); // Fetch extra details if safe
    }

    // Insert resultHtml INSIDE the resultDiv, keeping the centered box
    resultDiv.innerHTML = resultHtml;

  } catch (error) {
    console.error('Error during WebRisk lookup:', error);
    resultDiv.innerHTML = `<p style="color: red;">Error scanning URL. Please try again later.</p>`;
  }
}

// Fetch IP / Location Info
async function fetchMoreWebsiteInfo(userURL) {
  const domainName = new URL(userURL).hostname;
  const geoApiKey = 'at_IYWfmstTfSlpeMm69M90WEsknKUjk'; // Your GeoIPify key

  const resultDiv = document.getElementById('scanResult');

  try {
    const dnsURL = `https://dns.google/resolve?name=${domainName}&type=A`;
    const dnsResponse = await fetch(`https://corsproxy.io/?${dnsURL}`);
    const dnsData = await dnsResponse.json();

    const ipAddress = dnsData?.Answer?.[0]?.data;

    if (!ipAddress) {
      throw new Error('Could not find IP address.');
    }

    const geoLookupURL = `https://corsproxy.io/?https://geo.ipify.org/api/v2/country,city?apiKey=${geoApiKey}&ipAddress=${ipAddress}`;
    const geoResponse = await fetch(geoLookupURL);
    const geoData = await geoResponse.json();

    const extraInfo = `
      <hr>
      <h4>🌐 Website Details:</h4>
      <p><strong>Domain:</strong> ${domainName}</p>
      <p><strong>IP Address:</strong> ${ipAddress}</p>
      <p><strong>Country:</strong> ${geoData.location?.country || 'Unknown'}</p>
      <p><strong>City:</strong> ${geoData.location?.city || 'Unknown'}</p>
      <p><strong>ISP / Hosting:</strong> ${geoData.isp || 'Unknown'}</p>
    `;

    // Append extra info below the scan result
    resultDiv.innerHTML += extraInfo;

  } catch (error) {
    console.error('Error fetching website info:', error);
    resultDiv.innerHTML += `
      <hr>
      <h4>🌐 Website Details:</h4>
      <p><strong>Domain:</strong> ${domainName}</p>
      <p style="color: red;">(Could not fetch IP/Location details.)</p>
    `;
  }
}

// Handle form submission
const urlForm = document.getElementById('urlForm');
const scanButton = document.getElementById('scanButton');

urlForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const userURL = document.getElementById('urlInput').value.trim();
  if (userURL) scanWithWebRisk(userURL);
});

scanButton.addEventListener('click', (e) => {
  e.preventDefault();
  const userURL = document.getElementById('urlInput').value.trim();
  if (userURL) scanWithWebRisk(userURL);
});