import React, { useState } from 'react';
import './Slider.scss';
import { Icon } from '@iconify/react';

interface Slide {
  content: React.ReactNode;
}

const slides: Slide[] = [
  {
    content: (
      <div className='slide slide-1'>
        <div className='text-content'>
          <h2>Hello, je suis Avacyn !</h2>
          <p>Avacyn, c'est votre équipe d'agents intelligents pour automatiser et simplifier vos tâches quotidiennes.<br/><br/> Imaginez.. un agent gère votre agenda pendant qu'un autre trouve les dernières tendances de votre secteur. <br/>Que ce soit pour la recherche, le traitement de données ou la gestion de projets, nos agents sont là pour vous.</p>
        </div>
        <div className='image-content'>
          <img src='public/main.gif' alt='Slide 1 GIF' />
        </div>
      </div>
    ),
  },
  {
    content: (
      <div className='slide-2'>
        <div className='slide-2-content'>
          <div className='sub-section'>
            <img src='public/rag.gif' alt='Subsection 1 GIF' />
            <h3>Recherche d'informations</h3>
            <p>Besoin d'infos fiables rapidement ? Nos agents cherchent et extraient des données précises pour vous.<br/><br/> Par exemple, obtenez les dernières nouvelles du marché ou des études de cas en quelques secondes.</p>
          </div>
          <div className='sub-section'>
            <img src='public/ana.gif' alt='Subsection 2 GIF' />
            <h3>Traitement des données</h3>
            <p>Avec Avacyn, analyser et traiter vos données n'a jamais été aussi simple.<br/><br/> Transformez des rapports bruts en analyses claires pour les ventes, les campagnes marketing, ou les tendances de consommation.</p>
          </div>
        </div>
      </div>
    ),
  },
];



const Slider: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((currentSlide + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((currentSlide - 1 + slides.length) % slides.length);
  };

  return (
    <div className='slider-wrapper'>
      <div className='slider-background' />
      <div className='slider'>
        <div className='slider-content'>
          {slides[currentSlide].content}
        </div>
        <div className='slider-controls'>
          <button onClick={prevSlide} className='slider-button'>
            <Icon icon="mdi:chevron-left" className="slider-icon" />
          </button>
          <button onClick={nextSlide} className='slider-button'>
            <Icon icon="mdi:chevron-right" className="slider-icon" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Slider;
