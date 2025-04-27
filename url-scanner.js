document.getElementById('checkButton').addEventListener('click', function() {
    const urlInput = document.getElementById('urlInput').value;
    const resultMessage = document.getElementById('resultMessage');
  
    // Clear the result message
    resultMessage.textContent = '';
  
    // Check if the URL is empty
    if (urlInput.trim() === '') {
      resultMessage.textContent = 'Please enter a URL.';
      return;
    }
  
    // Regular expression to check if the URL is in a valid format
    const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
  
    if (urlPattern.test(urlInput)) {
      resultMessage.textContent = 'This URL looks correct!';
      resultMessage.style.color = 'green';
    } else {
      resultMessage.textContent = 'This URL seems incorrect or malformed!';
      resultMessage.style.color = 'red';
    }
  });
  