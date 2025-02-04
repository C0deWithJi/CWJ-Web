// Portfolio Card Interactions
document.querySelectorAll('.portfolio-card').forEach(card => {
  const expandButton = card.querySelector('.expand-button');
  const closeButton = card.querySelector('.close-button');
  const backCard = card.querySelector('.card-back');

  // Expand on click (FIXED)
  expandButton.addEventListener('click', (e) => {
    e.stopPropagation();
    backCard.classList.replace('invisible', 'visible'); // Toggle visibility
    backCard.classList.replace('opacity-0', 'opacity-100'); // Toggle opacity
    card.classList.add('z-10');
  });

  // Close on button click (FIXED)
  closeButton.addEventListener('click', () => {
    backCard.classList.replace('visible', 'invisible');
    backCard.classList.replace('opacity-100', 'opacity-0');
    card.classList.remove('z-10');
  });

  // Close when clicking outside (FIXED)
  document.addEventListener('click', (e) => {
    if (!card.contains(e.target)) {
      backCard.classList.replace('visible', 'invisible');
      backCard.classList.replace('opacity-100', 'opacity-0');
      card.classList.remove('z-10');
    }
  });
});

// Keyboard Accessibility (FIXED)
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.card-back').forEach(back => {
      back.classList.replace('visible', 'invisible');
      back.classList.replace('opacity-100', 'opacity-0');
      back.closest('.portfolio-card').classList.remove('z-10');
    });
  }
});