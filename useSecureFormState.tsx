import { ChangeEvent, useRef, useState } from 'react';

export const useSecureFormState = (initialData: {
    name?: string;
    email?: string;
    password: string;
    identifier?: string;
}) => {
    const [data, setData] = useState(initialData);

    const passwordRef = useRef<HTMLInputElement>(null);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setData((prevData) => ({ ...prevData, [name]: value }));
    };
    return [data, handleChange, passwordRef] as const;
};
