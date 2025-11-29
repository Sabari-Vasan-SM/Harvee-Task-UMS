import React from 'react';

const Loader = () => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      zIndex: 9999
    }}>
      <div className="spinner" />
      <style>{`
        .spinner {
          position: relative;
          width: 35.2px;
          height: 35.2px;
        }

        .spinner::before,
        .spinner::after {
          content: '';
          width: 100%;
          height: 100%;
          display: block;
          animation: spinner-b4c8mmhg 0.5s backwards, spinner-49opz7hg 1.25s 0.5s infinite ease;
          border: 8.8px solid #ffffff;
          border-radius: 50%;
          box-shadow: 0 -52.8px 0 -8.8px #ffffff;
          position: absolute;
        }

        .spinner::after {
          animation-delay: 0s, 1.25s;
        }

        @keyframes spinner-b4c8mmhg {
          from {
            box-shadow: 0 0 0 -8.8px #ffffff;
          }
        }

        @keyframes spinner-49opz7hg {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default Loader;
