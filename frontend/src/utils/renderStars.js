import React from 'react';

const renderStars = (rating) => {
  const fullStars = Math.round(rating);

  return (
    <>
      {[...Array(5)].map((_, i) => (
        <span
          key={i}
          style={{
            color: i < fullStars ? '#ffb829' : '#e4e5e9',
            fontSize: '20px',
          }}
        >
          ★
        </span>
      ))}
    </>
  );
};

export default renderStars;
