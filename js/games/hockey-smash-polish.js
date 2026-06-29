(function () {
  const params = new URLSearchParams(window.location.search);
  const computerMode = params.get('computerMode') === '1';

  function onReady() {
    document.body.classList.toggle('hockey-computer-mode', computerMode);

    const api = window.RTA_HOCKEY_SMASH;
    const game = document.getElementById('hockey-game');
    if (!api || !game) return;

    const finish = document.createElement('section');
    finish.id = 'hockey-finish';
    finish.className = 'hockey-finish';
    finish.hidden = true;
    finish.setAttribute('aria-live', 'assertive');

    const card = document.createElement('div');
    card.className = 'hockey-finish__card';

    const eyebrow = document.createElement('p');
    eyebrow.className = 'hockey-eyebrow';
    eyebrow.textContent = 'Victory';

    const heading = document.createElement('h2');
    heading.textContent = 'You won!';

    const copy = document.createElement('p');
    copy.textContent = 'Daniel survived the salmon run, cleared the sidewalk, and finished the final challenge.';

    const button = document.createElement('button');
    button.className = 'hockey-button hockey-button--primary';
    button.type = 'button';
    button.textContent = 'Play Again';

    card.append(eyebrow, heading, copy, button);
    finish.append(card);
    game.append(finish);

    let finishShown = false;

    button.addEventListener('click', () => {
      finishShown = false;
      finish.hidden = true;
      const retry = document.getElementById('hockey-retry');
      if (retry) retry.click();
    });

    function watchFinish() {
      const state = api.getState?.();
      if (!computerMode && !finishShown && state?.dad && state.dad.hp <= 0) {
        finishShown = true;
        finish.hidden = false;
        const status = document.getElementById('hockey-status');
        if (status) status.textContent = 'Victory! Final challenge cleared.';
      }
      window.requestAnimationFrame(watchFinish);
    }

    watchFinish();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onReady);
  } else {
    onReady();
  }
})();
