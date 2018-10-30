import React from 'react'
import ReactDOM from 'react-dom'

import AOS from 'aos'
import 'aos/dist/aos.css';

import Navbar from 'Layout/Navbar'
import IntroBanner from 'Components/IntroBanner'
import ProfileSection from 'Components/Sections/ProfileSection'
import ExperienceSection from 'Components/Sections/ExperienceSection'
import TechnicSection from 'Components/Sections/TechnicSection'
import EducationSection from 'Components/Sections/EducationSection'
import PortfolioSection from 'Components/Sections/PortfolioSection'
import ContactSection from 'Components/Sections/ContactSection'
import Footer from 'Layout/Footer'

ReactDOM.render(
   <div>
      <Navbar/>
      <IntroBanner/>
      <ProfileSection className="has-background-white"/>
      <ExperienceSection className="has-bg-full-2 has-text-white"/>
      <TechnicSection className="has-background-white"/>
      <EducationSection className="has-bg-full-3 has-text-white"/>
      <PortfolioSection className="has-background-white"/>
      <ContactSection className="has-bg-full-4 has-text-white"/>
      <Footer/>
   </div>,
   document.getElementById('app')
);

AOS.init();