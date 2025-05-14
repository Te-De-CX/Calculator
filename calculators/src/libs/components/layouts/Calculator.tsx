'use client'

import React, { useState, useEffect } from "react";
import { HiOutlineClock, HiX } from "react-icons/hi";
import { HistoryItem } from "@/libs/types/History";
import { getHistoryFromLocalStorage, clearHistory, addToHistory } from "@/libs/logic/History";

// ===== Button Component =====
type ButtonProps = {
  label: string;
  onClick: () => void;
  type?: 'primary' | 'secondary' | 'operator' | 'equal' | 'history';
  disabled?: boolean;
};

const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  type = 'primary',
  disabled = false,
}) => {
  const baseStyle = {
    border: 'none',
    borderRadius: '50%',
    fontSize: '1.5rem',
    width: '60px',
    height: '60px',
    margin: '8px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: `
      0 4px 6px rgba(0, 0, 0, 0.1),
      0 1px 3px rgba(0, 0, 0, 0.08),
      inset 0 -2px 4px rgba(0, 0, 0, 0.1)
    `,
    transform: 'translateY(0)',
    '&:active': {
      transform: 'translateY(2px)',
      boxShadow: `
        0 2px 4px rgba(0, 0, 0, 0.1),
        0 1px 2px rgba(0, 0, 0, 0.08),
        inset 0 -1px 2px rgba(0, 0, 0, 0.1)
      `
    },
    '&:hover:not(:disabled)': {
      boxShadow: `
        0 6px 8px rgba(0, 0, 0, 0.1),
        0 2px 4px rgba(0, 0, 0, 0.08),
        inset 0 -2px 4px rgba(0, 0, 0, 0.1)
      `
    }
  };

  const typeStyles = {
    primary: {
      background: 'linear-gradient(145deg, #f0f0f0, #cacaca)',
      color: '#222',
    },
    operator: {
      background: 'linear-gradient(145deg, #ff9500, #e68600)',
      color: '#fff',
    },
    equal: {
      background: 'linear-gradient(145deg, #34c759, #2da64e)',
      color: '#fff',
    },
    secondary: {
      background: 'linear-gradient(145deg, #d4d4d2, #b3b3b1)',
      color: '#222',
    },
    history: {
      background: 'linear-gradient(145deg, #a7a7a7, #8e8e8e)',
      color: '#fff',
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        ...baseStyle,
        ...typeStyles[type],
        ...(type === 'history' && { borderRadius: '8px', width: 'auto', padding: '0 20px' })
      }}
    >
      {type === 'history' ? <HiOutlineClock size={24} /> : label}
    </button>
  );
};

// ===== Input Component =====
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input: React.FC<InputProps> = ({ error, ...props }) => {
  return (
    <div style={{ marginBottom: '1rem', width: '100%' }}>
      <input
        {...props}
        style={{
          width: '100%',
          padding: '20px',
          border: error ? '1px solid #e53e3e' : 'none',
          borderRadius: '12px',
          fontSize: '2rem',
          outline: 'none',
          boxSizing: 'border-box',
          background: '#f5f5f5',
          boxShadow: `
            inset 2px 2px 5px #d0d0d0,
            inset -2px -2px 5px #ffffff
          `,
          textAlign: 'right',
          fontFamily: 'monospace',
          fontWeight: 'bold'
        }}
      />
      {error && (
        <span style={{ color: '#e53e3e', fontSize: '0.875rem' }}>{error}</span>
      )}
    </div>
  );
};

// ===== Calculator Component =====
const buttons = [
  ["7", "8", "9", "/"],
  ["4", "5", "6", "*"],
  ["1", "2", "3", "-"],
  ["0", ".", "=", "+"],
  ["C", "⌫", "H"]
];

const isOperator = (val: string) => ["+", "-", "*", "/"].includes(val);

const Calculator: React.FC = () => {
  const [input, setInput] = useState<string>("");
  const [result, setResult] = useState<string>("");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState<boolean>(false);

  useEffect(() => {
    setHistory(getHistoryFromLocalStorage());
  }, []);

  const handleButtonClick = (value: string) => {
    if (value === "C") {
      setInput("");
      setResult("");
      return;
    }
    
    if (value === "⌫") {
      setInput(prev => prev.slice(0, -1));
      setResult("");
      return;
    }
    
    if (value === "H") {
      setShowHistory(!showHistory);
      return;
    }
    
    if (value === "=") {
      try {
        if (!input) return;
        
        const evalResult = eval(input);
        const resultString = evalResult.toString();
        setResult(resultString);
        const updatedHistory = addToHistory(input, resultString);
        setHistory(updatedHistory);
      } catch {
        setResult("Error");
      }
      return;
    }
    
    if (isOperator(value) && (input === "" || isOperator(input[input.length - 1]))) {
      return;
    }
    
    setInput(prev => prev + value);
    setResult("");
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleClearHistory = () => {
    const clearedHistory = clearHistory();
    setHistory(clearedHistory);
  };

  const getButtonType = (btn: string) => {
    if (btn === "C") return 'secondary';
    if (btn === "H") return 'history';
    if (btn === "=") return 'equal';
    if (isOperator(btn)) return 'operator';
    return 'primary';
  };

  return (
    <div style={{
      maxWidth: '360px',
      margin: '2rem auto',
      padding: '2rem',
      borderRadius: '20px',
      background: '#f0f0f0',
      boxShadow: `
        20px 20px 60px #d9d9d9,
        -20px -20px 60px #ffffff
      `,
      position: 'relative'
    }}>
      <Input
        value={result || input || "0"}
        onChange={() => {}}
        readOnly
      />
      
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
        {buttons.flat().map((btn, idx) => (
          <Button
            key={idx}
            label={btn}
            onClick={() => handleButtonClick(btn)}
            type={getButtonType(btn)}
          />
        ))}
      </div>
      
      {/* History Modal */}
      {showHistory && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          backdropFilter: 'blur(5px)'
        }}>
          <div style={{
            background: '#fff',
            borderRadius: '16px',
            padding: '24px',
            width: '90%',
            maxWidth: '400px',
            maxHeight: '80vh',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <h2 style={{ margin: 0, fontSize: '1.5rem' }}>Calculation History</h2>
              <button 
                onClick={() => setShowHistory(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '1.5rem',
                  color: '#666'
                }}
              >
                <HiX />
              </button>
            </div>
            
            <div style={{ overflowY: 'auto', flex: 1 }}>
              {history.length === 0 ? (
                <p style={{ 
                  textAlign: 'center', 
                  color: '#666',
                  padding: '20px 0'
                }}>
                  No history yet
                </p>
              ) : (
                <ul style={{ 
                  listStyle: 'none', 
                  padding: 0,
                  margin: 0
                }}>
                  {history.map((item, index) => (
                    <li 
                      key={index} 
                      style={{
                        padding: '12px',
                        borderBottom: '1px solid #eee',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        transition: 'background 0.2s',
                      }}
                      onClick={() => {
                        setInput(item.expression);
                        setResult(item.result);
                        setShowHistory(false);
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{ 
                          fontWeight: 'bold',
                          fontSize: '1.1rem'
                        }}>
                          {item.expression}
                        </div>
                        <div style={{ color: '#666' }}>
                          = {item.result}
                        </div>
                      </div>
                      <div style={{ 
                        color: '#999',
                        fontSize: '0.9rem'
                      }}>
                        {formatTimestamp(item.timestamp)}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            
            <button 
              onClick={handleClearHistory}
              style={{
                background: '#ff4444',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '12px',
                marginTop: '20px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: 'bold',
                transition: 'background 0.2s',
              }}
            >
              Clear All History
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calculator;