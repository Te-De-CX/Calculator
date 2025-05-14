import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

const Input: React.FC<InputProps> = ({ label, error, ...props }) => {
    return (
        <div style={{ marginBottom: '1rem' }}>
            {label && (
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                    {label}
                </label>
            )}
            <input
                {...props}
                style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: error ? '1px solid #e53e3e' : '1px solid #ccc',
                    borderRadius: '4px',
                    fontSize: '1rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                }}
            />
            {error && (
                <span style={{ color: '#e53e3e', fontSize: '0.875rem' }}>{error}</span>
            )}
        </div>
    );
};

export default Input;