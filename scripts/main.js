let highestZIndex = 1000;

function openProject(projectId, projectElement) {
    const projectWindow = document.getElementById(projectId);
    const icon = projectElement.querySelector('i');

    // Change the icon to open folder
    icon.classList.remove('fa-folder');
    icon.classList.add('fa-folder-open');

    // Increase the z-index to bring the window to the front
    projectWindow.style.zIndex = ++highestZIndex;

    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const projectWindowWidth = projectWindow.clientWidth;
    const projectWindowHeight = projectWindow.clientHeight;

    if (windowWidth <= 768) {
        // Position the description window below and aligned to the left of the project folder on mobile
        projectWindow.style.display = "block";
        const rect = projectElement.getBoundingClientRect();
        projectWindow.style.top = `${rect.bottom + window.scrollY}px`;
        projectWindow.style.left = `0px`; // Align it to the left of the viewport
        // projectWindow.style.width = `100%`; // Full width of the viewport

        const newMarginBottom = projectWindowHeight + 40; // Calculate needed margin-bottom
        document.body.style.marginBottom = `${newMarginBottom}px`;

    } else {

        const maxX = windowWidth - projectWindowWidth - 1200;
        const maxY = windowHeight - projectWindowHeight - 600;

        const randomX = Math.max(0, Math.floor(Math.random() * maxX));
        const randomY = Math.max(0, Math.floor(Math.random() * maxY));

        projectWindow.style.display = "block";
        projectWindow.style.left = `${randomX}px`;
        projectWindow.style.top = `${randomY}px`;

        dragElement(projectWindow);
    }

    setTimeout(() => {
        projectWindow.classList.add('show'); // Add show class for animation
        projectWindow.style.visibility = "visible"; // Make it visible
    }, 10); // Delay slightly to allow render
}

function closeProject(projectId) {
    const projectWindow = document.getElementById(projectId);
    const projectElement = document.querySelector(`[onclick*="${projectId}"]`);
    const icon = projectElement.querySelector('i');

    // Change the icon back to closed folder
    icon.classList.remove('fa-folder-open');
    icon.classList.add('fa-folder');

    projectWindow.classList.remove('show'); // Remove show class to hide with animation

    setTimeout(() => {
        projectWindow.style.display = 'none'; // Hide after animation completes
    }, 300); // Match the timeout with the transition duration
}

function dragElement(element) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    let isDragging = false;
    const header = element.querySelector(".window-header");

    if (header) {
        header.onmousedown = dragMouseDown;
        header.ontouchstart = dragTouchStart;
    }

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        isDragging = true;
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;

        // Bring the dragged element to the top
        element.style.zIndex = ++highestZIndex;
    }

    function dragTouchStart(e) {
        e = e || window.event;
        e.preventDefault();
        isDragging = true;
        const touch = e.touches[0];
        pos3 = touch.clientX;
        pos4 = touch.clientY;
        document.ontouchend = closeDragElement;
        document.ontouchmove = elementDragTouch;

        // Bring the dragged element to the top
        element.style.zIndex = ++highestZIndex;
    }

    function elementDrag(e) {
        if (!isDragging) return;
        e = e || window.event;
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        element.style.top = (element.offsetTop - pos2) + "px";
        element.style.left = (element.offsetLeft - pos1) + "px";
    }

    function elementDragTouch(e) {
        if (!isDragging) return;
        e = e || window.event;
        e.preventDefault();
        const touch = e.touches[0];
        pos1 = pos3 - touch.clientX;
        pos2 = pos4 - touch.clientY;
        pos3 = touch.clientX;
        pos4 = touch.clientY;
        element.style.top = (element.offsetTop - pos2) + "px";
        element.style.left = (element.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        isDragging = false;
        document.onmouseup = null;
        document.onmousemove = null;
        document.ontouchend = null;
        document.ontouchmove = null;
    }
}

// Ensure the close button does not interfere with touch events
document.querySelectorAll('.window-controls button').forEach(button => {
    button.addEventListener('touchstart', function(e) {
        e.stopPropagation(); // Prevent touch event from propagating to the drag handlers
    });
    button.addEventListener('touchend', function(e) {
        e.stopPropagation(); // Prevent touch event from propagating to the drag handlers
    });
});

// Handle skill hover for detailed descriptions
const skills = document.querySelectorAll('.skill');

skills.forEach(skill => {
    skill.addEventListener('mouseenter', () => {
        showSkillDescription(skill);
    });
    skill.addEventListener('mouseleave', () => {
        hideSkillDescription(skill);
    });
    skill.addEventListener('touchstart', () => {
        showSkillDescription(skill);
    });
    skill.addEventListener('touchend', () => {
        hideSkillDescription(skill);
    });
});


function toggleSkillDescription(skill) {
    const windowWidth = window.innerWidth;

    if (windowWidth <= 768) {
        showSkillDescription(skill);
    } else {
        const skillType = skill.classList.contains('soft-skill') ? 'soft-skill' : 'hard-skill';
        const descriptionWindow = skill.querySelector(`.${skillType}-description-window`);

        if (descriptionWindow.style.display === 'block') {
            descriptionWindow.style.display = 'none';
        } else {
            descriptionWindow.style.display = 'block';
            // Hide other descriptions when one is shown
            document.addEventListener('touchstart', function(event) {
                if (!skill.contains(event.target)) {
                    descriptionWindow.style.display = 'none';
                }
            }, { once: true });
        }
    }
}

// Add event listeners for mouse hover
document.querySelectorAll('.skill').forEach(skill => {
    const windowWidth = window.innerWidth;

    if (windowWidth > 768) {
        skill.addEventListener('mouseenter', () => showSkillDescription(skill));
        skill.addEventListener('mouseleave', () => hideSkillDescription(skill));
    } else {
        skill.addEventListener('touchstart', (event) => {
            event.stopPropagation();
            toggleSkillDescription(skill);
        });
    }
});

function showSkillDescription(skill) {
    const description = skill.getAttribute('data-description');
    const skillType = skill.classList.contains('soft-skill') ? 'soft-skill' : 'hard-skill';
    const windowWidth = window.innerWidth;

    if (windowWidth <= 768) {
        let descriptionWindow = document.querySelector('.mobile-skill-description');

        if (!descriptionWindow) {
            descriptionWindow = document.createElement('div');
            descriptionWindow.classList.add('mobile-skill-description');
            document.body.appendChild(descriptionWindow);
        }

        descriptionWindow.textContent = description;
        descriptionWindow.style.display = 'block';

        document.addEventListener('touchstart', function(event) {
            if (!skill.contains(event.target) && !descriptionWindow.contains(event.target)) {
                descriptionWindow.style.display = 'none';
            }
        }, { once: true });
    } else {
        let descriptionWindow = skill.querySelector(`.${skillType}-description-window`);

        if (!descriptionWindow) {
            descriptionWindow = document.createElement('div');
            descriptionWindow.classList.add('skill-description-window');
            skill.appendChild(descriptionWindow);
        }

        descriptionWindow.textContent = description;
        descriptionWindow.style.display = 'block';
    }
}

function hideSkillDescription(skill) {

    const skillType = skill.classList.contains('soft-skill') ? 'soft-skill' : 'hard-skill'; 
    const descriptionWindow = skill.querySelector(`.${skillType}-description-window`);

    if (descriptionWindow) {
        descriptionWindow.style.display = 'none';
    }
}

function toggleContactWindow() {
    const contactWindow = document.getElementById('contact-window');
    setTimeout(() => {
        contactWindow.classList.toggle('show');
    }, 10); // Delay slightly to allow render
}

