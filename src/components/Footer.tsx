import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="background-dark text-light py-3">
      <div className="container text-center">
        <a href="https://www.fathin.my.id" className="text-light text-decoration-none">
          &copy; {new Date().getFullYear()} Fathin.my.id
        </a>
      </div>
    </footer>
  );
};

export default Footer;
