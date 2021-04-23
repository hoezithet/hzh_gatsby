import React, { useRef } from 'react';

type idCallbackType = (id: number) => void;

export interface StoreContextType<T> {
    registerElement: (callback: idCallbackType) => void;
    setElement: (id: number, value: T) => void;
    getElement: (id: number) => T | null;
}

interface StoreProps<T> {
    children: React.ReactNode;
    elements: T[];
    setElements: (getNextElements: ((elements: T[]) => T[])) => void;
};

export const StoreContext = React.createContext({});

export function Store<T>({ children, elements, setElements }: StoreProps<T>) {
    const idxCounterRef = useRef(0);

    const registerElement = (callback: idCallbackType) => {
        callback(idxCounterRef.current);
        idxCounterRef.current += 1;
    };

    const setElement = (id: number, element: T) => {
        setElements(elements => {
            let newElements = [...elements];
            if (id < 0) {
                return newElements;
            } else if (id >= newElements.length) {
                newElements = [
                    ...newElements,
                    ...Array(id - newElements.length).fill({} as T)
                ];
            }
            newElements[id] = element;
            return newElements;
        });
    };

    const getElement = (id: number) => {
        if (id === -1 || id >= elements.length) {
            return null;
        }
        return elements[id];
    };

    return (
        <StoreContext.Provider value={{ registerElement: registerElement, setElement: setElement, getElement: getElement }}>
            { children}
        </StoreContext.Provider>
    );
};