function openProject(projectId) {
    const projectWindow = document.getElementById(projectId);
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const projectWindowWidth = projectWindow.clientWidth;
    const projectWindowHeight = projectWindow.clientHeight;

    const maxX = windowWidth - projectWindowWidth;
    const maxY = windowHeight - projectWindowHeight - 100;

    const randomX = Math.max(0, Math.floor(Math.random() * maxX));
    const randomY = Math.max(0, Math.floor(Math.random() * maxY));

    projectWindow.style.display = "block";
    projectWindow.style.left = `${randomX}px`;
    projectWindow.style.top = `${randomY}px`;

    dragElement(projectWindow);
}

function closeProject(projectId) {
    document.getElementById(projectId).style.display = "none";
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

function showSkillDescription(skill) {
    const description = skill.getAttribute('data-description');
    let descriptionWindow = skill.querySelector('.skill-description-window');
    
    if (!descriptionWindow) {
        descriptionWindow = document.createElement('div');
        descriptionWindow.classList.add('skill-description-window');
        skill.appendChild(descriptionWindow);
    }

    descriptionWindow.textContent = description;
    descriptionWindow.style.display = 'block';
}

function hideSkillDescription(skill) {
    const descriptionWindow = skill.querySelector('.skill-description-window');
    if (descriptionWindow) {
        descriptionWindow.style.display = 'none';
    }
}
