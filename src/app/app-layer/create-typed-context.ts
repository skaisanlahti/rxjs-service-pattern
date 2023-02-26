import React from 'react';

// https://gist.github.com/sw-yx/f18fe6dd4c43fddb3a4971e80114a052

export function createTypedContext<A>() {
  const context = React.createContext<A | undefined>(undefined);

  function useTypedContext() {
    const value = React.useContext(context);
    if (!value)
      throw new Error('useTypedContext must be inside a Provider with a value');
    return value;
  }

  return [useTypedContext, context.Provider] as const;
}
