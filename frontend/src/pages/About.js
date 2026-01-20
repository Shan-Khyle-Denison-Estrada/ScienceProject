import React from 'react';

// Reusable Team Member Row
const TeamMember = ({ name, role, image, isRightAligned, zIndex }) => {
  return (
    <div className={`flex items-center w-full mb-6 relative ${zIndex}`}>
      {/* If Right Aligned, text comes first */}
      {isRightAligned && (
        <div className="flex-1 pr-4 flex flex-col justify-center">
            <h3 className="text-white text-4xl text-right font-bold leading-tight">{name}</h3>
            <p className="text-white opacity-80 text-right text-lg">{role}</p>
        </div>
      )}

      {/* The Image Circle */}
      <div className="w-32 h-32 rounded-full border-4 border-white shadow-xl overflow-hidden bg-white flex-shrink-0 z-10">
        <img src={image} alt={name} className="w-full h-full object-cover" />
      </div>

      {/* If Left Aligned (Standard), text comes second */}
      {!isRightAligned && (
        <div className="flex-1 pl-4 flex flex-col justify-center">
            <h3 className="text-white text-4xl text-left font-bold leading-tight">{name}</h3>
            <p className="text-white opacity-80 text-left text-lg">{role}</p>
        </div>
      )}
    </div>
  );
};

function About() {
  return (
    <div className="min-h-screen bg-primary pb-24 font-switzal overflow-hidden">
      
      {/* Header */}
      <div className="pt-10 pb-6 flex justify-center items-center">
         {/* Logo Placeholder */}
         <div className="w-16 h-16 bg-white rounded-full mr-4"></div>
         <h1 className="text-white text-6xl font-bold">VisionCheck</h1>
      </div>

      {/* Description */}
      <div className="px-8 text-center mb-12">
        <p className="text-white text-xl leading-relaxed">
        &emsp; VisionCheck offers a promising and cost-effective solution to support large-scale vision screening, particularly in regions with limited access to professional eye care.
        </p>
      </div>

      {/* Team Section */}
      <div className="px-4">
        <h2 className="text-center text-white text-5xl font-bold mb-10">The Team</h2>
        
        {/* Row 1 (Image Left) */}
        <TeamMember 
            name="Shan Khyle Estrada" 
            role="Lead Researcher & AI Specialist" 
            image="https://placehold.co/150x150/png"
            zIndex="z-40"
        />

        {/* Row 2 (Image Right) */}
        <TeamMember 
            name="Angelo John Landiao" 
            role="Lead Researcher & AI Specialist" 
            image="https://placehold.co/150x150/png" 
            isRightAligned={true}
            zIndex="z-30"
        />

        {/* Row 3 (Image Left) */}
        <TeamMember 
            name="Hans Christian Alfaras" 
            role="Research Liaison" 
            image="https://placehold.co/150x150/png"
            zIndex="z-20"
        />

        {/* Row 4 (Image Right) */}
        <TeamMember 
            name="Jaydee Ballaho" 
            role="Research Adviser" 
            image="https://placehold.co/150x150/png" 
            isRightAligned={true}
            zIndex="z-10"
        />
      </div>
    </div>
  );
}

export default About;