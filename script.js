// script.js

async function query(data) {
	const response = await fetch(
		"https://xdwvg9no7pefghrn.us-east-1.aws.endpoints.huggingface.cloud",
		{
			headers: { 
				"Accept": "image/png",
				"Authorization": "Bearer VknySbLLTUjbxXAXCjyfaFIPwUTCeRXbFSOjwRiCxsxFyhbnGjSFalPKrpvvDAaPVzWEevPljilLVDBiTzfIbWFdxOkYJxnOPoHhkkVGzAknaOulWggusSFewzpqsNWM", 
				"Content-Type": "application/json" 
			},
			method: "POST",
			body: JSON.stringify(data),
		}
	);
	const result = await response.blob();
	return result;
}
// query({"inputs": "Astronaut riding a horse"}).then((response) => {
// 	// Use image
// });

const generateComic = async (panelTexts) => {
    const comicContainer = document.getElementById('comic-container');
    comicContainer.innerHTML = ''; // Clear existing comic
  
    const imageElements = [];
  
    for (const panelText of panelTexts) {
      try {
        const imageURL = await query({ inputs: panelText });
        console.log('Image URL:', imageURL); // Log the image URL
        const imageElement = document.createElement('img');
        imageElement.src = URL.createObjectURL(imageURL);
        imageElement.alt = panelText;
              // Create a container for the image with a caption
        const panelContainer = document.createElement('div');
        panelContainer.className = 'panel-container';

        // Create a caption for the panel
        const captionElement = document.createElement('p');
        captionElement.textContent = panelText;

        // Append the image and caption to the container
        panelContainer.appendChild(imageElement);
        panelContainer.appendChild(captionElement);

        // Append the panel container to the comic container
        comicContainer.appendChild(panelContainer);
      } catch (error) {
        console.error('Error generating image:', error); // Log any errors
        const errorMessage = `Failed to generate image for panel: ${panelText}`;
        const errorElement = document.createElement('p');
        errorElement.className = 'error-message';
        errorElement.textContent = errorMessage;
          // Append the error message to the comic container
        comicContainer.appendChild(errorElement);
      }
    }
  
    // for (const imageElement of imageElements) {
    //   comicContainer.appendChild(imageElement);
    // }
  };
  

const comicForm = document.getElementById('comic-form');

comicForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const panelTexts = [];
  for (let i = 1; i <= 10; i++) {
    const panelText = document.getElementById(`panel${i}`).value;
    panelTexts.push(panelText);
  }

  console.log('Panel Texts:', panelTexts); // Log the panel texts
  await generateComic(panelTexts); // Wait for images to be generated
  comicForm.reset();
});

const feedbackForm = document.getElementById('feedback-form');
const feedbackFormXML = document.createElement('feedback');

feedbackForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const feedback = document.getElementById('feedback').value;

  const feedbackEntryXML = document.createElement('feedbackEntry');
  const nameXML = document.createElement('name');
  nameXML.textContent = name;
  const emailXML = document.createElement('email');
  emailXML.textContent = email;
  const feedbackTextXML = document.createElement('feedbackText');
  feedbackTextXML.textContent = feedback;

  feedbackEntryXML.appendChild(nameXML);
  feedbackEntryXML.appendChild(emailXML);
  feedbackEntryXML.appendChild(feedbackTextXML);

  feedbackFormXML.appendChild(feedbackEntryXML);

  const xmlSerializer = new XMLSerializer();
  const feedbackXMLString = xmlSerializer.serializeToString(feedbackFormXML);

  localStorage.setItem('feedback', feedbackXMLString);

  alert('Thank You for your Valuable Feedback.');
  feedbackForm.reset();
});

const feedbackXMLString = localStorage.getItem('feedback');
if (feedbackXMLString) {
  const parser = new DOMParser();
  const feedbackFormXML = parser.parseFromString(feedbackXMLString, 'application/xml');
  const feedbackEntries = feedbackFormXML.getElementsByTagName('feedbackEntry');

  for (const feedbackEntry of feedbackEntries) {
    const name = feedbackEntry.getElementsByTagName('name')[0].textContent;
    const email = feedbackEntry.getElementsByTagName('email')[0].textContent;
    const feedbackText = feedbackEntry.getElementsByTagName('feedbackText')[0].textContent;

    console.log('Feedback:', name, email, feedbackText);
  }
} else {
  console.log('No feedback stored.');
}




