// Function to show loader
function showLoader() {
  // Create a loader element
  const loader = document.createElement('div');
  loader.classList.add('loader');

  // Add the loader to the box element
  const box = document.querySelector('.box');
  box.appendChild(loader);
}

// Function to hide loader
function hideLoader() {
  // Remove the loader element
  const loader = document.querySelector('.loader');
  if (loader) {
    loader.remove();
  }
}

// Function to retrieve cookie value by name
function getCookieValue(name) {
  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.startsWith(name + '=')) {
      return cookie.substring(name.length + 1);
    }
  }
  return null; // Return null if cookie not found
}

//const jwtToken = getCookieValue('token');

const jwtToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOnsidXNlcl9mbmFtZSI6InN0cmluZ3kiLCJ1c2VyX2VtYWlsIjoiZWcuZGlnaXRhbDExQGdtYWlsLmNvbSJ9fQ.3hFgtrEfSlROSuqWsXmtd0hmZKHZEmwfZPCUSKVdBw0'

const test_id = 85;
const combinations = [];
let currentCombinationIndex = 0;

const requestOptions = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    token: `${jwtToken}`,
  },
  body: JSON.stringify({ /* payload data */ }),
};

function getbackground(name) {
  fetch(`http://45.80.152.97:8888/background/image${name.backgroundUrl}`, {
    headers: {
      token: `${jwtToken}`,
    },
  })
    .then(response => response.json())
    .then(data => {
      const base64Image = data.base64_content;
      const box = document.querySelector('.box');
      box.style.backgroundImage = `url(data:image/jpeg;base64,${base64Image})`;
      
    })
    
  }


  function getcamo(name) {
    const box = document.querySelector('.box');
  
    // Remove previous camo circle if it exists
    const previousCamoCircle = box.querySelector('.camo-circle');
    if (previousCamoCircle) {
      previousCamoCircle.remove();
    }
  
    fetch(`http://45.80.152.97:8888/camos/image${name.camoUrl}`, {
      headers: {
        token: `${jwtToken}`,
      },
    })
      .then(response => response.json())
      .then(data => {
        const base64Image = data.base64_content;
  
        // Create the camo circle element
        const camoCircle = document.createElement('div');
        camoCircle.classList.add('camo-circle');
  
        // Set the background image
        camoCircle.style.backgroundImage = `url(data:image/jpeg;base64,${base64Image})`;
  
        // Calculate the maximum position values
        const boxWidth = box.offsetWidth;
        const boxHeight = box.offsetHeight;
        const camoCircleSize = 100; // Adjust the size of the camo circle as needed
        const maxLeft = boxWidth - camoCircleSize - 2; // Subtract border width
        const maxTop = boxHeight - camoCircleSize - 2; // Subtract border width
  
        // Generate random positions within the bounds
        const randomX = Math.floor(Math.random() * (maxLeft + 1)); // Add 1 to include max value
        const randomY = Math.floor(Math.random() * (maxTop + 1)); // Add 1 to include max value
  
        // Set the position, ensuring it stays within bounds
        const left = Math.max(randomX, 2); // Minimum left position with border width
        const top = Math.max(randomY, 2); // Minimum top position with border width
        camoCircle.style.left = `${left}px`;
        camoCircle.style.top = `${top}px`;
  
        // Add event listener to the camoCircle element
        camoCircle.addEventListener('click', () => {
          const seconds = parseInt(document.getElementById('seconds').textContent, 10);
          console.log('Seconds:', seconds);
          
          // Stop the timer by clearing the interval
          clearInterval(timerInterval);

          // Increase the size of the camo circle
          camoCircle.style.transform = 'scale(2)';
  
          // Start the bounce animation for 5 seconds
          camoCircle.style.animation = 'bounce 5s';
  
          // Update the border color to thick green
          camoCircle.style.border = '4px solid #00FF00';
          camoCircle.style.boxShadow = '0 0 10px #00FF00';
  
          // Fade away the camo circle after 5 seconds
          setTimeout(() => {
            camoCircle.style.opacity = '0';
          }, 5000);


        });
  
        // Add the camo circle to the box
        box.appendChild(camoCircle);
  
        hideLoader(); // Hide the loader
        clock();
      })
      .catch(error => {
        console.error("Error fetching camo:", error);
      });
  }
  

  
  
  
  
  
  


// Simulate click event on page load
window.addEventListener('load', () => {
  localStorage.clear();
  showLoader()
  // Fetch test_session
  fetch(`http://45.80.152.97:8888/testsession/?test_id=${test_id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      token: jwtToken,
    },
    body: JSON.stringify({ /* payload data */ }),
  })
    .then(response => response.json())
    .then(data => {
      const camos = data.data[0].camos[0];
      console.log(camos)
      const background_urls = camos.background_url.split(", ");
      const camoUrls = camos.camo_url.split(", ");

      background_urls.forEach(background_url => {
        camoUrls.forEach(camoUrl => {
          combinations.push({
            backgroundUrl: background_url,
            camoUrl: camoUrl
          });
        });
      });

      // Save combinations to local storage
      localStorage.setItem('combinations', JSON.stringify(combinations));

      // Check if combinations are stored in local storage
      const storedCombinations = JSON.parse(localStorage.getItem('combinations'));
      getbackground(storedCombinations[currentCombinationIndex]);
      getcamo(storedCombinations[currentCombinationIndex])

      console.log(storedCombinations[currentCombinationIndex])

      // Display current combination index
      
      const paginationCountElement = document.querySelector('.pagination-count');
      updatePaginationCount();

      // Button click event listener
      const nextButton = document.querySelector('.next-button');
      nextButton.addEventListener('click', () => {
        currentCombinationIndex++;
        if (currentCombinationIndex >= storedCombinations.length) {

          window.location.href = 'www.google.com'; // Redirect to the thank you page
          nextButton.textContent = 'Submit';
          return; // Exit the event listener
        }
        if (currentCombinationIndex == storedCombinations.length-1) {
          nextButton.textContent = 'Submit';
        }
        updatePaginationCount();
        showLoader(); // Show the loader
        getbackground(storedCombinations[currentCombinationIndex]);
        getcamo(storedCombinations[currentCombinationIndex])
      });

      function updatePaginationCount() {
        paginationCountElement.textContent = `${currentCombinationIndex + 1} / ${storedCombinations.length}`;
      }
    })
    .catch(error => {
      console.error("Error fetching combinations:", error);
    });

});



let timerInterval; // Variable to store the interval reference

function clock() {
  const secondsElement = document.getElementById("seconds");

  // Set the timer start time (in seconds)
  const startTime = 0;

  // Clear previous interval if it exists
  clearInterval(timerInterval);

  // Initialize the timer
  let time = startTime;

  // Update the timer every second
  timerInterval = setInterval(() => {
    const seconds = time;
    secondsElement.textContent = seconds.toString().padStart(2, "0");

    // Increment the time
    time++;
  }, 1000);
}
