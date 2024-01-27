import React from 'react';
import PropTypes from 'prop-types';

function renderLinksInText(text) {
  // Regular expression to match hyperlinks in the format [name](link)
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;

  // Split the text into parts, where links will be replaced
  const parts = text.split(linkRegex);
  const elements = [];

  // Iterate through the parts and replace links with anchor elements
  for (let i = 0; i < parts.length; i++) {
    if (i % 3 === 0) {
      // This part is plain text
      elements.push(parts[i]);
    } else if (i % 3 === 2) {
      // This part is the actual link enclosed in ()
      const link = parts[i];
      elements.push(
        <a key={i} href={link} target="_blank" rel="noopener noreferrer">
          {parts[i - 1]} {/* Use the previous part (inside square brackets) as the link text */}
        </a>
      );
    }
  }

  return elements;
}

function HyperlinkRenderer({ text }) {
  return <div>{renderLinksInText(text)}</div>;
}

HyperlinkRenderer.propTypes = {
  text: PropTypes.string.isRequired,
};

export default HyperlinkRenderer;
