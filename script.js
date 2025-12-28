const games = [
    { id: 1, name: "Adopt Me!", img: "https://tr.rbxcdn.com/180DAY-51a29251f9146921c58a9b7662ce356a/768/432/Image/Webp/noFilter" },
    { id: 2, name: "Brookhaven", img: "https://tr.rbxcdn.com/180DAY-4baee83ef1f528a95c7ae657dca03b46/768/432/Image/Webp/noFilter" },
    { id: 3, name: "Tower of Hell", img: "https://tr.rbxcdn.com/180DAY-20a372111085c33de1e64004e4dca1d8/768/432/Image/Webp/noFilter" },
];

const gallery = document.getElementById('gallery');
const modal = document.getElementById('surveyModal');
const closeModal = document.getElementById('closeModal');
const gameTitle = document.getElementById('gameTitle');
const surveyForm = document.getElementById('surveyForm');
const thankyou = document.getElementById('thankyou');
const creditCounter = document.getElementById('creditCounter');

let currentGameId = null;

// Load credits & completed surveys
let userCredits = parseInt(localStorage.getItem('credits')) || 0;
let completedSurveys = JSON.parse(localStorage.getItem('completedSurveys')) || [];
creditCounter.textContent = `Credits: ${userCredits}`;

// Create gallery
function renderGallery() {
    gallery.innerHTML = '';
    games.forEach(game => {
        if(completedSurveys.includes(game.id)) return; // skip completed
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `<img src="${game.img}" alt="${game.name}"><h3>${game.name}</h3>`;
        card.addEventListener('click', () => openSurvey(game));
        gallery.appendChild(card);
    });
}
renderGallery();

function openSurvey(game) {
    currentGameId = game.id;
    gameTitle.textContent = game.name;
    modal.classList.remove('hidden');
    setTimeout(()=>modal.classList.add('show'),10);
}

// Close modal
closeModal.addEventListener('click', closeModalFunc);
function closeModalFunc() {
    modal.classList.remove('show');
    setTimeout(()=>{ modal.classList.add('hidden'); surveyForm.reset(); thankyou.classList.add('hidden'); },300);
}

// Rating slider live update
const ratingSlider = document.getElementById('gameRating');
const ratingValue = document.getElementById('ratingValue');
ratingSlider.addEventListener('input', ()=> ratingValue.textContent = ratingSlider.value);

// Submit survey
surveyForm.addEventListener('submit', e=>{
    e.preventDefault();
    const surveyData = {
        gameId: currentGameId,
        playerName: document.getElementById('playerName').value,
        rating: ratingSlider.value,
        likes: document.getElementById('gameLikes').value,
        improvements: document.getElementById('gameImprovements').value,
        features: Array.from(document.getElementById('gameFeatures').selectedOptions).map(o=>o.value),
        creditEarned: 1
    };

    console.log("Survey submitted:", surveyData);

    // Add credit & mark survey completed
    userCredits += 1;
    completedSurveys.push(currentGameId);
    localStorage.setItem('credits', userCredits);
    localStorage.setItem('completedSurveys', JSON.stringify(completedSurveys));
    creditCounter.textContent = `Credits: ${userCredits}`;

    // Show thank you
    thankyou.style.opacity = 0; thankyou.classList.remove('hidden');
    setTimeout(()=>{ thankyou.style.opacity=1; },10);
    setTimeout(()=>{ thankyou.style.opacity=0; setTimeout(()=>{ thankyou.classList.add('hidden'); closeModalFunc(); renderGallery(); },500); },2000);

    surveyForm.reset();
});
