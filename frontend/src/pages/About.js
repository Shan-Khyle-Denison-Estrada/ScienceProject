import React from 'react';

// Reusable Team Member Row
// Sizes Adjusted: Image w-28 h-28 (112px), Name text-3xl, Role text-lg
const TeamMember = ({ name, role, image, isRightAligned, zIndex }) => {
  return (
    <div className={`flex items-center w-full relative ${zIndex}`}>
      {/* If Right Aligned, text comes first */}
      {isRightAligned && (
        <div className="flex-1 pr-6 flex flex-col justify-center">
            <h3 className="text-white text-3xl text-right leading-tight">{name}</h3>
            <p className="text-white opacity-90 text-right text-lg">{role}</p>
        </div>
      )}

      {/* The Image Circle - Adjusted to w-28 h-28 */}
      <div className="w-28 h-28 rounded-full border-4 border-white shadow-xl overflow-hidden bg-white flex-shrink-0 z-10">
        <img src={image} alt={name} className="w-full h-full object-cover" />
      </div>

      {/* If Left Aligned (Standard), text comes second */}
      {!isRightAligned && (
        <div className="flex-1 pl-6 flex flex-col justify-center">
            <h3 className="text-white text-3xl text-left leading-tight">{name}</h3>
            <p className="text-white opacity-90 text-left text-lg">{role}</p>
        </div>
      )}
    </div>
  );
};

function About() {
  return (
    // Main Container
    <div className="h-[calc(100vh-80px)] bg-primary font-switzal overflow-hidden flex flex-col">
      
      {/* Header */}
      <div className="shrink-0 pt-4 pb-1 flex justify-center items-center">
         {/* Logo Placeholder - Adjusted to w-16 h-16 */}
         <div className="w-16 h-16 mr-2">
            <img 
              src="/Vector-White.svg" 
              alt="Logo" 
              className="w-full h-full object-contain" 
            />
         </div>
         {/* Header Title - Adjusted to text-5xl */}
         <h1 className="text-white text-5xl -ml-4">VisionCheck</h1>
      </div>

      {/* Description */}
      <div className="shrink-0 px-8 text-center mb-1">
        {/* Description Text - Adjusted to text-lg */}
        <p className="text-white text-xl leading-snug max-w-4xl mx-auto text-justify">
        &emsp; VisionCheck offers a promising and cost-effective solution to support large-scale vision screening, particularly in regions with limited access to professional eye care.
        </p>
      </div>

      {/* Team Section */}
      <div className="flex-1 flex flex-col px-4 min-h-0">
        {/* Section Title - Adjusted to text-4xl */}
        <h2 className="shrink-0 text-center text-white text-4xl -mb-16 mt-4">The Team</h2>
        
        {/* Team Grid: justify-center with gap-1 */}
        <div className="flex-1 flex flex-col justify-center gap-1">
            {/* Row 1 (Image Left) */}
            <TeamMember 
                name="Shan Khyle Estrada" 
                role="Lead Researcher & AI Specialist" 
                image="/shan.png"
                zIndex="z-40"
            />

            {/* Row 2 (Image Right) */}
            <TeamMember 
                name="Angelo John Landiao" 
                role="Researcher" 
                image="/aj.png" 
                isRightAligned={true}
                zIndex="z-30"
            />

            {/* Row 3 (Image Left) */}
            <TeamMember 
                name="Hans Christian Alfaras" 
                role="Research Liaison" 
                image="/hans.png"
                zIndex="z-20"
            />

            {/* Row 4 (Image Right) */}
            <TeamMember 
                name="Jaydee Ballaho" 
                role="Research Adviser" 
                image="/jaydee.png" 
                isRightAligned={true}
                zIndex="z-10"
            />
        </div>
      </div>
    </div>
  );
}

export default About;