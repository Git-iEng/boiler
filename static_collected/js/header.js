/*=============== SHOW MENU ===============*/
const showMenu = (toggleId, navId) =>{
   const toggle = document.getElementById(toggleId),
         nav = document.getElementById(navId)

   toggle.addEventListener('click', () =>{
       // Add show-menu class to nav menu
       nav.classList.toggle('show-menu')

       // Add show-icon to show and hide the menu icon
       toggle.classList.toggle('show-icon')
   })
}

document.addEventListener("DOMContentLoaded", () => {
    const solutionToggle = document.querySelector('.dropdown-toggle-solutions');
    const solutionItem = solutionToggle.closest('.dropdown__item');

    solutionToggle.addEventListener('click', (e) => {
        e.preventDefault();
        solutionItem.classList.toggle('active');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function(event) {
        if (!solutionItem.contains(event.target)) {
            solutionItem.classList.remove('active');
        }
    });
});

showMenu('nav-toggle','nav-menu')