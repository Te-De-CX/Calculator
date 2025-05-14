import React from 'react';

type ButtonProps = {
    label: string;
    onClick: () => void;
    type?: 'primary' | 'secondary' | 'operator' | 'equal';
    disabled?: boolean;
};

const getButtonStyle = (type: ButtonProps['type']) => {
    switch (type) {
        case 'primary':
            return {
                background: '#f0f0f0',
                color: '#222',
            };
        case 'operator':
            return {
                background: '#ff9500',
                color: '#fff',
            };
        case 'equal':
            return {
                background: '#34c759',
                color: '#fff',
            };
        case 'secondary':
        default:
            return {
                background: '#d4d4d2',
                color: '#222',
            };
    }
};

const Button: React.FC<ButtonProps> = ({
    label,
    onClick,
    type = 'primary',
    disabled = false,
}) => {
    const style = {
        ...getButtonStyle(type),
        border: 'none',
        borderRadius: '8px',
        fontSize: '1.5rem',
        padding: '16px',
        margin: '4px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        width: '60px',
        height: '60px',
        transition: 'background 0.2s',
    };

    return (
        <button style={style} onClick={onClick} disabled={disabled}>
            {label}
        </button>
    );
};

export default Button;