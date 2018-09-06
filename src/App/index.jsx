import BulmaLoader from 'Library/BulmaLoader'
import React from 'react'
import ReactDOM from 'react-dom'

import Navbar from 'Layout/Navbar'
import IntroBanner from 'Components/IntroBanner'
import ProfileSection from 'Components/Sections/ProfileSection'
import ExperienceSection from 'Components/Sections/ExperienceSection'
import TechnologySection from 'Components/Sections/TechnologySection'
import EducationSection from 'Components/Sections/EducationSection'
import PortfolioSection from 'Components/Sections/PortfolioSection'
import ContactSection from 'Components/Sections/ContactSection'
import Footer from 'Layout/Footer'

BulmaLoader.attach();
ReactDOM.render(
   <div>
      <Navbar/>
      <IntroBanner/>
      <ProfileSection className="has-background-white"/>
      <ExperienceSection className="has-bg-full-2 has-text-white"/>
      <TechnologySection className="has-background-white"/>
      <EducationSection className="has-bg-full-3 has-text-white"/>
      <PortfolioSection className="has-background-white"/>
      <ContactSection className="has-bg-full-4 has-text-white"/>
      <Footer/>
   </div>,
   document.getElementById('app')
);