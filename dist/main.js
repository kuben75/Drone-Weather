"use strict";
class Main {
    constructor() {
        this.changeMenu = (navMenuToggle) => {
            const navMenu = document.querySelector('ul');
            const navMenuItems = document.querySelectorAll('li');
            navMenuToggle.classList.toggle('closeMenu');
            navMenu.classList.toggle('showMenu');
            navMenuItems.forEach(element => element.classList.toggle('showMenu'));
        };
        this.toggleTemperatureUnit = () => {
            const temperatureElement = document.querySelector(".main-content__temperature");
            const temperatureSlider = document.querySelector(".temp-switch__slider");
            temperatureSlider.classList.toggle("toright");
            temperatureElement.textContent = temperatureSlider.classList.contains("toright") ? `${temperatureElement.fahrenheit} ℉` : `${temperatureElement.celsious}`;
        };
        this.animateContent = () => {
            const tableListElements = document.querySelectorAll('.table__list li');
            const observer = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                        tableListElements.forEach((element, index) => {
                            if (index > 0) {
                                setTimeout(() => element.classList.add('visible'), index * 400);
                            }
                        });
                    }
                });
            });
            observer.observe(tableListElements[0]);
        };
        this.appInit();
    }
    appInit() {
        const navMenuToggle = document.querySelector('.nav__menu-toggle');
        navMenuToggle.addEventListener('click', () => this.changeMenu(navMenuToggle));
        document.querySelector("#temp-toggle").addEventListener("change", this.toggleTemperatureUnit);
        this.animateContent();
    }
}
new Main();
