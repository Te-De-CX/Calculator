export type CustomInputProps = {
    value: string;
    onChange: (value: string) => void;
    readOnly?: boolean;
};

export type HistoryItem = {
    expression: string;
    result: string;
    timestamp: number;
};