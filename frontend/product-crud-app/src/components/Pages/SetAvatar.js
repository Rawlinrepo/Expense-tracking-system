import React, { useState } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';

const categories = ['lorelei', 'micah', 'notionists', 'personas', 'thumbs', 'adventurer'];

const avatarTypes = {
  lorelei: [
    'Jessica', 'Vivian', 'Jude', 'Ryan', 'Wyatt', 
    'Kimberly', 'Katherine', 'Leah', 'Robert', 
    'Maria', 'Eliza', 'Amaya', 'Ryker', 'Sophia', 
    'Caleb', 'Nolan', 'Sarah', 'Adrian', 'George', 
    'Brooklynn'
  ],
  micah: [
    'Jessica', 'Vivian', 'Jude', 'Ryan', 'Wyatt', 
    'Kimberly', 'Katherine', 'Leah', 'Robert', 
    'Maria', 'Eliza', 'Amaya', 'Ryker', 'Sophia', 
    'Caleb', 'Nolan', 'Sarah', 'Adrian', 'George', 
    'Brooklynn'
  ],
  notionists: [
    'Jessica', 'Vivian', 'Jude', 'Ryan', 'Wyatt', 
    'Kimberly', 'Katherine', 'Leah', 'Robert', 
    'Maria', 'Eliza', 'Amaya', 'Ryker', 'Sophia', 
    'Caleb', 'Nolan', 'Sarah', 'Adrian', 'George', 
    'Brooklynn'
  ],
  personas: [
    'Jessica', 'Vivian', 'Jude', 'Ryan', 'Wyatt', 
    'Kimberly', 'Katherine', 'Leah', 'Robert', 
    'Maria', 'Eliza', 'Amaya', 'Ryker', 'Sophia', 
    'Caleb', 'Nolan', 'Sarah', 'Adrian', 'George', 
    'Brooklynn'
  ],
  thumbs: [
    'Jessica', 'Vivian', 'Jude', 'Ryan', 'Wyatt', 
    'Kimberly', 'Katherine', 'Leah', 'Robert', 
    'Maria', 'Eliza', 'Amaya', 'Ryker', 'Sophia', 
    'Caleb', 'Nolan', 'Sarah', 'Adrian', 'George', 
    'Brooklynn'
  ],
  adventurer: [
    'Jessica', 'Vivian', 'Jude', 'Ryan', 'Wyatt', 
    'Kimberly', 'Katherine', 'Leah', 'Robert', 
    'Maria', 'Eliza', 'Amaya', 'Ryker', 'Sophia', 
    'Caleb', 'Nolan', 'Sarah', 'Adrian', 'George', 
    'Brooklynn'
  ]
};

const AvatarSelector = ({ onAvatarSelect }) => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [imgURLs, setImgURLs] = useState([]);
  const [selectedAvatarName, setSelectedAvatarName] = useState('');

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setImgURLs([]);
    setSelectedAvatarName('');

    if (category) {
      setLoading(true);
      const newImgURLs = avatarTypes[category].map(type => 
        `https://api.dicebear.com/9.x/${category}/svg?seed=${type}`
      );
      setImgURLs(newImgURLs);
      setLoading(false);
    }
  };

  const handleImageClick = (name) => {
    setSelectedAvatarName(name);
    onAvatarSelect(selectedCategory, name);
  };

  return (
    <div>
      <h2>Select Avatar Category</h2>
      <Dropdown data-bs-theme="dark">
        <DropdownButton
          id="dropdown-category"
          variant="secondary"
          title={selectedCategory || "Select a category"}
          onSelect={handleCategorySelect}
        >
          {categories.map((category) => (
            <Dropdown.Item key={category} eventKey={category}>
              {category}
            </Dropdown.Item>
          ))}
        </DropdownButton>
      </Dropdown>

      {loading && <p>Loading...</p>}

      {imgURLs.length > 0 && (
        <div>
          <h3>Avatar Preview</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {imgURLs.map((imgURL, index) => {
              const avatarName = avatarTypes[selectedCategory][index];
              const isSelected = selectedAvatarName === avatarName;
              return (
                <div
                  key={index}
                  onClick={() => handleImageClick(avatarName)}
                  style={{
                    cursor: 'pointer',
                    border: isSelected ? '2px solid green' : 'none',
                    borderRadius: '5px',
                    padding: '5px'
                  }}
                >
                  <img
                    src={imgURL}
                    alt={avatarName}
                    style={{ width: '100px', height: '100px' }}
                  />
                  <p>{avatarName}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default AvatarSelector;