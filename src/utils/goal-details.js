function loadButtonDetails(buttonDatatext) {
    const goalElement = document.getElementById('goal');
    const goBackElement = document.getElementById('goBack');
    const sections = {
        experience: document.getElementById('experience'),
        links: document.getElementById('links'),
        about: document.getElementById('about'),
        skills: document.getElementById('skills'),
        projects: document.getElementById('projects')
    };

    goalElement.style.display = 'flex';
    goBackElement.style.display = 'flex';

    // Hide all sections by setting their display property to 'none'
    Object.values(sections).forEach(section => section.style.display = 'none');

    // Display the specific section
    if (sections[buttonDatatext]) {
        sections[buttonDatatext].style.display = 'flex';
    }
}

export { loadButtonDetails };
