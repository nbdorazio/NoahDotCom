// This file contains the JavaScript code for the webpage. 

document.addEventListener('DOMContentLoaded', function() {
    const greeting = document.createElement('h1');
    greeting.textContent = 'Welcome to My Basic Webpage!';
    document.body.appendChild(greeting);

    const button = document.createElement('button');
    button.textContent = 'Click Me!';
    document.body.appendChild(button);

    button.addEventListener('click', function() {
        alert('Button was clicked!');
    });
});