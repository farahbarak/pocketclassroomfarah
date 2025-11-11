let views, navLinks, btnNew;

function showView(viewName) {
  Object.values(views).forEach(v => v.classList.add("d-none"));
  views[viewName].classList.remove("d-none");

  navLinks.forEach(link => link.classList.remove("active"));
  const activeLink = [...navLinks].find(link => link.textContent.trim().toLowerCase() === viewName);
  if (activeLink) activeLink.classList.add("active");
}

document.addEventListener("DOMContentLoaded", function() {
    views = {
      library: document.getElementById("libraryView"),
      author: document.getElementById("authorView"),
      learn: document.getElementById("learnView")
    };

    navLinks = document.querySelectorAll(".navbar-nav .nav-link");
    btnNew = document.getElementById("btnNew");

   navLinks.forEach(link => {
  link.addEventListener("click", function(e) {
    e.preventDefault();
    const viewName = this.textContent.trim().toLowerCase();

    if (viewName === "learn") {
      if (capsules.length > 0) {
        openLearn(0);
      } else {
        const learnContainer = document.getElementById("learnView");
        learnContainer.innerHTML = "<p class='text-center text-muted mt-4'>No capsules available.</p>";
      }
    }

    showView(viewName);
  });
});
    btnNew.addEventListener("click", function() {
      showView("author");
    });
      loadFromLocalStorage();
});

const themeToggle = document.getElementById('themeToggle');
 

const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
  document.body.classList.add('dark-mode');
  themeToggle.innerHTML = '<i class="bi bi-moon"></i>';
} else {
  document.body.classList.remove('dark-mode');
  themeToggle.innerHTML = '<i class="bi bi-sun"></i>';
}

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');

  if (document.body.classList.contains('dark-mode')) {
    themeToggle.innerHTML = '<i class="bi bi-moon"></i>';
    localStorage.setItem('theme', 'dark'); 
  } else {
    themeToggle.innerHTML = '<i class="bi bi-sun"></i>';
    localStorage.setItem('theme', 'light'); 
  }
});





