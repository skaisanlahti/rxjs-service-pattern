import React from 'react';

// https://gist.github.com/sw-yx/f18fe6dd4c43fddb3a4971e80114a052

/**
 * Creates a typed context with a non-nullable value and a hook to access it.
 * @returns Context Hook and Context Provider
 */
export default function createTypedContext<Value>() {
  const context = React.createContext<Value | undefined>(undefined);

  function useTypedContext() {
    const value = React.useContext(context);
    if (!value)
      throw new Error('useTypedContext must be inside a Provider with a value');
    return value;
  }

  return [useTypedContext, context.Provider] as const;
}
