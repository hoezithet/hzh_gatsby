import React, { useRef, useState, useContext, useEffect } from 'react';

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
}

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

export function useStore<T>(): [T, (newEl: T) => void, boolean] {
    const idRef = useRef(-1);
    const [ownElement, setOwnElement] = useState<T>();  // Only used when there's no context
    let store = useContext(StoreContext);
    const usingContext = (
        'registerElement' in store
        && 'setElement' in store
        && 'getElement' in store
    );
    const {registerElement, setElement, getElement} = (
        usingContext ?
        store
        : {
            registerElement: (idCallback) => idCallback(0),
            setElement: (_id, el) => setOwnElement(el),
            getElement: (_id) => ownElement
        }) as StoreContextType<T>;

    const getEl = () => getElement(idRef.current);
    const setEl = (newEl: T) => {
        setElement(idRef.current, newEl);
    };

    useEffect(() => {
        registerElement((assignedId) => idRef.current = assignedId);
    }, []);

    useEffect(() => {
        setEl(null);
    }, [idRef.current]);

    return [getEl(), setEl, usingContext];
};