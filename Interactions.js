// Portfolio Card Interactions
document.querySelectorAll('.portfolio-card').forEach(card => {
    const expandButton = card.querySelector('.expand-button');
    const closeButton = card.querySelector('.close-button');
    const backCard = card.querySelector('.card-back');
  
    // Expand on click
    expandButton.addEventListener('click', (e) => {
      e.stopPropagation();
      backCard.classList.replace('invisible', 'visible');
      backCard.classList.replace('opacity-0', 'opacity-100');
      expandButton.setAttribute('aria-expanded', 'true');
      card.classList.add('z-10'); // Ensure expanded card overlaps others
    });
  
    // Close on button click
    closeButton.addEventListener('click', () => {
      backCard.classList.replace('visible', 'invisible');
      backCard.classList.replace('opacity-100', 'opacity-0');
      expandButton.setAttribute('aria-expanded', 'false');
      card.classList.remove('z-10');
    });
  
    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!card.contains(e.target)) {
        backCard.classList.replace('visible', 'invisible');
        backCar.classList.replace('opacity-100', 'opacity-0');
        expandButton.setAttribute('aria-expanded', 'false');
        card.classList.remove('z-10');
      }
    });
  });
  
  // Keyboard Accessibility
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.card-back').forEach(back => {
        back.classList.replace('visible', 'invisible');
        back.classList.replace('opacity-100', 'opacity-0');
        back.closest('.portfolio-card').classList.remove('z-10');
      });
    }
  });