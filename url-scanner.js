// url-scanner.js
const apiKey = 'AIzaSyBdlafbfhQJf1NAC9F3BXpsHqjTrIMY8lA'; // Replace with your real WebRisk API key

async function scanWithWebRisk(userURL) {
  const baseURL = 'https://webrisk.googleapis.com/v1/uris:search';
  
  // 👇 Threat types listed properly, repeated
  const threatTypes = [
    'MALWARE',
    'SOCIAL_ENGINEERING',
    'UNWANTED_SOFTWARE'
  ]
    .map(type => `threatTypes=${type}`)
    .join('&'); 

  const fullWebRiskURL = `${baseURL}?${threatTypes}&uri=${encodeURIComponent(userURL)}&key=${apiKey}`;
  const requestURL = `https://corsproxy.io/?${fullWebRiskURL}`;

  const resultDiv = document.getElementById('scanResult');
  resultDiv.style.display = 'block';
  resultDiv.innerHTML = `
    <div class="spinner-border text-info" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
    <p>Scanning... Please wait ⏳</p>
  `;

  try {
    const response = await fetch(requestURL);
    const data = await response.json();

    if (data.threat) {
      resultDiv.innerHTML = `
        <h3 style="color: red;">🚨 Dangerous URL Detected</h3>
        <p><strong>Threat Type(s):</strong> ${data.threat.threatTypes.join(', ')}</p>
      `;
    } else {
      resultDiv.innerHTML = `
        <h3 style="color: green;">✅ This URL is Safe!</h3>
        <p><strong>No threats found.</strong></p>
      `;

      // 🚀 Now that it's safe, fetch website details
      fetchMoreWebsiteInfo(userURL);
    }
  } catch (error) {
    console.error('Error during WebRisk lookup:', error);
    resultDiv.innerHTML = `<p style="color: red;">Error scanning URL. Try again later.</p>`;
  }
}

async function fetchMoreWebsiteInfo(userURL) {
  const domainName = new URL(userURL).hostname;
  const geoApiKey = 'at_IYWfmstTfSlpeMm69M90WEsknKUjk'; // Your GeoIP API key

  const resultDiv = document.getElementById('scanResult');

  try {
    // 1. Find IP using DNS Google
    const dnsURL = `https://dns.google/resolve?name=${domainName}&type=A`;
    const dnsResponse = await fetch(`https://corsproxy.io/?${dnsURL}`);
    const dnsData = await dnsResponse.json();

    const ipAddress = dnsData?.Answer?.[0]?.data;

    if (!ipAddress) {
      throw new Error('Could not find IP address.');
    }

    // 2. Get location info using IP
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

    resultDiv.innerHTML += extraInfo;
  } catch (error) {
    console.error('Error fetching extra website info:', error);
    resultDiv.innerHTML += `
      <hr>
      <h4>🌐 Website Details:</h4>
      <p><strong>Domain:</strong> ${domainName}</p>
      <p style="color: red;">(Could not fetch IP/Location details.)</p>
    `;
  }
}

  document.getElementById('urlForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const userURL = document.getElementById('urlInput').value.trim();
    scanWithWebRisk(userURL);
  });
