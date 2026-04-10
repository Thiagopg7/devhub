import { useEffect, useRef } from 'react';

export default function Input({ value, onChange, ...props }) {
    const input = useRef(null);

    useEffect(() => {
        if (input.current && input.current.hasAttribute('autofocus')) {
            input.current.focus();
        }
    }, []);

    return (
        <input
            {...props}
            className={`text-base rounded-md py-2 bg-slate-50 text-smt ${props.className || ''}`}
            value={value}
            onChange={(e) => onChange(e)}
            ref={input}
        />
    );
}
