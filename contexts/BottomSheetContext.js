import React, { createContext, useContext, useRef, useState,
useMemo, useCallback } from 'react';
const BottomSheetContext = createContext();

export const useBottomSheet = () => {
  return useContext(BottomSheetContext);
};

export const BottomSheetProvider = ({ children }) => {
  const [selectedTask, setSelectedTask] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const bottomSheetRef = useRef(null);

  const expandWithTask = useCallback(() => {
    bottomSheetRef.current?.expand();
  }, []);
  
  const expand = useCallback(() => {
    bottomSheetRef.current?.expand();
  }, []);
  const close = useCallback(() => {
    bottomSheetRef.current?.close();
  }, []);

  const contextValue = useMemo(() => {
    return {
      ref: bottomSheetRef,
      expand,
      close,
      expandWithTask,
      selectedTask,
      isEditing,
      setSelectedTask,
      setIsEditing,
    };
  }, [expandWithTask, isEditing, selectedTask]);
  
  return (
    <BottomSheetContext.Provider value={contextValue}>
      {children}
    </BottomSheetContext.Provider>
  );
};