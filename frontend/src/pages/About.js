import React from 'react';

// Reusable Team Member Row
const TeamMember = ({ name, role, image, isRightAligned }) => {
  return (
    <div className={`flex flex-col md:flex-row items-center w-full max-w-4xl mx-auto py-4 ${isRightAligned ? 'md:flex-row-reverse' : ''}`}>
      
      {/* Text Section (Mobile: Always Bottom, Desktop: Left or Right) */}
      <div className={`flex-1 px-6 flex flex-col justify-center items-center ${isRightAligned ? 'md:items-end md:text-right' : 'md:items-start md:text-left'} text-center mt-4 md:mt-0`}>
          <h3 className="text-white text-2xl md:text-3xl font-bold leading-tight">{name}</h3>
          <p className="text-white/80 text-lg md:text-xl font-light">{role}</p>
      </div>

      {/* Image Circle */}
      <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white/20 shadow-2xl overflow-hidden bg-white/10 shrink-0 mx-6 transform transition-transform hover:scale-105">
        <img src={image} alt={name} className="w-full h-full object-cover" />
      </div>

      {/* Spacer for alignment on desktop */}
      <div className="flex-1 hidden md:block"></div>
    </div>
  );
};

function About() {
  return (
    <div className="bg-primary min-h-screen font-switzal overflow-y-auto pb-28">
      
      {/* Header */}
      <div className="pt-8 pb-6 flex flex-col justify-center items-center px-4">
         <div className="w-20 h-20 bg-white/10 rounded-full p-3 mb-3 shadow-inner">
            <img 
              src="/Vector-White.svg" 
              alt="Logo" 
              className="w-full h-full object-contain" 
            />
         </div>
         <h1 className="text-white text-4xl md:text-6xl font-bold tracking-tight">VisionCheck</h1>
         
         <div className="mt-6 max-w-2xl text-center">
            <p className="text-white/90 text-lg md:text-xl leading-relaxed">
            VisionCheck offers a promising and cost-effective solution to support large-scale vision screening, particularly in regions with limited access to professional eye care.
            </p>
         </div>
      </div>

      <div className="w-full h-[1px] bg-white/20 max-w-4xl mx-auto my-4"></div>

      {/* Team Section */}
      <div className="flex flex-col px-4 pb-8">
        <h2 className="text-center text-white text-3xl md:text-4xl font-bold mb-8 opacity-90">Meet The Team</h2>
        
        <div className="flex flex-col gap-6 md:gap-2">
            <TeamMember 
                name="Shan Khyle Estrada" 
                role="Lead Researcher & AI Specialist" 
                image="/shan.png"
            />
            <TeamMember 
                name="Hans Christian Alfaras" 
                role="Research Liaison" 
                image="/hans.png" 
                isRightAligned={true}
            />
            <TeamMember 
                name="Angelo John Landiao" 
                role="Researcher" 
                image="/aj.png"
            />
            <TeamMember 
                name="Jaydee Ballaho" 
                role="Research Adviser" 
                image="/jaydee.png" 
                isRightAligned={true}
            />
        </div>
      </div>
    </div>
  );
}

export default About;