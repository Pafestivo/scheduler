import React from 'react';
interface generalSettingsProps {
  calendar: {
    hash: string; 
    name: string; 
    image: string | null; 
    description: string | null;
  }
}

const GeneralSettings = ({ calendar }: generalSettingsProps) => {
  return (
    <div>
      <form>
      </form>
    </div>
  )
};

export default GeneralSettings;
